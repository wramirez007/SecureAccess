/**
 * Created by wramirez on 24/10/2015.
 */
var $stateProviderRef = null;
var $urlRouterProviderRef = null;
var ACS = angular.module('ACS', ['angular-storage', 'ui.router', 'pascalprecht.translate', 'angularTranslateApp', 'ngAnimate',  'angularMoment', 'cgBusy',  'ui.calendar', 'angular-bootbox', 'ngResource', 'pageslide-directive', 'ngCookies', 'ngSanitize','ui.select','vcRecaptcha','angular-md5','AngularPrint','datatables','datatables.bootstrap','datatables.buttons','ui.bootstrap', 'ui.bootstrap.datetimepicker','satellizer'])
    .constant('ENDPOINT_URI', 'http://localhost:8080/SecureAccessRest/resources/')
    .constant('VERSION', '1.0.0.0')
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, $bootboxProvider,$authProvider) {

        $authProvider.oauth2({
            name: 'OpenidConnectServer',
            url: 'http://dev.megapaca.gt/openid-connect-server-webapp/token',
            redirectUri: window.location.origin,
            clientId: 'ce7a86ef-7a25-4bee-a31f-7d041bb55010',
            requiredUrlParams: ['scope'],
            scope: ['openid','profile','address','phone','email'],
            scopeDelimiter: '+',
            authorizationEndpoint: 'http://dev.megapaca.gt/openid-connect-server-webapp/authorize'
        });

        $urlRouterProviderRef = $urlRouterProvider;
        $stateProviderRef = $stateProvider;
        $bootboxProvider.setDefaults({ locale: "es" });
        $stateProviderRef
            .state('login',{url: '/login', data: {requireLogin: false}, views: {"viewMainContainer": {templateUrl: "ACS/Login/login.html", controller: 'LoginCtrl', controllerAs: 'login'}}})
            .state('register',{url: '/register', data: {requireLogin: false}, views: {"viewMainContainer": {templateUrl: "ACS/Login/register.html", controller: 'LoginCtrl', controllerAs: 'login'}}})
            .state('ACS',{url: '/Main', data: {requireLogin: true},views: {"viewMainContainer": {templateUrl: "ACS/ACS.html",controller:'mainController',controllerAs:'main'}}})
                .state('ACS.Main',{url: '/', views: {"viewContainer": {templateUrl: "ACS/Main.html"},"viewHeader":{templateUrl:"ACS/Header.html"},"viewSideBar":{templateUrl:"ACS/SideBar.html"},"viewFooter":{templateUrl:"ACS/Footer.html"}}})
                    .state('ACS.Main.Dashboard',{url: 'Dashboard', views: {"viewContainer": {templateUrl: "ACS/Dashboard/Administrator.html", controller: 'dashboardController'}}})
                    .state('ACS.Main.Profile',{url: 'Profile', views: {"viewContainer": {templateUrl: "ACS/Profile/Profile.html", controller: 'profileController'}}})
                    .state('ACS.Main.Register',{url: 'Register/', views: {"viewContainer": {templateUrl: "ACS/Main.html"}}})
                        .state('ACS.Main.Register.Resident',{url: 'Resident', views: {"viewContainer": {templateUrl: "ACS/Register/Resident.html", controller: 'ResidentController', controllerAs:'resident'}}})
                        .state('ACS.Main.Register.Residence',{url: 'Residence', views: {"viewContainer": {templateUrl: "ACS/Register/Residence.html", controller: 'ResidentController'}}})
                        .state('ACS.Main.Register.SecureToken',{url: 'SecureToken', views: {"viewContainer": {templateUrl: "ACS/Register/SecureToken.html", controller: 'SecureTokenController'}}})
                        .state('ACS.Main.Register.Visit',{url: 'Visit', views: {"viewContainer": {templateUrl: "ACS/Register/Visit.html", controller: 'visitController', controllerAs:'visit'}}})
            .state('404',{url: '/404', data: {requireLogin: false}, views: {"viewContainer": {templateUrl: "pages/examples/404.html", controller: '404Controller'}}});

        $urlRouterProviderRef.otherwise("/login");
        $httpProvider.interceptors.push('APIInterceptor');

        /*
        reCAPTCHAProvider.setPublicKey('6LdyfQ8TAAAAAPnqEa7f23rkJjTpIvJkb53UN4gb');
        reCAPTCHAProvider.setOptions({
            theme: 'custom',
            custom_theme_widget: 'recaptcha_widget' // The id of your widget element.
        });*/

    }).run(function (amMoment, $rootScope, UserService, LangService, $state) {
        amMoment.changeLocale('es');
        var lastDigestRun = new Date().getTime();
        $rootScope.$watch(function detectIdle() {
            var now = new Date().getTime();
            if ((now - lastDigestRun) > 60 * 1000 * 60 && UserService.getCurrentUser() != null) { //5*60*60
                lastDigestRun = now;
                $rootScope.isLogged = false;
                UserService.setCurrentUser(null);
                UserService.setCurrentUserInfo(null);
                LangService.setLangs(null);
                window.location = "/login";
            } else if ((now - lastDigestRun) > 60 * 1000 * 60 && !UserService.getCurrentUser()) {
                lastDigestRun = now;
                $rootScope.isLogged = false;
                UserService.setCurrentUser(null);
                UserService.setCurrentUserInfo(null);
                LangService.setLangs(null);
                window.location = "/login";
            } else {
                lastDigestRun = now;
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;
            //console.log("requireLogin "+requireLogin+" "+toState.name);
            //console.log(UserService.getCurrentUser());
            //console.log(toState);
            if (toState.name == 'login') {
                $rootScope.showHeader = false;
                if(UserService.getCurrentUser() != null){
                    $state.go('ACS.Main.Dashboard');
                }
            } else {
                $rootScope.showHeader = true;
            }
            if (requireLogin && (typeof UserService.getCurrentUser() === 'undefined' || UserService.getCurrentUser() == null)) {
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
