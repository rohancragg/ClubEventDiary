define(['services/logger', 'services/datacontext'],
    function (logger, datacontext) {

        var vm = {
            activate: activate,
            title: 'Home'
        };
        return vm;

        //#region Internal Methods
        function activate() {
            logger.log('Home View Activated', null, 'home', true);
        }
        //#endregion
    });