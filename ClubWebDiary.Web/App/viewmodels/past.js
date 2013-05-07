﻿define(['services/logger', 'services/datacontext', 'durandal/plugins/router'],
    function (logger, datacontext, router) {
        var events = ko.observableArray();

        var vm = {
            activate: activate,
            events: events,
            title: 'Events'
        };
        return vm;

        //#region Internal Methods
        function activate() {

            logger.log('Past Events View Activated', null, 'home', true);
            return datacontext.getEventPastPartials(events);
        }
        //#endregion
    });