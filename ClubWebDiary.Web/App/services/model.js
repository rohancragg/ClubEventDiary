define(['config', 'durandal/system', 'services/logger'],
    function(config, system, logger) {
        //var imageSettings = config.imageSettings;
        var nulloDate = new Date(2013, 0, 1);
        
        var orderBy = {
            event: 'eventDate, title'
        };
        
        var entityNames = {
            event: 'Event'
        };
        
        var model = {
            //applySessionValidators: applySessionValidators,
            configureMetadataStore: configureMetadataStore,
            createNullos: createNullos,
            entityNames: entityNames,
            orderBy: orderBy
        };
        return model;

        //#region Internal Methods
        function configureMetadataStore(metadataStore) {
            metadataStore.registerEntityTypeCtor(
                'Event', function () { this.isPartial = false; }, eventInitializer);

            //referenceCheckValidator = createReferenceCheckValidator();
            //Validator.register(referenceCheckValidator);
            //log('Validators registered');
        }
        
        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;

            //createNullo(entityNames.timeslot, { start: nulloDate, isSessionSlot: true });
            //createNullo(entityNames.room);
            //createNullo(entityNames.track);
            //createNullo(entityNames.event, { title: ' [Enter an Event Title]', eventDate: nulloDate });

            function createNullo(entityName, values) {
                var initialValues = values
                    || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }

        }
        
        // somewhere to put formatting logic etc
        function eventInitializer(event) {
            //event.tagsFormatted = ko.computed({
            //    read: function () {
            //        var text = event.tags();
            //        return text ? text.replace(/\|/g, ', ') : text;
            //    },
            //    write: function (value) {
            //        event.tags(value.replace(/\, /g, '|'));
            //    }
            //});
        }
        
        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(model), showToast);
        }

    });