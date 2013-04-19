define(['services/logger'], function (logger) {
    var events = ko.observableArray();

    var vm = {
        activate: activate,
        events: events,
        title: 'Events'
    };
    return vm;

    return vm;

    //#region Internal Methods
    function activate() {
        // temp hard-coded data
        events = [
            { Id: 1, Title: 'Test1', Description: 'Test1 Desc', EventDate: '2013/01/01' },
            { Id: 1, Title: 'Test2', Description: 'Test2 Desc', EventDate: '2013/08/01' },
            { Id: 1, Title: 'Test3', Description: 'Test3 Desc', EventDate: '2013/15/01' }];

        logger.log('Home View Activated', null, 'home', true);
        return true;
    }
    //#endregion
});