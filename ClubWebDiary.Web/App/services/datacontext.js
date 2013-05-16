define([
    'durandal/system',
    'services/model',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, model, config, logger, partialMapper) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;
        
        var getEventPartials = function (eventsObservable, when, forceRemote) {
            var query;
            if (!forceRemote) {
                query = buildQueryLocal('Events', orderBy.event);
                if (when == "past") {
                    query = query.where('eventDate', '<', new Date());
                } else if (when == "forthcoming") {
                    query = query.where('eventDate', '>', new Date());
                }
                
                log("Retrieving data locally from Breeze", query, true);
                var partials = manager.executeQueryLocally(query);
                
                //if (partials.length > 3) {
                    // Edge case
                    // We need this check because we may have 1 entity already.
                    // If we start on a specific person, this may happen. So we check for > 2, really
                    eventsObservable(partials);
                    return Q.resolve();
                //}
            }
            query = EntityQuery.from('Events')
                .select('id, title, shortDescription, eventDate')
                .orderBy(orderBy.event);
            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                var list = partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.event, 'id');
                if (eventsObservable) {
                    eventsObservable(list);
                }
                log('Retrieved [Events] from remote data source',
                    data, true);
            }
        };
        
        var getEventById = function (eventId, eventObservable) {
            log("Getting Entity by Id", eventId, true);
            // 1st - fetchEntityByKey will look in local cache 
            // first (because 3rd parm is true) 
            // if not there then it will go remote
            return manager.fetchEntityByKey(
                entityNames.event, eventId, true)
                .then(fetchSucceeded)
                .fail(queryFailed);

            // 2nd - Refresh the entity from remote store (if needed)
            function fetchSucceeded(data) {
                var event = data.entity;
                return event.isPartial() ? refreshEvent(event) : eventObservable(event);
            }

            function refreshEvent(event) {
                log("Getting full Entity from Partial", event, true);
                return EntityQuery.fromEntities(event)
                    .using(manager).execute()
                    .then(refreshSucceeded)
                    .fail(queryFailed);
            }

            function refreshSucceeded(data) {
                var event = data.results[0];
                event.isPartial(false);
                log('Retrieved [Event] from remote data source', event, true);
                return eventObservable(event);
            }

        };
        
        var primeData = function () {
            var promise = Q.all([
                //getLookups(),
                getEventPartials(null, null, true)])
                .then(applyValidators);

            return promise.then(success);

            function success() {
                //datacontext.lookups = {
                //rooms: getLocal('Rooms', 'name', true),
                //tracks: getLocal('Tracks', 'name', true),
                //timeslots: getLocal('TimeSlots', 'start', true),
                //speakers: getLocal('Persons', orderBy.speaker, true)
                //};
                log('Primed data', null, false);
            }

            function applyValidators() {
                //model.applyEventValidators(manager.metadataStore);
            }

        };

        var createEvent = function () {
            return manager.createEntity(entityNames.event);
        };

        var cancelChanges = function () {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        };

        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
                log('Saved data successfully', saveResult, true);
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + getErrorMessages(error);
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };      

        // change tracking

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        // exposing the public interface of the module
        var datacontext = {
            getEventPartials: getEventPartials,
            getEventById: getEventById,
            primeData: primeData,
            createEvent: createEvent,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges,
            hasChanges: hasChanges
        };
        return datacontext;

        //#region Internal methods        

        function buildQueryLocal(resource, ordering, includeNullos) {
            
            var query = EntityQuery.from(resource)
                .orderBy(ordering);

            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }

            return query;
        }

        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }

        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entitiesWithErrors.map(function (entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function (valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logError(msg, error);
            throw error;
        }

        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        //function getLookups() {
        //    return EntityQuery.from('Lookups')
        //        .using(manager).execute()
        //        .then(processLookups)
        //        .fail(queryFailed);
        //}

        //function processLookups() {
        //    model.createNullos(manager);
        //}

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }

        //#endregion
    })