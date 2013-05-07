define(['services/datacontext',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger'],
    function (datacontext, router, system, app, logger) {
        var event = ko.observable();
        var isSaving = ko.observable(false);
        var isDeleting = ko.observable(false);

        var activate = function (routeData) {
            var id = parseInt(routeData.id);
            //initLookups();
            return datacontext.getSessionById(id, event);
        };

        var initLookups = function () {
            //rooms(datacontext.lookups.rooms);
            //tracks(datacontext.lookups.tracks);
            //timeSlots(datacontext.lookups.timeslots);
        };

        var goBack = function () {
            router.navigateBack();
        };

        var hasChanges = ko.computed(function () {
            return datacontext.hasChanges();
        });

        var cancel = function () {
            datacontext.cancelChanges();
        };

        var canSave = ko.computed(function () {
            return hasChanges() && !isSaving();
        });

        var save = function () {
            isSaving(true);
            return datacontext.saveChanges().fin(complete);

            function complete() {
                isSaving(false);
            }
        };

        var deleteEvent = function () {
            var msg = 'Delete event "' + event().title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    event().entityAspect.setDeleted();
                    save().then(success).fail(failed).fin(finish);

                    function success() {
                        router.navigateTo('#/sessions');
                    }

                    function failed(error) {
                        cancel();
                        var errorMsg = 'Error: ' + error.message;
                        logger.logError(
                            errorMsg, error, system.getModuleId(vm), true);
                    }

                    function finish() {
                        return selectedOption;
                    }
                }
                isDeleting(false);
            }

        };

        var canDeactivate = function () {
            if (isDeleting()) { return false; }

            if (hasChanges()) {
                var title = 'Do you want to leave "' +
                    event().title() + '" ?';
                var msg = 'Navigate away and cancel your changes?';
                var checkAnswer = function (selectedOption) {
                    if (selectedOption === 'Yes') {
                        cancel();
                    }
                    return selectedOption;
                };
                return app.showMessage(title, msg, ['Yes', 'No'])
                    .then(checkAnswer);
            }
            return true;
        };

        var vm = {
            activate: activate,
            cancel: cancel,
            canDeactivate: canDeactivate,
            canSave: canSave,
            deleteEvent: deleteEvent,
            goBack: goBack,
            hasChanges: hasChanges,
            //rooms: rooms,
            //tracks: tracks,
            //timeSlots: timeSlots,
            save: save,
            event: event,
            title: 'Event Details'
        };
        return vm;
    });