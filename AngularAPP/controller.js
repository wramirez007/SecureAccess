/**
 * Created by wramirez on 29/01/2015.
 */
ACS.controller("mainController", ['$rootScope', '$scope', '$translate', '$state', 'UserService', 'VERSION', function ($rootScope, $scope, $translate, $state, UserService, VERSION) {
    var main = this;
    main.currentUser = UserService.getCurrentUser();
    //main.genders=[{id:'M',name:'Masculino'},{id:'F',name:'Femenino'}];
    main.genders=[{ name: 'Masculino', code: 'M' },{ name: 'Femenino', code: 'F' }];
    main.VERSION = VERSION;
    console.log(main.currentUser);
    main.profile = main.currentUser.userAccount.userProfiles[0];
    console.log(main.profile);
}]);

ACS.controller('HeaderController', ['$scope', 'ConstanteService', 'UserService', function ($scope, ConstanteService, UserService) {

}]);

ACS.controller('SideBarController', ['$scope', 'ConstanteService', 'GenericService', 'UserService', 'GenericServiceSinc', function ($scope, ConstanteService, GenericService, UserService, GenericServiceSinc) {
    /*$scope.urlServerFiles=ConstanteService.urlServerFiles;
     $scope.menuItems=[];
     GenericServiceSinc.getByURL("MenuItems/").then(function(data){
     $scope.menuItems=data;
     });*/

}]);

ACS.controller('dashboardController', ['$scope', 'ConstanteService', function ($scope, ConstanteService) {

}]);

ACS.controller('profileController', ['$scope', 'ConstanteService','GenericServiceSinc','DTOptionsBuilder', 'DTColumnBuilder', function ($scope,ConstanteService,GenericServiceSinc,DTOptionsBuilder, DTColumnBuilder) {
    //$scope.urlServerFiles=ConstanteService.urlServerFiles;
    var profile = this;


}]);

ACS.controller('visitController', ['$scope', 'GenericService', function ($scope, GenericService) {
    var visit = this;
    visit.identification={identificationType:{},country:{},identification:''};
    visit.countrys = [];
    visit.identificationTypes = [];
    visit.colors=[];
    visit.brands=[];
    visit.visitors=[];
    visit.firstNames='';
    visit.lastNames='';
    visit.gender={};
    visit.register={resident:{id:1},visitor:{fullName:null,gender:visit.gender.code,identifications:[visit.identification]},startDate:new Date(),endDate:new Date(),vehicle:{brand:{},model:null,year:null,color:{},plate:''},comments:null};
    visit.startDate={currentDate:new Date(),minDate:new Date(),maxDate:null};
    visit.endDate={currentDate:null,minDate:visit.startDate.currentDate,maxDate:visit.startDate.currentDate+3};
    visit.date=new Date();
    visit.hourStep = 1;
    visit.minuteStep = 5;
    visit.dateOptions = {
        startingDay: 1,
        showWeeks: false
    };

    $scope.$watch("date", function(value) {
        console.log('New date value:' + value);
    }, true);

    visit.saveRegister=function(){
        visit.register.visitor.gender=visit.gender.code;
        console.log(visit.register);
        GenericService.postByURL('visitor',visit.register)
            .then(function (response) {
                console.log(response.data);
                visit.visitors.push(response.data);
            });
    }

    GenericService.allCountry()
        .then(function (response) {
            console.log(response.data);
            visit.countrys = response.data;
        });

    GenericService.allVisitors()
        .then(function (response) {
            console.log(response.data);
            visit.visitors = response.data;
        });

    GenericService.allIdentificationType()
        .then(function (response) {
            console.log(response.data);
            visit.identificationTypes = response.data;
        });

    GenericService.allColors()
        .then(function (response) {
            console.log(response.data);
            visit.colors = response.data;
        });

    GenericService.allBrands()
        .then(function (response) {
            console.log(response.data);
            visit.brands = response.data;
        });

    visit.deleteVehicle=function(){
        visit.register.vehicle={brand:{},model:null,year:null,color:{},plate:''};
    }
    visit.updateFullName=function(){
        var a=visit.firstNames.split(' ');
        var fullName=a[0];
        if(a.length>0){
            fullName+=',';
            for(var x= 1;x< a.length;x++){
                if(x<a.length){
                    fullName+=a[x]+' ';
                }else{
                    fullName+=a[x];
                }
            }
        }
        fullName=fullName.replace(' ;',';');
        a=visit.lastNames.split(' ');
        fullName+=';'+a[0];
        if(a.length>0){
            fullName+=',';
            for(var x= 1;x< a.length;x++){
                if(x<a.length){
                    fullName+=a[x]+' ';
                }else{
                    fullName+=a[x];
                }
            }
        }
        fullName=fullName.replace(' ,',',');
        visit.register.visitor.fullName=fullName;
    };
}]);

ACS.controller("404Controller", ['$rootScope', '$scope', '$location', 'UserService', function ($rootScope, $scope, $location, UserService) {
    $scope.currentUser = UserService.getCurrentUser();
    $scope.VERSION = VERSION;
    if (!$scope.currentUser) {
        $location.url("/");
    }
}]);

// Controller for New User View
ACS.controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'LoginService', 'UserService', '$window', 'GenericService', 'ConstanteService', 'LangService', '$translatePartialLoader', '$translate', 'vcRecaptchaService', 'md5','$auth','Account', function ($rootScope, $scope, $state, LoginService, UserService, $window, GenericService, ConstanteService, LangService, $translatePartialLoader, $translate, vcRecaptchaService, md5,$auth,Account) {
    var login = this;
    login.publicKey = "6LdyfQ8TAAAAAPnqEa7f23rkJjTpIvJkb53UN4gb";
    login.fullName = "";
    login.email = "";
    login.passwordOne = "";
    login.passwordTwo = "";
    login.token = "";
    login.userProfile={};
    login.authenticate = function(provider) {
        $auth.authenticate(provider);
    };

    login.getProfile = function() {
        Account.getProfile()
            .then(function(response) {
                login.userProfile = response.data;
            })
            .catch(function(response) {
                toastr.error(response.data.message, response.status);
            });
    };

    $rootScope.isLogged = false;
    if (UserService.getCurrentUser() != null) {
        $rootScope.isLogged = true;
    }

    //this.cancel = $scope.$dismiss;
    $translatePartialLoader.addPart('login');
    $translate.refresh();
    $scope.langs = [];
    login.updateLang = function () {
        $scope.langs.push(login.pais);
        if (login.pais == "es-GT") {
            $scope.langs.push("en-GT");
            $rootScope.ocultarCamposHonduras = false;
        } else if (login.pais == "en-GT") {
            $scope.langs.push("es-GT");
            $rootScope.ocultarCamposHonduras = false;
        } else if (login.pais == "es-HN") {
            $scope.langs.push("en-HN");
            $rootScope.ocultarCamposHonduras = true;
        } else if (login.pais == "en-HN") {
            $scope.langs.push("es-HN");
            $rootScope.ocultarCamposHonduras = true;
        }
        LangService.setLangs($scope.langs);
        LangService.setLangUser(login.pais);
        $translate.use(login.pais);
        $translate.refresh();
    };
    login.pais = null;

    //login.user={username:'',password:'',token:null,id:null};
    function signIn(user) {
        //console.log("user: *****");
        console.log(user);
        //alert(user);
        LoginService.loginSecurity(user)
            .then(function (response) {
                //console.log("response.data:");
                //console.log(response.data);
                if (response.status == '200' || response.status == '201') {
                    $scope.currentUser = response.data;
                    $rootScope.userAccount = response.data;
                    $rootScope.isLogged = true;
                    //console.log($rootScope.isLogged);
                    UserService.setCurrentUser($scope.currentUser);
                    $rootScope.$broadcast('authorized');
                    $state.go('ACS.Main.Dashboard');
                } else {
                    logout();
                }
            });
    }

    function register() {
        if (vcRecaptchaService.getResponse() === "") { //if string is empty
            alert("Please resolve the captcha and submit!")
        } else {
            var userAccount = {person: {fullName: login.fullName, profession: login.token}, userName: login.email, password: login.passwordOne, passwordText: login.passwordOne};
            LoginService.register(userAccount)
                .then(function (response) {
                    console.log(response.data);
                    login(userAccount);
                });
        }
    }

    function logout() {
        LoginService.logout()
            .then(function (response) {
                var provider = UserService.getProvider();
                if (provider == 'google') {
                    GenericService.getByURLPath("https://mail.google.com/mail/u/0/?logout&hl=en");
                }
                $rootScope.isLogged = false;
                UserService.setCurrentUser(null);
                UserService.setCurrentUserInfo(null);
                console.log("Logout");
                $state.go('login');
            });
    }

    function submit(user) {
        login.newUser ? register(user) : signIn(user);
    }

    login.newUser = false;
    login.submit = submit;
    login.logout = logout;
    login.register = register;
    login.aceptar = false;

}]);






