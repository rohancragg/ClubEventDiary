define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };

    var remoteServiceName = 'api/Breeze';

    var routes = [{
        url: 'home',
        moduleId: 'viewmodels/home',
        name: 'Home',
        visible: true,
        caption: '<i class="icon-book"></i> Home'
    }, {
        url: 'forthcoming',
        moduleId: 'viewmodels/forthcoming',
        name: 'Forthcoming',
        visible: true,
        caption: '<i class="icon-book"></i> Forthcoming'
    }, {
        url: 'past',
        moduleId: 'viewmodels/past',
        name: 'Past',
        visible: true,
        caption: '<i class="icon-book"></i> Past'
    }, {
        url: 'eventdetail/:id',
        moduleId: 'viewmodels/eventdetail',
        name: 'Event Details',
        visible: false
    }, {
        url: 'eventedit/:id',
        moduleId: 'viewmodels/eventedit',
        name: 'Edit Event Details',
        visible: false
    }, {
        url: 'eventadd',
        moduleId: 'viewmodels/eventadd',
        name: 'Add Event',
        visible: false,
        caption: '<i class="icon-plus"></i> Add Event',
        settings: { admin: true }
    }];

    var startModule = 'home';

    return {
        debugEnabled: ko.observable(true),
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        routes: routes,
        startModule: startModule
    };
});