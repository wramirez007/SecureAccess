/**
 * Created by wramirez on 29/01/2015.
 */
/*RRHH.factory("OffererService", function($resource) {
 return $resource("/resources/Offerer/:id", { id: "@_id" },
 {
 'create':  { method: 'POST' },
 'index':   { method: 'GET', isArray: true },
 'show':    { method: 'GET', isArray: false },
 'update':  { method: 'PUT' },
 'destroy': { method: 'DELETE' }
 }
 );
 });*/

RRHH.service('OffererService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'Offerer/';
    function getUrl() {return ENDPOINT_URI + path;}
    function getUrlForId(itemId) {return getUrl(path) + itemId;}
    service.all = function () {return $http.get(getUrl());};
    service.fetch = function (itemId) {return $http.get(getUrlForId(itemId));};
    service.create = function (item) {return $http.post(getUrl(), item);};
    service.update = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.updateFamily = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.updateOfferEmployee = function (itemId, item) {return  $http.put(getUrlForId(itemId),item);   };
    service.addOffererEmployee = function (itemId, item) {return $http.put(getUrlForId(itemId),item);   };
    service.stateFalseOffererEmployee = function (itemId, item) {return $http.put(getUrlForId(itemId),item);   };
    service.destroy = function (itemId) {return $http.delete(getUrlForId(itemId));};
    service.url = function (itemId) {return getUrlForId(itemId);};
});
RRHH.service('UserAccountService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'userAccount/';
    function getUrl() {return ENDPOINT_URI + path;}
    service.create = function (item) {return $http.post(getUrl(), item);};
});

RRHH.service('PersonService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'Person/';
    function getUrl() {return ENDPOINT_URI + path;}
    function getUrlForId(itemId) {return getUrl(path) + itemId;}
    service.all = function () {return $http.get(getUrl());};
    service.fetch = function (itemId) {return $http.get(getUrlForId(itemId));};
    service.create = function (item) {return $http.post(getUrl(), item);};
    service.update = function (itemId, item) {return $http.put(getUrlForId(itemId), item);};
    service.destroy = function (itemId) {return $http.delete(getUrlForId(itemId));};
});

RRHH.service('MenuItemsService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'MenuItems/';

    function getUrl() {return ENDPOINT_URI + path;}

    function getUrlForId(itemId) {return getUrl(path) + itemId;}

    service.all = function () {return $http.get(getUrl());};

    service.fetch = function (itemId) {return $http.get(getUrlForId(itemId));};

    service.create = function (item) {return $http.post(getUrl(), item);};

    service.update = function (itemId, item) {return $http.put(getUrlForId(itemId), item);};

    service.destroy = function (itemId) {return $http.delete(getUrlForId(itemId));};
});

RRHH.service('GenericService', function ($http, ENDPOINT_URI) {
    var service = this;

    function getUrl() {
        return ENDPOINT_URI;
    }

    service.allCountry=function(){
        return $http.get(getUrl()+'Country');
    };

    service.allStatesByCountry=function(ID){
        return $http.get(getUrl()+'Country/'+ID+'/States');
    };

    service.allCitysByState=function(ID){
        return $http.get(getUrl()+'State/'+ID+'/Citys');
    };

    service.getByURL=function(URL){
        return $http.get(getUrl()+URL);
    };

    service.getByURLPath=function(URL){
        return $http.get(URL);
    };

    service.putByURL = function (URL,item) {return $http.put(getUrl()+URL, item);};
    service.postByURL = function (URL,item) {return $http.post(getUrl()+URL, item);};
    service.deleteByURL = function (URL,itemId) {return $http.delete(getUrl()+URL+"/"+itemId);};
    service.allFieldDataType=function(ID){
        return $http.get(getUrl()+'FieldDataType/list');
    };


    service.googleUserInfo=function(token){
        return $http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+token);
    };

    service.AuthUserInfo=function(token,provider,guid){
        var req = {
            method: 'POST',
            url: 'http://example.com',
            headers: {
                'Content-Type': undefined
            },
            data: { test: 'test' }
        }
        var url='';
        var options={};
        if(provider=='google'){
            url='https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+token;
            options={url:url};
        }else if(provider=='facebook'){
            url='https://graph.facebook.com/me?access_token='+token;
            options={url:url};
        }else if(provider=='linkedin'){
            url='https://api.linkedin.com/v1/people/~:(firstName,headline,id,lastName,siteStandardProfileRequest,email-address,picture-url)?format=json&oauth2_access_token='+token; //?format=json
            options={
                url:url
            };
        }else if(provider=='yahoo'){
            options = {
                url: 'https://social.yahooapis.com/v1/user/' + guid + '/profile?format=json',
                headers: { Authorization: 'Bearer ' + token },
                rejectUnauthorized: false,
                json: true
            };
        }else if(provider=='live'){
            url='';
            options={url:url};
        }else if(provider=='twitter'){
            url='';
            options={url:url};
        }
        return $http.get(url);
    };

    service.allRelationShipType=function(){
        return $http.get(getUrl()+'RelationShipType/list');
    };
    service.allLocationAll = function(){
        return $http.get(getUrl()+'/Location/')
    };
    service.allEmployeeByLocation=function(ID){
        return $http.get(getUrl()+'Location/'+ID+'/Employee');
    };
    service.allOffererEmployeeDTO = function (ID){
        return $http.get(getUrl()+'Offerer/'+ID+'/OffererEmployeeDTO');
    }
    service.allReligion=function(){
        return $http.get(getUrl()+'Religion/list');
    };
    service.allWorkPlaceType=function(){
        return $http.get(getUrl()+'WorkPlaceType');
    };
    service.allWorkingArea=function(){
        return $http.get(getUrl()+'WorkingArea');
    };
    service.allWorkDay=function(){
        return $http.get(getUrl()+'WorkDay');
    };
    service.allCurrency=function(){
        return $http.get(getUrl()+'Currency');
    };
    service.allCompany=function(ID){
        return $http.get(getUrl()+'Company/ByOfferer/'+ID);
    };


});

RRHH.service('APIInterceptor', function ($rootScope,UserService,$timeout,$q,$injector) {
    var service = this;
    var numLoadings = 0;
    //var loginModal, $http, $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    /*
    $timeout(function () {
        loginModal = $injector.get('loginModal');
        $http = $injector.get('$http');
        $state = $injector.get('$state');
    });*/

    service.request = function (config) {
        numLoadings++;
        $rootScope.$broadcast("loader_show");
        var currentUser = UserService.getCurrentUser(),
            access_token = currentUser ? currentUser.token : null;
        //console.log("Interceptando Petición, Token "+access_token);
        //console.log(currentUser);
        if (access_token) {
            //console.log(currentUser);
            //console.log('authorization : Basic '+ btoa(currentUser.username + ":" + currentUser.password));
            config.headers.authorization = access_token;
            config.headers.user = currentUser.userAccount?currentUser.userAccount.id:0;
            $rootScope.googleUserInfo=UserService.getCurrentUserInfo();
        }
        //console.log(config);
        return config;
    };

    service.response=function(response){
        if ((--numLoadings) === 0) {
            // Hide loader
            $rootScope.$broadcast("loader_hide");
        }
        return response || $q.when(response);
    };

    service.responseError = function (response) {
        console.log("Error desde APIInterceptor.");
        if (!(--numLoadings)) {
            // Hide loader
            $rootScope.$broadcast("loader_hide");
        }
        console.log(response);
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
});
RRHH.service('UserService', function (store) {
    var service = this,
        currentUser = null,currentUserInfo=null,provider=null,MenuItems=null;

    service.setCurrentUser = function (user) {
        currentUser = user;
        store.set('user', user);
        return currentUser;
    };

    service.setCurrentUserInfo = function (user) {
        currentUserInfo = user;
        store.set('userInfo', user);
        return currentUserInfo;
    };

    service.getCurrentUser = function () {
        if (!currentUser) {
            currentUser = store.get('user');
        }
        return currentUser;
    };

    service.getCurrentUserInfo = function () {
        if (!currentUserInfo) {
            currentUserInfo = store.get('userInfo');
        }
        return currentUserInfo;
    };

    service.setProvider = function (provider) {
        provider = provider;
        store.set('provider', provider);
        return provider;
    };

    service.getProvider = function () {
        if (!provider) {
            provider = store.get('provider');
        }
        return provider;
    };

    service.setMenuItems = function (MenuItems) {
        MenuItems = MenuItems;
        store.set('MenuItems', MenuItems);
        return MenuItems;
    };

    service.getMenuItems = function () {
        if (!MenuItems) {
            MenuItems = store.get('MenuItems');
        }
        return MenuItems;
    };
});

RRHH.service('LangService', function (store) {
    var service = this,
        lang = null,langs=null;

    service.setLangUser = function (langNew) {
        lang = langNew;
        store.set('lang', langNew);
        return lang;
    };

    service.getLangUser = function () {
        if (!lang) {
            lang = store.get('lang');
        }
        return lang;
    };

    service.setLangs = function (langsNews) {
        langs = langsNews;
        store.set('langsNews', langs);
        return langs;
    };

    service.getLangs = function () {
        if (!langs) {
            langs = store.get('langsNews');
        }
        return langs;
    };


});

RRHH.service('LoginService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'userAccount/';

    function getUrl() {
        return ENDPOINT_URI + path;
    }

    function getLogUrl(action) {
        return getUrl() + action;
    }

    service.login = function (credentials) {
        return $http.post(getLogUrl('login'), credentials);
    };

    service.logout = function () {
        return $http.post(getLogUrl('logout'));
    };

    service.register = function (user) {
        return $http.post(getUrl(), user);
    };
});

RRHH.service('FileUploadService', function ($http, ENDPOINT_URI) {
    var service = this;
    service.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        console.log(file);
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(){

        }).error(function(){

        });
    }
});

RRHH.service('JobInterviewService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'JobInterview/';
    function getUrl() {return ENDPOINT_URI + path;}
    function getUrlForId(itemId) {return getUrl(path) + itemId;}
    service.all = function () {return $http.get(getUrl());};
    service.fetch = function (itemId) {return $http.get(getUrlForId(itemId));};
    service.create = function (item) {return $http.post(getUrl(), item);};
    service.update = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.updateFamily = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.destroy = function (itemId) {return $http.delete(getUrlForId(itemId));};
    service.url = function (itemId) {return getUrlForId(itemId);};
});


RRHH.service('EmployeeService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'JobInterview/';
    function getUrl() {return ENDPOINT_URI + path;}
    function getUrlForId(itemId) {return getUrl(path) + itemId;}
    service.all = function () {return $http.get(getUrl());};
    service.fetch = function (itemId) {return $http.get(getUrlForId(itemId));};
    service.create = function (item) {return $http.post(getUrl(), item);};
    service.update = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.updateFamily = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.destroy = function (itemId) {return $http.delete(getUrlForId(itemId));};
    service.url = function (itemId) {return getUrlForId(itemId);};
});

RRHH.service('PreviousJobsService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'PreviousJobs/';
    function getUrl() {return ENDPOINT_URI + path;}
    function getUrlForId(itemId) {return getUrl(path) + itemId;}
    service.all = function () {return $http.get(getUrl());};
    service.fetch = function (itemId) {return $http.get(getUrlForId(itemId));};
    service.create = function (item) {return $http.post(getUrl(), item);};
    service.update = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.updateFamily = function (itemId, item) {return $http.put(getUrlForId(itemId), item);    };
    service.destroy = function (itemId) {return $http.delete(getUrlForId(itemId));};
    service.url = function (itemId) {return getUrlForId(itemId);};
});