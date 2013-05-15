define(['durandal/system', 'services/logger', 'durandal/plugins/router', 'config', 'services/datacontext'],
    function (system, logger, router, config, datacontext) {

        var adminRoutes = ko.computed(function () {
            return router.allRoutes().filter(function (r) {
                return r.settings.admin;
            });
        });

        var shell = {
            activate: activate,
            adminRoutes: adminRoutes,
            addEvent: addEvent,
            router: router
        };
        return shell;

        function activate() {
            return datacontext.primeData()
                .then(boot)
                .fail(failedInitialization);


            function boot() {
                log('Club Diary Loaded!', null, true);
                router.map(config.routes);
                log('Activating startModule', config.startModule, true);
                return router.activate(config.startModule);
            }

            function failedInitialization(error) {
                var msg = 'App initialization failed: ' + error.message;
                logger.logError(msg, error, system.getModuleId(shell), true);
            }

        }

        function addEvent(item) {
            router.navigateTo(item.hash);
        }

        //#region Internal Methods

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        //#endregion
    });