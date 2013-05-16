define(['services/logger', 'services/datacontext', 'durandal/plugins/router'],
    function (logger, datacontext, router) {
        var events = ko.observableArray();

        var vm = {
            activate: activate,
            deactivate: deactivate,
            refresh: refresh,
            events: events,
            title: 'Events',
            viewAttached: viewAttached
        };
        return vm;

        function activate(routeData) {

            logger.log('Events View Activated', routeData, 'events', true);
            
            if (routeData.when == "past") {
                logger.log('Past Events View', null, 'events', true);
            } else if (routeData.when == "forthcoming") {
                logger.log('Forthcoming Events View', null, 'events', true);
            }

            return datacontext.getEventPartials(events);
        }
        
        function deactivate() {
            log("Deactivating");
            events([]);
        };

        function refresh() {
            log("Refreshing");
            return datacontext.getEventPartials(events, true);
        };
        
        function gotoDetails (selectedEvent) {
            if (selectedEvent && selectedEvent.id()) {
                var url = '#/eventedit/' + selectedEvent.id();
                router.navigateTo(url);
            }
        };

        function viewAttached (view) {
            bindEventToList(view, '.event-brief', gotoDetails);
        };

        function bindEventToList(rootSelector, selector, callback, eventName) {
            var eName = eventName || 'click';
            $(rootSelector).on(eName, selector, function () {
                var boundData = ko.dataFor(this);
                callback(boundData);
                return false;
            });
        };
        
    });