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
            //initLookups();
            event(datacontext.createEvent());
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
            goBack();
        };

        var canSave = ko.computed(function () {
            return hasChanges() && !isSaving();
        });

        var save = function () {
            isSaving(true);
            return datacontext.saveChanges()
                .then(goToEditView)
                .fin(complete);
            
            function goToEditView(result) {
                router.replaceLocation('#/eventdetail/' + event().id());
            }

            function complete() {
                isSaving(false);
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
            goBack: goBack,
            hasChanges: hasChanges,
            //rooms: rooms,
            //tracks: tracks,
            //timeSlots: timeSlots,
            save: save,
            event: event,
            title: 'Add Event'
        };
        return vm;
    });