var $stateProviderRef = null;
var $urlRouterProviderRef = null;
var RRHH = angular.module('RRHH', ['angular-storage', 'ui.router', 'pascalprecht.translate','angularTranslateApp', 'ngAnimate', 'googleOauth','BasicPrimitives','checklist-model','angularMoment','cgBusy','ui.bootstrap','ui.calendar','angular-bootbox','ngResource','datePicker','pageslide-directive','ngCookies','ngSanitize','ui.select'])
    //.constant('ENDPOINT_URI', 'https://www.megapaca.gt/MPITRest/resources/')
    //.constant('ENDPOINT_URI', 'http://pruebas.megapaca.gt/MPITRest/resources/')
    .constant('ENDPOINT_URI', 'http://localhost:8080/MPITRest/resources/')
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, TokenProvider,$bootboxProvider) {
        $urlRouterProviderRef = $urlRouterProvider;
        $stateProviderRef = $stateProvider;
        $bootboxProvider.setDefaults({ locale: "es" });
         $stateProviderRef
         .state('login',
             {url: '/',data:{requireLogin:false},views:{"viewMainContainer":{templateUrl:"Login/Login.html",controller: 'LoginCtrl',controllerAs: 'login'}}
         }).state('RRHH',
             {url: '/',data:{requireLogin:true},views:{"viewMainContainer":{templateUrl:"Main.html",controller:'mainController'}},abstract: true
         }).state('RRHH.Dashboard',
             {url: 'Dashboard',views:{"viewContainer":{templateUrl:"dashboard.html",controller:'dashboardController'}}
         }).state('RRHH.Reclutamiento',
             {url: 'Reclutamiento',views:{"viewContainer":{templateUrl:"RRHH.html"}},abstract: true
         }).state('RRHH.Reclutamiento.All',
             {url: 'All',views:{"viewContainer":{templateUrl:"Modulo/Reclutamiento/Offerer.html",controller: 'OffererAllController'}}
         }).state('RRHH.Reclutamiento.Interviews',
             {url: 'Interviews',views:{"viewContainer":{templateUrl:"Modulo/Reclutamiento/Interviews.html",controller: 'InterviewsController'}}
         }).state('RRHH.Reclutamiento.Reviews',
             {url: 'Reviews',views:{"viewContainer":{templateUrl:"Modulo/Reclutamiento/Reviews.html",controller: 'ReviewsController'}}
         }).state('RRHH.Reclutamiento.Selection',
             {url: 'Selection',views:{"viewContainer":{templateUrl:"Modulo/Reclutamiento/Selection/Selection.html"}},abstract:true
         }).state('RRHH.Reclutamiento.Selection.Requisition',
             {url: 'Requisition',views:{"viewContainer":{templateUrl:"Modulo/Reclutamiento/Selection/PersonalRequisition.html",controller: 'RequisitionController'}}
         }).state('RRHH.Reclutamiento.Company',
             {url: 'Company',views:{"viewContainer":{templateUrl:"company.html",controller: 'CompanyController'}}
         }).state('404',
             {url: '/404',data:{requireLogin:false},views:{"viewContainer":{templateUrl:"pages/examples/404.html",controller: '404Controller'}}});

        $urlRouterProviderRef.otherwise("/");
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('APIInterceptor');
        // Demo configuration for the "angular-oauth demo" project on Google.
        // Log in at will!
        // Sorry about this way of getting a relative URL, powers that be.
        var baseUrl = document.URL.replace('index.html', '');
        TokenProvider.extendConfig({clientId: '1020728751709-3s6cff09m7iil4jpbm5rstjrscpo9h9m.apps.googleusercontent.com',redirectUri: 'http://localhost:63342/MPRH/oauth2callback.html',
            scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.profile"]
        });
        var urlOAuth="http://localhost:63342"; //DESARROLLO
        //var urlOAuth="http://pruebas.megapaca.gt"; //PRUEBAS
//        var urlOAuth="http://www.mprh.com.gt"; //PRODUCCION
        hello.init({
            facebook: '1632285350338372',
            windows: '00000000441597A9',
            google: '1020728751709-3s6cff09m7iil4jpbm5rstjrscpo9h9m.apps.googleusercontent.com'
        }, {redirect_uri: urlOAuth+'/MPRH/oauth2callback.html'});

    }).run(function (amMoment,$rootScope,UserService,LangService,$state) {
        amMoment.changeLocale('es');
        var lastDigestRun = new Date().getTime();
        $rootScope.$watch(function detectIdle() {
            var now = new Date().getTime();
            if ((now - lastDigestRun) > 60*1000*60 && UserService.getCurrentUser()!=null) { //5*60*60
                lastDigestRun = now;
                $rootScope.isLogged = false;
                UserService.setCurrentUser(null);
                UserService.setCurrentUserInfo(null);
                LangService.setLangs(null);
                window.location = "/MPRH/RRHH";
            }else if((now - lastDigestRun) > 60*1000*60 && !UserService.getCurrentUser()){
                lastDigestRun = now;
                $rootScope.isLogged = false;
                UserService.setCurrentUser(null);
                UserService.setCurrentUserInfo(null);
                LangService.setLangs(null);
                window.location = "/MPRH/RRHH";
            }else{
                lastDigestRun = now;
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;
            //console.log("requireLogin "+requireLogin);
            //console.log(UserService.getCurrentUser());
            console.log(toState);
            if(toState.name=='login'){
                $rootScope.showHeader = false;
            }else{
                $rootScope.showHeader = true;
            }
            if (requireLogin && (typeof UserService.getCurrentUser() === 'undefined' || UserService.getCurrentUser()==null)) {
                event.preventDefault();
                // get me a login modal!
                bootbox.alert("Login is Required", function () {
                    $rootScope.isLogged = false;
                    UserService.setCurrentUser(null);
                    UserService.setCurrentUserInfo(null);
                    LangService.setLangs(null);
                    window.location = "/MPRH/RRHH";
                });
            }
        });

    });
