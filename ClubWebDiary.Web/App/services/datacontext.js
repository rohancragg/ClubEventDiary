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

        var getEventForthcomingPartials = function (eventsObservable, forceRemote) {
            return getEventPartials(eventsObservable, forceRemote, false);
        };

        var getEventPastPartials = function (eventsObservable, forceRemote) {
            return getEventPartials(eventsObservable, forceRemote, true);
        };

        var getEventPartials = function (eventsObservable, forceRemote, past) {

            // prefer local cache unless remote requested by view model
            if (forceRemote) {
                // query to obtain only partial subset of entity properties
                var query = EntityQuery.from('Events')
                        .select('id, title, description, eventDate')
                        .orderBy(orderBy.event);

                manager.executeQuery(query)
                    .then(querySucceeded)
                    .then(dataBind)
                    .fail(queryFailed);
            } else {
                return dataBind();
            }

            function querySucceeded(data) {
                partialMapper.mapDtosToEntities(
                    manager, data.results, entityNames.event, 'id');
                log('Retrieved [Events] from remote data source', data, true);
            }

            function dataBind() {
                var p = getLocal('Events', orderBy.event, false, past);
                log('Databinding', p, true);
                if (p.length > 0) {
                    eventsObservable(p);
                    return Q.resolve();
                }
            }
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

        var primeData = function () {
            var promise = Q.all([
                //getLookups(),
                getEventPartials(null, true, false)])
                .then(applyValidators);

            return promise.then(success);

            function success() {
                datacontext.lookups = {
                    //rooms: getLocal('Rooms', 'name', true),
                    //tracks: getLocal('Tracks', 'name', true),
                    //timeslots: getLocal('TimeSlots', 'start', true),
                    //speakers: getLocal('Persons', orderBy.speaker, true)
                };
                log('Primed data', datacontext.lookups);
            }

            function applyValidators() {
                //model.applyEventValidators(manager.metadataStore);
            }

        };

        // change tracking

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        // exposing the public interface of the module
        var datacontext = {
            //createSession: createSession,
            getEventForthcomingPartials: getEventForthcomingPartials,
            getEventPastPartials: getEventPastPartials,
            hasChanges: hasChanges,
            //getEventById: getEventById,
            primeData: primeData,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges
        };
        return datacontext;

        //#region Internal methods        

        function getLocal(resource, ordering, includeNullos, past) {
            var query = EntityQuery.from(resource)
                .orderBy(ordering);

            if (past) {
                query = query.where('eventDate', '<', new Date());
            } else {
                query = query.where('eventDate', '>', new Date());
            }

            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }

            return manager.executeQueryLocally(query);
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