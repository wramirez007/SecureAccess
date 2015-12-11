/**
 * Created by wramirez on 29/01/2015.
 */
/*
 RRHH.controller('OffererController', ['$scope','OffererService',function($scope,OffererService) {
 $scope.message = 'This is Add new order screen';
 $scope.characters = OffererService.query();
 }]);*/

RRHH.controller('HeaderController', ['$scope', 'ConstanteService', function ($scope,ConstanteService) {
    $scope.urlServerFiles=ConstanteService.urlServerFiles;
}]);
RRHH.controller('SideBarController', ['$scope', 'ConstanteService', function ($scope,ConstanteService) {
    $scope.urlServerFiles=ConstanteService.urlServerFiles;
}]);

RRHH.controller('InterviewPreviaInstanceCtrl', ['$scope', '$modalInstance', 'InterviewData', '$translatePartialLoader', '$translate','ConstanteService', function ($scope, $modalInstance, InterviewData, $translatePartialLoader, $translate,ConstanteService) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();
    $scope.urlServerFiles=ConstanteService.urlServerFiles;
    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };
    $scope.InterviewQuestions = InterviewData.questions;
    $scope.Offerer = InterviewData.Offerer;
    $scope.OffererJobInterview = InterviewData.OffererJobInterview;
    $scope.finalizado = InterviewData.finalizado;
    //if(!$scope.OffererJobInterview.startDate){
    $scope.OffererJobInterview.startDate = new Date();
    //}
    /*
     $scope.selected = {
     InterviewQuestions: $scope.InterviewQuestions[0]
     };*/

    $scope.outputs = {};
    $scope.getData = function () {
        if ($scope.myForm.$valid && $scope.OffererJobInterview.recommended > 0) {
            $scope.OffererJobInterview.endDate = new Date();
            InterviewData.OffererJobInterview = $scope.OffererJobInterview;
            //alert('Se esta enviando las respuetas.');
            $modalInstance.close(InterviewData);
        }
    };
    /*
     $scope.ok = function () {
     $modalInstance.close($scope.selected.InterviewQuestions);
     };*/

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };
}]);

RRHH.controller("mainController", ['$rootScope', '$scope', '$translate', '$state', 'UserService', 'PersonService', 'UserAccountService', '$filter', 'ConstanteService', 'OffererService', 'GenericService','$translatePartialLoader','$translate','$modal', function ($rootScope, $scope, $translate, $state, UserService, PersonService, UserAccountService, $filter, ConstanteService, OffererService, GenericService,$translatePartialLoader,$translate,$modal) {

    //$scope.menuItems=[{"dateCreated":null,"active":true,"items":[{"dateCreated":null,"active":true,"items":[],"name":"RRHH.Reclutamiento","title":"Reclutamiento y Selección de Personal","templateUrl":"RRHH.html","className":"fa fa-briefcase","url":"Reclutamiento","abstractValue":true,"controller":null,"html":null,"orden":3,"main":null,"id":3},{"dateCreated":null,"active":true,"items":[],"name":"RRHH.Dashboard","title":"Dashboard","templateUrl":"dashboard.html","className":"fa fa-dashboard","url":"Dashboard","abstractValue":false,"controller":"mainController","html":null,"orden":2,"main":null,"id":2}],"name":"RRHH","title":null,"templateUrl":"Main.html","className":null,"url":"/","abstractValue":true,"controller":null,"html":null,"orden":1,"main":true,"id":1}];
    $scope.menuItems=[];
    function getMenus(){
        GenericService.getByURL("MenuItems/")
            .then(function (response) {
                console.log(response.data);
                if(response.status==200 || response.status==201){
                    $scope.menuItems=response.data;
                    loadScript();
                }else{
                    $scope.menuItems=[];
                }
                UserService.setMenuItems($scope.menuItems);
            });
    };

    getMenus();

}]);


RRHH.controller("dashboardController", ['$rootScope', '$scope', '$translate', '$state', 'UserService', 'PersonService', 'UserAccountService', '$filter', 'ConstanteService', 'OffererService', 'GenericService','$translatePartialLoader','$translate','$modal', function ($rootScope, $scope, $translate, $state, UserService, PersonService, UserAccountService, $filter, ConstanteService, OffererService, GenericService,$translatePartialLoader,$translate,$modal) {
    $scope.CUI = null;
    $scope.isValidCUI = false;
    $scope.currentUser = UserService.getCurrentUser();
    $rootScope.googleUserInfo = UserService.getCurrentUserInfo();
    if(!$scope.currentUser){
        $state.go('/login');
    }
    //console.log($scope.currentUser);
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();

    $scope.report = [];
    $scope.showReport = "N";
    /*
    function getOfferer() {
        if ($scope.currentUser && $scope.currentUser.userAccount) {
            if ($scope.currentUser.userAccount.person) {
                if ($scope.currentUser.userAccount.person.offerer) {
                    console.log($scope.currentUser.userAccount.person.offerer);
                    if ($scope.currentUser.userAccount.person.offerer.offererStatus) {
                        $scope.report.print = OffererService.url($scope.currentUser.userAccount.person.id + "/reportOfferer");
                        $scope.showReport = "S";
                        if($scope.currentUser.userAccount.person.offerer.offererStatus.id == 1){
                            GenericService.getByURL("JobInterview/Interview/ByOfferer/" + $scope.currentUser.userAccount.person.offerer.id)
                                .then(function (response) {
                                    console.log(response.data);
                                    if(response.status!=404){
                                        var Offerer=response.data;
                                        GenericService.getByURL("JobInterview/byOfferer/" + $scope.currentUser.userAccount.person.offerer.id)
                                            .then(function (response) {
                                                console.log(response.data);
                                                var OffererJobInterview=response.data;
                                                $scope.InterviewData = {Offerer: Offerer, response: [], OffererJobInterview: OffererJobInterview, finalizado: false};
                                                showModalQuestions();
                                            });
                                    }
                                });
                        }
                    }
                }
            }
        }
    }
    */
    $scope.plazasVacantes = 0;
    $scope.plazasOcupadas = 0;

    function getCountPlazasByEstado(estado) {
        GenericService.getByURL("Plaza/byEstado/" + estado)
            .then(function (result) {
                console.log(result);
                if (estado == 'O') {
                    $scope.plazasOcupadas = result.data;
                } else if (estado == 'V') {
                    $scope.plazasVacantes = result.data;
                }

            });
    }
    $scope.dashboardControls=[];
    function getDashboardControls() {
        GenericService.getByURL("Dashboard/Controls")
            .then(function (result) {
                console.log(result);
                $scope.dashboardControls=result.data;
            });
    }

    getCountPlazasByEstado('V');
    getCountPlazasByEstado('O');
    getDashboardControls();

    $scope.showPicture = function () {
        $scope.currentUserOAuth = UserService.getCurrentUserInfo();
        if (!$scope.currentUserOAuth) {
            if ($scope.currentUser && $scope.currentUser.userAccount.person) {
                $scope.currentUserOAuth = {picture: ConstanteService.urlServerFiles + $scope.currentUser.userAccount.person.image, name: 'Oferente'};
            }
            $rootScope.googleUserInfo = $scope.currentUserOAuth;
            UserService.setCurrentUserInfo($rootScope.googleUserInfo);
        }
    }

    $scope.showPicture();

}]);

RRHH.controller("UploadFileController", ['$scope', 'FileUploadService', 'ConstanteService', 'UserService', '$rootScope','$translatePartialLoader','$translate', function ($scope, FileUploadService, ConstanteService, UserService, $rootScope,$translatePartialLoader,$translate) {
    $translatePartialLoader.addPart('uploadFile');
    $translate.refresh();
    $scope.myFile = null;
    $scope.Infornet="";
    $scope.uploadFile = function () {
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        $scope.currentUser = UserService.getCurrentUser();
        var uploadUrl = "";
        if ($scope.currentUser.userAccount.person) {
            uploadUrl = ConstanteService.urlServerUploadFiles + '/resources/Person/' + $scope.currentUser.userAccount.person.id + '/script/image';
        } else {
            uploadUrl = ConstanteService.urlServerUploadFiles + '/resources/Person/0/script/image';
        }
        console.log("ahi va " + uploadUrl);
        FileUploadService.uploadFileToUrl(file, uploadUrl)
            .then(function (response) {
                console.log(response);
                $scope.currentUserOAuth = UserService.getCurrentUserInfo();
                if (!$scope.currentUserOAuth) {
                    $scope.currentUserOAuth = {picture: ConstanteService.urlServerFiles + response.data, name: 'Oferente'};
                } else {
                    $scope.currentUserOAuth.picture = ConstanteService.urlServerFiles + response.data;
                }
                $rootScope.googleUserInfo = $scope.currentUserOAuth;
                UserService.setCurrentUserInfo($rootScope.googleUserInfo);
            })
    };

    $scope.uploadFileGenerico = function (id) {
        console.log(id);
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        if($scope.myFile){
            var uploadUrl = ConstanteService.urlServerUploadFiles + '/resources/Person/' + id + '/script/infornet';
//        var uploadUrl = 'http://localhost:8080/MPITRest/resources/Person/' + id + '/script/infornet';
            console.log(file);
            console.log(uploadUrl);
            FileUploadService.uploadFileToUrl(file, uploadUrl)
                .then(function (response) {
                    console.log(response);
                    if(response.status=='200'){
//                    GenericService.getByURL("Offerer/OffererInfornet/" + response.data)
//                        .then(function (response) {
//                            console.log(response);
//                            $scope.offerers = response.data;
//                        });
                        bootbox.alert("archivo Guardado");
                    }else{
                        bootbox.alert(response.statusText+" Oferente en estado Incorrecto");
                    }
                })
        }else{
            bootbox.alert("Adjunte un archivo válido");
        }

    }


}]);

//RRHH.controller("sideBarController", ['$rootScope', '$scope', '$translate', '$state', 'UserService', 'PersonService', 'UserAccountService', '$filter', function ($rootScope, $scope, $translate, $state, UserService, PersonService, UserAccountService, $filter) {
//    $scope.currentUser = UserService.getCurrentUser();
//    $scope.aboutTheWork=false;
//    $scope.familyAndEducation=false;
//    $scope.previousJobsAndReferences=false;
//    $scope.additionalInformation=false;
//
//    if($scope.currentUser){
//        $scope.aboutTheWork=false;
//    }
//    console.log("$scope.ocultaMenu ********");
//    console.log($scope.currentUser);
//    console.log("$scope.ocultaMenu ********");
//}]);



RRHH.controller("LangController", ['$rootScope', '$scope', '$translate','LangService','$translatePartialLoader', function ($rootScope, $scope, $translate,LangService,$translatePartialLoader) {
    $scope.langs = [];//LangService.getLangs();//["es-GT", "es-HN", "en"];
    $scope.langUser=LangService.getLangUser();
    $translatePartialLoader.addPart('General');
    $scope.lang = $scope.langUser?$scope.langUser:"es-GT";
    $scope.langs.push($scope.lang);
    if($scope.lang=="es-GT"){
        $scope.langs.push("en-GT");
        $rootScope.ocultarCamposHonduras = false;
    }else if($scope.lang=="en-GT") {
        $scope.langs.push("es-GT");
        $rootScope.ocultarCamposHonduras = false;
    }else if($scope.lang=="es-HN") {
        $scope.langs.push("en-HN");
        $rootScope.ocultarCamposHonduras = true;
    }else if($scope.lang=="en-HN"){
        $scope.langs.push("es-HN");
        $rootScope.ocultarCamposHonduras = true;
    }
    $rootScope.ocultarCamposHonduras = false;
    $scope.updateLang = function () {
        console.log($scope.lang);
        LangService.setLangUser($scope.lang);
        $translate.use($scope.lang);
        if ($scope.lang == 'es-HN' || $scope.lang == 'en-HN') {
            $rootScope.ocultarCamposHonduras = true;
        } else {
            $rootScope.ocultarCamposHonduras = false;
        }
        $translate.refresh();
    };
    $translate.use($scope.lang);
    $translate.refresh();
}]);

RRHH.controller("404Controller", ['$rootScope', '$scope', '$location','UserService', function ($rootScope, $scope, $location,UserService) {
    $scope.currentUser = UserService.getCurrentUser();
    if(!$scope.currentUser){
        $location.url("/");
    }
}]);

// Controller for New User View
RRHH.controller("GeneralInformationController", [ '$rootScope', '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'UserAccountService', 'ConstanteService','$translatePartialLoader','$translate', function ($rootScope, $scope, OffererService, PersonService, GenericService, $state, $filter, UserService, UserAccountService, ConstanteService,$translatePartialLoader,$translate) {
    //var offerer=this;
    $scope.currentUser = UserService.getCurrentUser();
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();

    $scope.items = [];
    $scope.newOfferer = { firstName: '', middleName: '', mainLastName: '', secondLastName: '', marriedLastName: '', countryBirth: '', stateBirth: ''};
    $scope.person = {};
    $scope.offerer = {};
    $scope.genders = ConstanteService.genders;
    $scope.maritalStatus = ConstanteService.maritalStatus;
    $scope.countrys = [], $scope.countrysIdent = [];
    $scope.states = [];

    $scope.citys = [];
    $scope.regExps = {
        msjRequired: 'DATO REQUERIDO.',
        //firstName: {exp: /^[a-zA-Z]{2,}(\s[a-zA-Z]{2,})?$/, message: 'Unicamente debe ingresar letras.'},
        firstName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        //middleName: {exp: /^([a-zA-Z]{2,})?([a-zA-Z]{1,}\s[a-zA-Z]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        middleName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        decimal: {exp: /^[1-9]+[0-9]*(.[0-9]+)?$/, message: 'El valor ingresado no coincide con 1234.56'},
        number: {exp: /^[1-9]+[0-9]*$/, message: 'El valor ingresado no coincide con 1234'},
        numberOnly: {exp: /^[0-9]+$/, message: 'El valor ingresado no coincide con 1234'},
        cui: {exp: /^[1-9]+[0-9]*([0-9]+)+$/, message: 'El valor ingresado no coincide con 1234'},
        phone: {exp: /^([0-9]+){8,}$/, message: 'El Numero debe tener mas de 7 digitos.'},
        date: {exp: /^(?:(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:0?[1-9]|1[0-2]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:31(\/|-)(?:0?[13578]|1[02]))|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(29(\/|-)0?2)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/, message: 'El Numero debe tener mas de 7 digitos.'}
    };
    $scope.driverLicense = false;
    $scope.newOfferer.driverLicenseA = false;
    $scope.newOfferer.driverLicenseB = false;
    $scope.newOfferer.driverLicenseC = false;
    $scope.newOfferer.driverLicenseM = false;
    $scope.noTengoLicencia = function () {
        $scope.currentUser.userAccount.person.driverLicense = [];
        if ($scope.newOfferer.driverLicenseNA) {
            $scope.driverLicense = true;
            $scope.newOfferer.driverLicenseA = false;
            $scope.newOfferer.driverLicenseB = false;
            $scope.newOfferer.driverLicenseC = false;
            $scope.newOfferer.driverLicenseM = false;
        } else if ($scope.newOfferer.driverLicenseA || $scope.newOfferer.driverLicenseB || $scope.newOfferer.driverLicenseC || $scope.newOfferer.driverLicenseM) {
            $scope.driverLicense = true;
            if ($scope.newOfferer.driverLicenseA) {
                var d = {driver: 'A'};
                $scope.currentUser.userAccount.person.driverLicense.push(d);
            }
            if ($scope.newOfferer.driverLicenseB) {
                var d = {driver: 'B'};
                $scope.currentUser.userAccount.person.driverLicense.push(d);
            }
            if ($scope.newOfferer.driverLicenseC) {
                var d = {driver: 'C'};
                $scope.currentUser.userAccount.person.driverLicense.push(d);
            }
            if ($scope.newOfferer.driverLicenseM) {
                var d = {driver: 'M'};
                $scope.currentUser.userAccount.person.driverLicense.push(d);
            }
        } else {
            $scope.driverLicense = false;
        }
    };

    //$scope.word = /^0-9+$/;
    $scope.messageResponse = {message: '', class: 'alert alert-success alert-dismissable', icon: 'fa fa-check', type: 'OK!'};

    function fullNamePart() {
        var fullName = $scope.newOfferer.firstName + ',' + $scope.newOfferer.middleName + ';' + $scope.newOfferer.mainLastName + ',' + $scope.newOfferer.secondLastName;
        //console.log($scope.newOfferer.marriedLastName);
        if ($scope.newOfferer.marriedLastName) {
            $scope.currentUser.userAccount.person.fullName = fullName + ':' + $scope.newOfferer.marriedLastName;
        } else {
            $scope.currentUser.userAccount.person.fullName = fullName;
        }
    };

    function setPhone() {
        if ($scope.currentUser.userAccount.person.phone && $scope.currentUser.userAccount.person.phone.length > 0) {
            for (var x = 0; x < $scope.currentUser.userAccount.person.phone.length; x++) {
                if ($scope.currentUser.userAccount.person.phone[x].phoneType.id == 1) { //Phone
                    $scope.currentUser.userAccount.person.phone[x].phoneNumber = $scope.newOfferer.phone;
                } else if ($scope.currentUser.userAccount.person.phone[x].phoneType.id == 2) { //CellPhone
                    $scope.currentUser.userAccount.person.phone[x].phoneNumber = $scope.newOfferer.cellPhone;
                }
            }
        } else {
            $scope.currentUser.userAccount.person.phone = [];
            var phone = {};
            phone.phoneType = {id: 1};
            phone.phoneNumber = $scope.newOfferer.phone;
            if($scope.newOfferer.phone){
                $scope.currentUser.userAccount.person.phone.push(phone);
            }

            var cellPhone = {};
            cellPhone.phoneType = {id: 2};
            cellPhone.phoneNumber = $scope.newOfferer.cellPhone;
            $scope.currentUser.userAccount.person.phone.push(cellPhone);
        }
    };

    function getAddressByType(type) {
        var existe = -1;
        for (var x = 0; x < $scope.currentUser.userAccount.person.address.length; x++) {
            var address = $scope.currentUser.userAccount.person.address[x];
            console.log(address);
            if (address.addressType.id == type) {
                existe = x;
                break;
            }
        }
        console.log("Type " + type + " existe=" + existe);
        if (existe >= 0) {
            if (type == 1) { //Residencia
                $scope.currentUser.userAccount.person.address[existe].address.country.id = $scope.newOfferer.residenceCountry.id;
                $scope.currentUser.userAccount.person.address[existe].address.state.id = $scope.newOfferer.residenceState.id;
                $scope.currentUser.userAccount.person.address[existe].address.city.id = $scope.newOfferer.residenceCity.id;
                $scope.currentUser.userAccount.person.address[existe].address.number = $scope.newOfferer.residenceNumber;
                $scope.currentUser.userAccount.person.address[existe].address.street = $scope.newOfferer.residenceStreet;
                $scope.currentUser.userAccount.person.address[existe].address.suburb = $scope.newOfferer.residenceSuburb;
                $scope.currentUser.userAccount.person.address[existe].address.zone = $scope.newOfferer.residenceZone;
                $scope.currentUser.userAccount.person.address[existe].address.fullAddress = $scope.newOfferer.residenceFullAddress;
            } else if (type == 2) { //Nacimiento
                $scope.currentUser.userAccount.person.address[existe].address.country.id = $scope.newOfferer.birthCountry.id;
                $scope.currentUser.userAccount.person.address[existe].address.state.id = $scope.newOfferer.birthState.id;
                $scope.currentUser.userAccount.person.address[existe].address.city.id = $scope.newOfferer.birthCity.id;
            }
        } else {
            var address = {person: null, addressType: {id: type}, address: {country: {id: null}, state: {id: null}, city: {id: null}, number: null, street: null, suburb: null, zone: null}};
            if (type == 1) { //Residencia
                address.address.country.id = $scope.newOfferer.residenceCountry.id;
                address.address.state.id = $scope.newOfferer.residenceState.id;
                address.address.city.id = $scope.newOfferer.residenceCity.id;
                address.address.number = $scope.newOfferer.residenceNumber;
                address.address.street = $scope.newOfferer.residenceStreet;
                address.address.suburb = $scope.newOfferer.residenceSuburb;
                address.address.zone = $scope.newOfferer.residenceZone;
                address.address.fullAddress = $scope.newOfferer.residenceFullAddress;
                $scope.currentUser.userAccount.person.address.push(address);
            } else if (type == 2) { //Nacimiento
                address.address.country.id = $scope.newOfferer.birthCountry.id;
                address.address.state.id = $scope.newOfferer.birthState.id;
                address.address.city.id = $scope.newOfferer.birthCity.id;
                $scope.currentUser.userAccount.person.address.push(address);
            }
        }
    }

    function getIdentificationByType(type) {
        var existe = -1;
        for (var x = 0; x < $scope.currentUser.userAccount.person.identifications.length; x++) {
            var ident = $scope.currentUser.userAccount.person.identifications[x];
            if (ident.identificationType.id == type) {
                existe = x;
                break;
            }
        }
        console.log("Type " + type + " existe=" + existe);
        if (existe >= 0) {
            if (type == 1) { //CUI
                if ($scope.currentUser.userAccount.person.identifications[existe].modify) {
                    $scope.currentUser.userAccount.person.identifications[existe].identification = $scope.newOfferer.cui;
                    $scope.currentUser.userAccount.person.identifications[existe].identificationFields = [];
                    if ($scope.newOfferer.identCountryId) {
                        var identificationFields = {identificationTypeField: {id: 1}, values: $scope.newOfferer.identCountryId};
                        $scope.currentUser.userAccount.person.identifications[existe].identificationFields.push(identificationFields);
                    }
                    if ($scope.newOfferer.identStateId) {
                        var identificationFields = {identificationTypeField: {id: 2}, values: $scope.newOfferer.identStateId};
                        $scope.currentUser.userAccount.person.identifications[existe].identificationFields.push(identificationFields);
                    }
                    if ($scope.newOfferer.identCityId) {
                        var identificationFields = {identificationTypeField: {id: 3}, values: $scope.newOfferer.identCityId};
                        $scope.currentUser.userAccount.person.identifications[existe].identificationFields.push(identificationFields);
                    }
                }
            } else if (type == 4) { //NIT
                if ($scope.currentUser.userAccount.person.identifications[existe].modify) {
                    $scope.currentUser.userAccount.person.identifications[existe].identification = $scope.newOfferer.nit;
                }
            }
        } else {
            var identification = {};
            identification.identificationType = {};
            identification.identificationFields = [];
            identification.identificationType.id = type;
            if (type == 1) { //CUI
                identification.identification = $scope.newOfferer.cui;
                if ($scope.newOfferer.identCountryId) {
                    var identificationFields = {identificationTypeField: {id: 1}, values: $scope.newOfferer.identCountryId};
                    identification.identificationFields.push(identificationFields);
                }
                if ($scope.newOfferer.identStateId) {
                    var identificationFields = {identificationTypeField: {id: 2}, values: $scope.newOfferer.identStateId};
                    identification.identificationFields.push(identificationFields);
                }
                if ($scope.newOfferer.identCityId) {
                    var identificationFields = {identificationTypeField: {id: 3}, values: $scope.newOfferer.identCityId};
                    identification.identificationFields.push(identificationFields);
                }
                $scope.currentUser.userAccount.person.identifications.push(identification);
            } else if (type == 4) { //NIT
                identification.identification = $scope.newOfferer.nit;
                if ($scope.newOfferer.nit != null) {
                    $scope.currentUser.userAccount.person.identifications.push(identification);
                }

            }
        }
    }

    $scope.saveBasicInformation = function () {
        console.log('Guardando Cambios ... saveBasicInformation');
        fullNamePart();
        setPhone();
        getAddressByType(1);
        getAddressByType(2);
        getIdentificationByType(1); //CUI
        getIdentificationByType(4); //NIT
        var fecha = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.newOfferer.birthDate);
        var today = new Date(parseInt(fecha[3], 10), parseInt(fecha[2], 10) - 1, parseInt(fecha[1], 10));
        console.log(today);
        $scope.currentUser.userAccount.person.birthDate = today;
        console.log($scope.currentUser.userAccount.person);
        if ($scope.currentUser.userAccount.person.id) {
            $scope.currentUser.userAccount.person.offerer = {};
            PersonService.update($scope.currentUser.userAccount.person.id, $scope.currentUser.userAccount.person)
                .then(function (result) {
                    console.log(result);
                    if (result.status == '200' || result.status == '201') {
                        if (!$scope.currentUser.userAccount.id) {
                            $scope.currentUser.userAccount.person.id = result.data.id;
                            UserAccountService.create($scope.currentUser.userAccount)
                                .then(function (response) {
                                    if (result.status == '200' || result.status == '201') {
                                        console.log(response.data);
                                        $scope.currentUser = response.data;
                                        UserService.setCurrentUser($scope.currentUser);
                                        $scope.messageResponse.message = result.status + ' ' + result.statusText;
                                        console.log($scope.messageResponse.message);
                                        $state.go('Offerer.AboutTheWork');
                                        return true;
                                    } else {
                                        bootbox.alert(result.status + ' ' + result.statusText);
                                        return false;
                                    }
                                });
                        } else {
                            $scope.currentUser.userAccount.person = result.data;
                            UserService.setCurrentUser($scope.currentUser);
                            $scope.messageResponse.message = result.status + ' ' + result.statusText;
                            console.log($scope.messageResponse.message);
                            $state.go('Offerer.AboutTheWork');
                        }
                    } else {
                        bootbox.alert(result.status + ' ' + result.statusText);
                        return false;
                    }
                });
        } else {
            PersonService.create($scope.currentUser.userAccount.person)
                .then(function (result) {
                    console.log(result);
                    if (result.status == '200' || result.status == '201') {
                        $scope.currentUser.userAccount.person.id = result.data.id;
                        UserAccountService.create($scope.currentUser.userAccount)
                            .then(function (response) {
                                console.log(response.data);
                                $scope.currentUser.userAccount = response.data;
                                UserService.setCurrentUser($scope.currentUser);
                                $scope.messageResponse.message = result.status + ' ' + result.statusText;
                                console.log($scope.messageResponse.message);
                                $state.go('Offerer.AboutTheWork');
                                return true;
                            });
                    } else {
                        bootbox.alert(result.status + ' ' + result.statusText);
                        return false;
                    }
                });
        }
        //$state.go('/CV/dashboard');
    };

    $scope.convertToDate = function (stringDate) {
        var dateOut = new Date(stringDate);
        dateOut.setDate(dateOut.getDate() + 1);
        return dateOut;
    };

    function getOfferer() {
        console.log($scope.currentUser);
        if($scope.currentUser){
            if($scope.currentUser.userAccount){
                if($scope.currentUser.userAccount){
                     if($scope.currentUser.userAccount.person) {
                         $scope.offerer = $scope.currentUser.userAccount.person.offerer;
                     }
                 }
                }
        }


        var fullName = $scope.currentUser.userAccount.person.fullName.split(';');
        for (var x = 0; x < fullName.length; x++) {
            //console.log(fullName[x]);
            var simpleName = fullName[x].split(',');
            for (var y = 0; y < simpleName.length; y++) {
                //console.log(simpleName[y]);
                if (x == 0) {//Nombres
                    if (y == 0) {//1er Nombre
                        $scope.newOfferer.firstName = simpleName[y];
                    } else {
                        $scope.newOfferer.middleName = simpleName[y];
                    }
                } else if (x == 1) {//Apellidos
                    if (y == 0) {//1er Apellido
                        $scope.newOfferer.mainLastName = simpleName[y];
                    } else {
                        $scope.newOfferer.secondLastName = simpleName[y];
                    }
                }
            }
        }

        if ($scope.currentUser.userAccount.person.phone) {
            for (var x = 0; x < $scope.currentUser.userAccount.person.phone.length; x++) {
                if ($scope.currentUser.userAccount.person.phone[x].phoneType.id == 1) {
                    $scope.newOfferer.phone = $scope.currentUser.userAccount.person.phone[x].phoneNumber;
                } else if ($scope.currentUser.userAccount.person.phone[x].phoneType.id == 2) {
                    $scope.newOfferer.cellPhone = $scope.currentUser.userAccount.person.phone[x].phoneNumber;
                }
            }
        }
        $scope.newOfferer.nitModify = true;
        $scope.newOfferer.cuiModify = true;
        for (var x = 0; x < $scope.currentUser.userAccount.person.identifications.length; x++) {
            if ($scope.currentUser.userAccount.person.identifications[x].identificationType.id == 1) {
                $scope.newOfferer.cui = $scope.currentUser.userAccount.person.identifications[x].identification;
                $scope.newOfferer.cuiModify = $scope.currentUser.userAccount.person.identifications[x].modify;
                if ($scope.currentUser.userAccount.person.identifications[x].identificationFields) {
                    for (var y = 0; y < $scope.currentUser.userAccount.person.identifications[x].identificationFields.length; y++) {
                        if ($scope.currentUser.userAccount.person.identifications[x].identificationFields[y].identificationTypeField.id == 1) {
                            $scope.newOfferer.identCountryId = $scope.currentUser.userAccount.person.identifications[x].identificationFields[y].values;
                        } else if ($scope.currentUser.userAccount.person.identifications[x].identificationFields[y].identificationTypeField.id == 2) {
                            $scope.newOfferer.identStateId = $scope.currentUser.userAccount.person.identifications[x].identificationFields[y].values;
                        } else if ($scope.currentUser.userAccount.person.identifications[x].identificationFields[y].identificationTypeField.id == 3) {
                            $scope.newOfferer.identCityId = $scope.currentUser.userAccount.person.identifications[x].identificationFields[y].values;
                        }
                    }
                }
            } else if ($scope.currentUser.userAccount.person.identifications[x].identificationType.id == 4) {
                $scope.newOfferer.nit = $scope.currentUser.userAccount.person.identifications[x].identification;
                $scope.newOfferer.nitModify = $scope.currentUser.userAccount.person.identifications[x].modify;
            }
        }
        $scope.newOfferer.driverLicenseNA = true;
        for (var x = 0; x < $scope.currentUser.userAccount.person.driverLicense.length; x++) {
            if ($scope.currentUser.userAccount.person.driverLicense[x].driver == 'A') {
                $scope.driverLicense = true;
                $scope.newOfferer.driverLicenseA = true;
                $scope.newOfferer.driverLicenseNA = false;
            } else if ($scope.currentUser.userAccount.person.driverLicense[x].driver == 'B') {
                $scope.driverLicense = true;
                $scope.newOfferer.driverLicenseB = true;
                $scope.newOfferer.driverLicenseNA = false;
            } else if ($scope.currentUser.userAccount.person.driverLicense[x].driver == 'C') {
                $scope.driverLicense = true;
                $scope.newOfferer.driverLicenseC = true;
                $scope.newOfferer.driverLicenseNA = false;
            } else if ($scope.currentUser.userAccount.person.driverLicense[x].driver == 'M') {
                $scope.driverLicense = true;
                $scope.newOfferer.driverLicenseM = true;
                $scope.newOfferer.driverLicenseNA = false;
            }
        }
        $scope.noTengoLicencia();

        $scope.newOfferer.gender = $scope.currentUser.userAccount.person.gender;
        $scope.newOfferer.maritalStatus = $scope.currentUser.userAccount.person.maritalStatus;
        if ($scope.currentUser.userAccount.person.birthDate) {
            var today = $filter('date')($scope.currentUser.userAccount.person.birthDate, 'dd/MM/yyyy');
            console.log("Fecha " + today.substring(0, 10));
            $scope.newOfferer.birthDate = today.substring(0, 10);
        }
        for (var z = 0; z < $scope.currentUser.userAccount.person.address.length; z++) {
            if ($scope.currentUser.userAccount.person.address[z].addressType.id == 1) {
                $scope.newOfferer.residenceZone = $scope.currentUser.userAccount.person.address[z].address.zone;
                $scope.newOfferer.residenceFullAddress = $scope.currentUser.userAccount.person.address[z].address.fullAddress;
                $scope.newOfferer.residenceNumber = $scope.currentUser.userAccount.person.address[z].address.number;
                $scope.newOfferer.residenceStreet = $scope.currentUser.userAccount.person.address[z].address.street;
                $scope.newOfferer.residenceSuburb = $scope.currentUser.userAccount.person.address[z].address.suburb;
                $scope.newOfferer.residenceCountry = $scope.currentUser.userAccount.person.address[z].address.country;
                $scope.newOfferer.residenceState = $scope.currentUser.userAccount.person.address[z].address.state;
                $scope.newOfferer.residenceCity = $scope.currentUser.userAccount.person.address[z].address.city;
            } else if ($scope.currentUser.userAccount.person.address[z].addressType.id == 2) {
                $scope.newOfferer.birthCountry = $scope.currentUser.userAccount.person.address[z].address.country;
                $scope.newOfferer.birthState = $scope.currentUser.userAccount.person.address[z].address.state;
                $scope.newOfferer.birthCity = $scope.currentUser.userAccount.person.address[z].address.city;
            }
        }

        $scope.getAllStates('birth');
        $scope.getAllStates('ident');
        $scope.getAllStates('address');
        $scope.getAllCitys('birth');
        $scope.getAllCitys('address');
        $scope.getAllCitys('ident');

    };

    function getAllCountrys() {
        GenericService.allCountry()
            .then(function (result) {
                $scope.countrys = result.data;
                $scope.countrysIdent = result.data;
                $scope.countrysAddress = result.data;
            });
    };

    $scope.getAllStates = function (type) {
        if (type == 'birth') {
            if ($scope.newOfferer.birthCountry) {
                var id = $scope.newOfferer.birthCountry.id;
                GenericService.allStatesByCountry(id)
                    .then(function (result) {
                        $scope.statesBirth = result.data;
                    });
            }
        } else if (type == 'ident') {
            if ($scope.newOfferer.identCountryId) {
                var id = $scope.newOfferer.identCountryId;
                GenericService.allStatesByCountry(id)
                    .then(function (result) {
                        $scope.statesIdent = result.data;
                    });
            }
        } else if (type == 'address') {
            if ($scope.newOfferer.residenceCountry) {
                var id = $scope.newOfferer.residenceCountry.id;
                GenericService.allStatesByCountry(id)
                    .then(function (result) {
                        $scope.statesResidence = result.data;
                    });
            }
        }
    };
    $scope.getAllCitys = function (type) {
        if (type == 'birth') {
            if ($scope.newOfferer.birthState) {
                var id = $scope.newOfferer.birthState.id;
                console.log(id);
                GenericService.allCitysByState(id)
                    .then(function (result) {
                        $scope.citys = result.data;
                    });
            }
        } else if (type == 'ident') {
            if ($scope.newOfferer.identStateId) {
                var id = $scope.newOfferer.identStateId;
                GenericService.allCitysByState(id)
                    .then(function (result) {
                        $scope.citysIdent = result.data;
                    });
            }
        } else if (type == 'address') {
            if ($scope.newOfferer.residenceState) {
                var id = $scope.newOfferer.residenceState.id;
                GenericService.allCitysByState(id)
                    .then(function (result) {
                        $scope.citysAddress = result.data;
                    });
            }
        }
    };


    $scope.nextStep = function (nextStep) {
        console.log('nextStep ' + nextStep);
        if (nextStep == '1') {
            $state.go('Offerer.GeneralInformation');
        } else if (nextStep == '2') {
            $scope.saveBasicInformation();
        }
    };

    getOfferer();

    getAllCountrys();

    $scope.nitIsValid = function (nit) {
        if (!nit) {
            return true;
        }
        if ($rootScope.ocultarCamposHonduras) {
            return true;
        }

        var nitRegExp = new RegExp('^[0-9]+(-?[0-9kK])?$');

        if (!nitRegExp.test(nit)) {
            return false;
        }

        nit = nit.replace(/-/, '');
        var lastChar = nit.length - 1;
        var number = nit.substring(0, lastChar);
        var expectedCheker = nit.substring(lastChar, lastChar + 1).toLowerCase();

        var factor = number.length + 1;
        var total = 0;

        for (var i = 0; i < number.length; i++) {
            var character = number.substring(i, i + 1);
            var digit = parseInt(character, 10);

            total += (digit * factor);
            factor = factor - 1;
        }

        var modulus = (11 - (total % 11)) % 11;
        var computedChecker = (modulus == 10 ? "k" : modulus.toString());

        return expectedCheker === computedChecker;
    };

    $scope.cuiIsValid = function (cui) {
        if (!cui) {
            return true;
        }
        if ($rootScope.ocultarCamposHonduras) {
            return true;
        }

        var nitRegExp = new RegExp('^[1-9]+[0-9]*([0-9]+)+$');
        if (!nitRegExp.test(cui)) {
            return false;
        } else {
            return true;
        }

    }

}]);
RRHH.controller("AboutTheWorkController", [ '$scope','$rootScope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService','$translatePartialLoader','$translate', function ($scope,$rootScope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService,$translatePartialLoader,$translate) {
    $scope.currentUser = UserService.getCurrentUser();
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    if($scope.currentUser && $scope.currentUser.userAccount && $scope.currentUser.userAccount.person && $scope.currentUser.userAccount.person.id){
        console.log("OK");
    }else{
        bootbox.alert("Es necesario completar el paso de Información General", function () {
            $state.go('Offerer.GeneralInformation');
        });
    }

    $scope.Job = {currency: {id: 1}, workDay: {id: 1}, workPlaceType: {id: 1}};
    $scope.workPlaceType = [/*{ id:2,name:'Permanente'},{id:3,name:'Temporal'},{id:4,name:'Asesoría/Consultoría'}*/];
    $scope.workDay = [/*{ id: 1, name: 'Matutino'},{id: 2, name: 'Vespertino'},{id: 3, name: 'Mixto'}*/];
    $scope.currency = [];
    $scope.company = [];
    $scope.Job.offererCompany = [];
    $scope.workingArea = [];
    $scope.offerer = {};
    $scope.messageResponse = {message: '', class: 'alert alert-success alert-dismissable', icon: 'fa fa-check', type: 'OK!'};

    function getCompanysOfferer() {
        $scope.offerer.company = [];
        for (var x = 0; x < $scope.company.length; x++) {
            if ($scope.company[x].ok) {
                //$scope.offerer.company.push({id: $scope.company[x].id, refererBy: $scope.company[x].refererBy});
                $scope.currentUser.userAccount.person.offerer.company.push({id: $scope.company[x].id, refererBy: $scope.company[x].refererBy});
            }
        }
    }

    function getStatesOfferer() {
        $scope.offerer.state = [];
        for (var x = 0; x < $scope.statesResidence.length; x++) {
            if ($scope.statesResidence[x].ok) {
                //$scope.offerer.state.push({id: $scope.statesResidence[x].id});
                $scope.currentUser.userAccount.person.offerer.state.push({id: $scope.statesResidence[x].id});
            }
        }
    }

    function getWorkingAreaOfferer() {
        $scope.offerer.workingArea = [];
        for (var x = 0; x < $scope.workingArea.length; x++) {
            if ($scope.workingArea[x].ok) {
                //$scope.offerer.workingArea.push({id: $scope.workingArea[x].id});
                $scope.currentUser.userAccount.person.offerer.workingArea.push({id: $scope.workingArea[x].id});
            }
        }
    }

    $scope.getReferedBy = function (company) {
        var referedBy = "";
        for (var x = 0; x < $scope.Job.offererCompany.length; x++) {
            var c = $scope.Job.offererCompany[x];
            if (c.id == company) {
                referedBy = c.referedBy;
            }
        }
        return referedBy;
    };
    $scope.setReferedBy = function (referedBy, company) {
        for (var x = 0; x < $scope.Job.offererCompany.length; x++) {
            var c = $scope.Job.offererCompany[x];
            if (c.id == company) {
                $scope.Job.offererCompany[x].referedBy = referedBy;
            }
        }
    };
    $scope.setCheched = function (company) {
        var r = false;
        for (var x = 0; x < $scope.Job.offererCompany.length; x++) {
            var c = $scope.Job.offererCompany[x];
            if (c.id == company) {
                r = true;
                break;
            }
        }
        return r;
    };
    $scope.saveAboutTheWork = function () {
        console.log('Guardando Cambios ... saveAboutTheWork ');
        $scope.currentUser.userAccount.person.offerer.previousJobs = [];
        $scope.currentUser.userAccount.person.offerer.offererFamily = [];
        if ($scope.currentUser.userAccount.person.offerer.workPlaceType.length > 0) {
            $scope.currentUser.userAccount.person.offerer.workPlaceType[0].id = $scope.Job.workPlaceType.id;
        } else {
            var id = {id: $scope.Job.workPlaceType.id};
            $scope.currentUser.userAccount.person.offerer.workPlaceType.push(id);
        }
        if ($scope.currentUser.userAccount.person.offerer.workDay.length > 0) {
            $scope.currentUser.userAccount.person.offerer.workDay[0].id = $scope.Job.workDay.id;
        } else {
            var id = {id: $scope.Job.workDay.id};
            $scope.currentUser.userAccount.person.offerer.workDay.push(id);
        }
        if ($scope.currentUser.userAccount.person.offerer.currency) {
            $scope.currentUser.userAccount.person.offerer.currency.id = $scope.Job.currency.id;
        } else {
            $scope.currentUser.userAccount.person.offerer.currency = {id: $scope.Job.currency.id};
        }
        $scope.currentUser.userAccount.person.offerer.salary = $scope.Job.salaryRequired;
        getCompanysOfferer();

        getStatesOfferer();
        getWorkingAreaOfferer();
        //var today = $filter('date')($scope.currentUser.userAccount.person.birthDate, 'yyyy-MM-dd');
        //$scope.currentUser.userAccount.person.birthDate = today;
        console.log($scope.currentUser.userAccount.person);
        if ($scope.currentUser.userAccount.person.offerer.id) {
            OffererService.update($scope.currentUser.userAccount.person.offerer.id, $scope.currentUser.userAccount.person.offerer)
                .then(function (result) {
                    $scope.currentUser.userAccount.person.offerer = result.data;
                    UserService.setCurrentUser($scope.currentUser);
                    console.log(result.data);
                    $scope.messageResponse.message = result.status + ' ' + result.statusText;
                    console.log("Resp " + $scope.messageResponse.message);
                    $state.go('Offerer.FamilyAndEducation');
                });
        }
    };

    $scope.nextStep = function (nextStep) {
        console.log('nextStep ' + nextStep);
        if (nextStep == '2') {
            $state.go('Offerer.GeneralInformation');
        } else if (nextStep == '3') {
            $scope.saveAboutTheWork();
        }
    };

    function getOfferer() {
        $scope.Job.currency.id = 1;
        $scope.Job.salaryRequired = 0.0;
        $scope.Job.workDay.id = 1;
        console.log($scope.currentUser.userAccount);
        if ($scope.currentUser.userAccount.person.offerer) {
            if ($scope.currentUser.userAccount.person.offerer.currency) {
                $scope.Job.currency.id = $scope.currentUser.userAccount.person.offerer.currency.id;
            }
            if ($scope.currentUser.userAccount.person.offerer.salary) {
                $scope.Job.salaryRequired = $scope.currentUser.userAccount.person.offerer.salary;
            }
            if ($scope.currentUser.userAccount.person.offerer.state) {
                $scope.Job.state = $scope.currentUser.userAccount.person.offerer.state;
            }

            if ($scope.currentUser.userAccount.person.offerer.workDay.length > 0) {
                $scope.Job.workDay.id = $scope.currentUser.userAccount.person.offerer.workDay[0].id;
            }

            $scope.Job.workingArea = $scope.currentUser.userAccount.person.offerer.workingArea;
            $scope.Job.offererCompany = [];

            for (var x = 0; x < $scope.currentUser.userAccount.person.offerer.company.length; x++) {
                $scope.Job.offererCompany.push({id: $scope.currentUser.userAccount.person.offerer.company[x].company.id, refererBy: $scope.currentUser.userAccount.person.offerer.company[x].refererBy});
            }
            ;

            GenericService.allCompany($scope.currentUser.userAccount.person.offerer.id)
                .then(function (result) {
                    $scope.company = result.data;
                    for (var x = 0; x < $scope.company.length; x++) {
                        var ok = $filter('filter')($scope.Job.offererCompany, {id: $scope.company[x].id}, true);
                        if (ok.length == 1) {
                            $scope.company[x].refererBy = ok[0].refererBy;
                            $scope.company[x].ok = true;
                        } else {
                            $scope.company[x].refererBy = "";
                            $scope.company[x].ok = false;
                        }
                        console.log($scope.company[x]);
                    };
                });

            if ($scope.currentUser.userAccount.person.offerer.workPlaceType.length > 0) {
                $scope.Job.workPlaceType.id = $scope.currentUser.userAccount.person.offerer.workPlaceType[0].id;
            } else {
                $scope.Job.workPlaceType.id = 1;
            }

            var id = 0;
            if ($scope.currentUser.userAccount.person.address.length > 0) {
                for (var x = 0; x < $scope.currentUser.userAccount.person.address.length; x++) {
                    var adr = $scope.currentUser.userAccount.person.address[x];
                    if (adr.addressType.id = 1) {
                        id = adr.address.country.id;
                        break;
                    }
                }
            }
            GenericService.allStatesByCountry(id)
                .then(function (result) {
                    $scope.statesResidence = result.data;
                    for (var x = 0; x < $scope.statesResidence.length; x++) {
                        var ok = $filter('filter')($scope.Job.state, {id: $scope.statesResidence[x].id}, true);
                        if (ok.length == 1) {
                            $scope.statesResidence[x].ok = true;
                        } else {
                            $scope.statesResidence[x].ok = false;
                        }
                    }
                    ;
                });

            GenericService.allWorkPlaceType()
                .then(function (result) {
                    $scope.workPlaceType = result.data;
                });
            GenericService.allWorkingArea()
                .then(function (result) {
                    $scope.workingArea = result.data;
                    for (var x = 0; x < $scope.workingArea.length; x++) {
                        var ok = $filter('filter')($scope.Job.workingArea, {id: $scope.workingArea[x].id}, true);
                        if (ok.length == 1) {
                            $scope.workingArea[x].ok = true;
                        } else {
                            $scope.workingArea[x].ok = false;
                        }
                    }
                });
            GenericService.allWorkDay()
                .then(function (result) {
                    $scope.workDay = result.data;
                });
            GenericService.allCurrency()
                .then(function (result) {
                    $scope.currency = result.data;
                    if($rootScope.ocultarCamposHonduras){
                        var ok = $filter('filter')($scope.currency, {id: 1}, true);
                        console.log(ok);
                        var index = $scope.currency.indexOf(ok[0]);
                        $scope.currency.splice(index,1);
                    }
                    console.log($scope.currency);
                });
        }


    }

    getOfferer();

}]);
RRHH.controller("FamilyAndEducacionController", ['$rootScope', '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService','$translatePartialLoader','$translate', function ($rootScope, $scope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService,$translatePartialLoader,$translate) {
    $scope.currentUser = UserService.getCurrentUser();
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    if($scope.currentUser && $scope.currentUser.userAccount && $scope.currentUser.userAccount.person && $scope.currentUser.userAccount.person.id){
        console.log("OK");
    }else{
        bootbox.alert("Es necesario completar el paso de Información General", function () {
            $state.go('Offerer.GeneralInformation');
        });
    }

    $scope.familiares = [];
    $scope.Family = {depends: false, birthDate: null, fullName: null};
    $scope.Family.relationShipType = null;
    $scope.relationShipTypeAll = [];
    $scope.gradesLevel2 = [];
    $scope.gradesLevel3 = [];
    $scope.gradesLevel4 = [];
    $scope.gradesLevel5 = [];
    $scope.gradesLevel6 = [];
    $scope.gradesLevel7 = [];

    $scope.verAgregarFamiliares = false;
    $scope.verAgregarIdiomas = false;
    $scope.verAgregarEducacion = false;
    $scope.tieneBasicos = false;
    $scope.tieneDiversificado = false;
    $scope.tieneTecnico = false;
    $scope.tieneUniversidad = false;
    $scope.tieneMaestria = false;

    $scope.messageResponse = {message: '', class: 'alert alert-success alert-dismissable', icon: 'fa fa-check', type: 'OK!'};

    $scope.relationsships = [/*{ label: 'Tio(a)', value: 'T', name: 'Tio(a)' },{ label: 'Primo(a)', value: 'P', name: 'Primo(a)' },{ label: 'Abuelo(a)', value: 'A', name: 'Abuelo(a)' },{ label: 'Padrastro', value: 'PD', name: 'Padrastro' },{ label: 'Padre', value: 'P', name: 'Padre' },{ label: 'Madre', value: 'M', name: 'Madre' },{ label: 'Hijo(a)', value: 'HJ' },{ label: 'Conyuge', value: 'C' },{ label: 'Hermano(a)', value: 'H' }*/];
    $scope.languages = [/*{name: 'Inglés', abbreviation: 'ENG'},{name: 'Frances', abbreviation: 'FRN'}*/];
    $scope.Education = [];
    $scope.Education.primaria = null;
    $scope.Education.basico = null;
    $scope.Education.diversificado = null;
    $scope.Education.tecnico = null;
    $scope.Education.universidad = null;
    $scope.Education.maestria = null;
    $scope.personLanguages = [];
    $scope.LanguageTemp = {};

    $scope.guardarLanguage = function () {
        console.log($scope.LanguageTemp.language);
        if ($scope.LanguageTemp.language && $scope.LanguageTemp.reading && $scope.LanguageTemp.conversation) {
            var valTemp = $filter('filter')($scope.languages, {abbreviation: $scope.LanguageTemp.language}, true);
            $scope.LanguageTemp.language = valTemp[0];
            console.log($scope.LanguageTemp);
            if ($scope.languageSelected > -1) {
                $scope.personLanguages[$scope.languageSelected] = $scope.LanguageTemp;
            } else {
                if (!$scope.personLanguages) {
                    $scope.personLanguages = [];
                }
                for (var x = 0; x < $scope.personLanguages.length; x++) {
                    if ($scope.personLanguages[x].language.abbreviation == $scope.LanguageTemp.language.abbreviation) {
                        $scope.personLanguages.splice(x, 1);
                        break;
                    }
                }
                $scope.personLanguages.push($scope.LanguageTemp);
                //console.log($scope.currentUser.userAccount.person.personLanguage);
                $scope.currentUser.userAccount.person.personLanguages = $scope.personLanguages;
                console.log($scope.currentUser.userAccount.person.personLanguages);
                OffererService.update($scope.currentUser.userAccount.person.offerer.id + '/Language', $scope.currentUser.userAccount.person.personLanguages)
                    .then(function (result) {
                        console.log(result.data);
                        $scope.currentUser.userAccount.person.personLanguages = result.data;
                        $scope.personLanguages = result.data;
                        UserService.setCurrentUser($scope.currentUser);
                        $scope.messageResponse.message = result.status + ' ' + result.statusText;
                        console.log("Resp " + $scope.messageResponse.message);
                    });
            }
            $scope.languageSelected = -1;
            $scope.LanguageTemp = {};
        } else {
            bootbox.alert("Datos Incompletos!!!");
        }
    };
    $scope.editarRegistroLanguage = function (index) {
        console.log(index);
        $scope.languageSelected = index;
        $scope.LanguageTemp = $scope.Education.language[index];
        console.log($scope.LanguageTemp);
        var temp = {language: $scope.LanguageTemp.language.abbreviation, reading: $scope.LanguageTemp.reading, conversation: $scope.LanguageTemp.conversation};
        $scope.LanguageTemp = temp;
    };
    $scope.removerRegistroLanguage = function (index) {
        $scope.Education.language.splice(index, 1);
        $scope.languageSelected = -1;
        $scope.currentUser.userAccount.person.personLanguages = $scope.personLanguages;
        OffererService.update($scope.currentUser.userAccount.person.offerer.id + '/Language', $scope.currentUser.userAccount.person.personLanguages)
            .then(function (result) {
                console.log(result.data);
                $scope.currentUser.userAccount.person.personLanguages = result.data;
                UserService.setCurrentUser($scope.currentUser);
                $scope.messageResponse.message = result.status + ' ' + result.statusText;
                console.log("Resp " + $scope.messageResponse.message);
            });
    };

    $scope.guardarFamilia = function () {
        console.log($scope.Family.relationShipType);
        var relationship = $filter('filter')($scope.relationShipTypeAll, {code: $scope.Family.relationShipType}, true);
        $scope.Family.relationShipType = relationship[0];
        console.log($scope.Family);
        if ($scope.Family.fullName && $scope.Family.depends && $scope.Family.relationShipType) {
            if ($scope.familiaSelected > -1) {
                $scope.familiares[$scope.familiaSelected] = $scope.Family;
            } else {
                for (var x = 0; x < $scope.familiares.length; x++) {
                    if ($scope.familiares[x].fullName == $scope.Family.fullName && $scope.familiares[x].relationShipType.code == $scope.Family.relationShipType.code) {
                        $scope.familiares.splice(x, 1);
                        break;
                    }
                }
                $scope.familiares.push($scope.Family);
                console.log($scope.currentUser.userAccount.person.offerer.offererFamily);
                console.log($scope.familiares);
                console.log($scope.Family);
                $scope.currentUser.userAccount.person.offerer.offererFamily = $scope.familiares;
                //$scope.currentUser.userAccount.person.offerer.offererFamily.push($scope.Family);
                for (var x = 0; x < $scope.currentUser.userAccount.person.offerer.offererFamily.length; x++) {
                    if ($scope.currentUser.userAccount.person.offerer.offererFamily[x].birthDate && $scope.currentUser.userAccount.person.offerer.offererFamily[x].birthDate != null) {
                        var fechax = $filter('date')($scope.currentUser.userAccount.person.offerer.offererFamily[x].birthDate, 'dd/MM/yyyy');
                        var fecha = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fechax);
                        var today = new Date(parseInt(fecha[3], 10), parseInt(fecha[2], 10) - 1, parseInt(fecha[1], 10));
                        $scope.currentUser.userAccount.person.offerer.offererFamily[x].birthDate = today;
                    }
                }
                console.log($scope.currentUser.userAccount.person.offerer.offererFamily);
                OffererService.updateFamily($scope.currentUser.userAccount.person.offerer.id + '/Family', $scope.currentUser.userAccount.person.offerer.offererFamily)
                    .then(function (result) {
                        console.log(result.data);
                        if (result.status == '200' || result.status == '201') {
                            $scope.currentUser.userAccount.person.offerer.offererFamily = result.data;
                            UserService.setCurrentUser($scope.currentUser);
                        }
                        $scope.messageResponse.message = result.status + ' ' + result.statusText;
                        console.log("Resp " + $scope.messageResponse.message);
                    });
            }
        } else {
            bootbox.alert("Datos Incompletos!!!");
        }
        $scope.Family = {};
        $scope.familiaSelected = -1;
    };
    $scope.editarRegistroFamilia = function (index) {
        console.log(index);
        $scope.familiaSelected = index;
        $scope.Family = $scope.familiares[index];
        console.log($scope.Family);
        var temp = {fullName: $scope.Family.fullName, relationShipType: $scope.Family.relationShipType.code, birthDate: $scope.Family.birthDate, depende: $scope.Family.depende};
        $scope.Family = temp;
    };
    $scope.removerRegistroFamilia = function (index) {
        $scope.familiares.splice(index, 1);
        $scope.currentUser.userAccount.person.offerer.offererFamily = $scope.familiares;
        $scope.familiaSelected = -1;
        OffererService.updateFamily($scope.currentUser.userAccount.person.offerer.id + '/Family', $scope.currentUser.userAccount.person.offerer.offererFamily)
            .then(function (result) {
                console.log(result.data);
                $scope.currentUser.userAccount.person.offerer.offererFamily = result.data;
                UserService.setCurrentUser($scope.currentUser);
                $scope.messageResponse.message = result.status + ' ' + result.statusText;
                console.log("Resp " + $scope.messageResponse.message);
            });
    };

    $scope.saveEducations = function () {
        $scope.currentUser.userAccount.person.offerer.studiesLevelGrade = [];
        if ($scope.Education.primaria) {
            $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.push({id: $scope.Education.primaria});
            if ($scope.Education.basico) {
                $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.push({id: $scope.Education.basico});
                if ($scope.Education.diversificado) {
                    $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.push({id: $scope.Education.diversificado});
                    if ($scope.Education.tecnico) {
                        $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.push({id: $scope.Education.tecnico});
                    }
                    if ($scope.Education.universidad) {
                        $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.push({id: $scope.Education.universidad});
                        if ($scope.Education.maestria) {
                            $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.push({id: $scope.Education.maestria});
                        }
                    }
                }
            }
        }
    }

    $scope.saveFamilyAndEducation = function () {
        $scope.saveEducations();
//        if ($scope.currentUser.userAccount.person.offerer.offererFamily.length == 0) {
//            bootbox.alert("No ha registrado a ningún Familiar", function () {
//                verAgregarFamiliares = true;
//            });
//        } else
        if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade.length == 0) {
            bootbox.alert("No ha ingresado el nivel de Educacion.", function () {
                verAgregarEducacion = true;
            });
        } else {
            OffererService.update($scope.currentUser.userAccount.person.offerer.id + "/Education", $scope.currentUser.userAccount.person.offerer.studiesLevelGrade)
                .then(function (result) {
                    console.log(result.data);
                    if (result.status == '200' || result.status == '201') {
                        $scope.currentUser.userAccount.person.offerer.studiesLevelGrade = result.data;
                        UserService.setCurrentUser($scope.currentUser);
                        $state.go('Offerer.PreviousJobsAndReferences');
                    }
                });
        }
    };

    $scope.getAllRelationShipType = function () {
        GenericService.allRelationShipType()
            .then(function (result) {
                $scope.relationShipTypeAll = result.data;
            });
    };

    $scope.getStudiesGradeByLevel = function (level) {
//        if(level==3 && $rootScope.ocultarCamposHonduras){
//            GenericService.getByURL("StudiesLevelGrade/byLevel/"+4)
//                .then(function (result) {
//                    if(result.status=='200' || result.status=='201'){
//                        $scope.gradesLevel3 = result.data;
//                    }
//                });
//            $scope.gradesLevel3
//        }
        GenericService.getByURL("StudiesLevelGrade/byLevel/" + level)
            .then(function (result) {
                if (result.status == '200' || result.status == '201') {
                    if (level == 2) { //Primaria
                        $scope.gradesLevel2 = result.data;
                    } else if (level == 3) { //Basico
                        if ($scope.Education.primaria == 6) {
                            $scope.gradesLevel3 = result.data;
                        } else {
                            $scope.Education.basico = null;
                            $scope.Education.diversificado = null;
                            $scope.Education.tecnico = null;
                            $scope.Education.universidad = null;
                            $scope.Education.maestria = null;
                        }
                    } else if (level == 4) { //Diversificado
                        if ($scope.Education.basico) {
                            $scope.gradesLevel4 = result.data;
                        } else {
                            $scope.Education.universidad = null;
                            $scope.Education.maestria = null;
                        }
                    } else if (level == 5) { //Tecnico
                        $scope.gradesLevel5 = result.data;
                        $scope.getStudiesGradeByLevel(6);
                    } else if (level == 6) { //Universidad
                        if ($scope.Education.diversificado) {
                            $scope.gradesLevel6 = result.data;
                        } else {
                            $scope.Education.maestria = null;
                        }
                    } else if (level == 7) { //Maestria
                        $scope.gradesLevel7 = result.data;
                    }
                }
            });
    };

    function getOfferer() {
        console.log($scope.familiares);
        $scope.familiares = [];
        if ($scope.currentUser.userAccount.person.offerer) {
            if ($scope.currentUser.userAccount.person.offerer.offererFamily) {
                $scope.familiares = $scope.currentUser.userAccount.person.offerer.offererFamily;
            }

        }

        console.log($scope.familiares);
        console.log($scope.currentUser.userAccount.person);
        //for (var z = 0; z < $scope.currentUser.userAccount.person.personLanguage.length; z++) {
        $scope.personLanguages = $scope.currentUser.userAccount.person.personLanguages;
        //}
        if($scope.currentUser.userAccount.person.offerer){
            if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade) {
                for (var z = 0; z < $scope.currentUser.userAccount.person.offerer.studiesLevelGrade.length; z++) {
                    if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].studiesLevel.id == 2) {
                        $scope.Education.primaria = $scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].id;
                    } else if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].studiesLevel.id == 3) {
                        $scope.Education.basico = $scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].id;
                        $scope.tieneBasicos = true;
                        $scope.getStudiesGradeByLevel(3);
                    } else if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].studiesLevel.id == 4) {
                        $scope.Education.diversificado = $scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].id;
                        $scope.tieneDiversificado = true;
                        $scope.getStudiesGradeByLevel(4);
                    } else if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].studiesLevel.id == 5) {
                        $scope.Education.tecnico = $scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].id;
                        $scope.tieneTenico = true;
                        $scope.getStudiesGradeByLevel(5);
                    } else if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].studiesLevel.id == 6) {
                        $scope.Education.universidad = $scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].id;
                        $scope.tieneUniversidad = true;
                        $scope.getStudiesGradeByLevel(6);
                    } else if ($scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].studiesLevel.id == 7) {
                        $scope.Education.maestria = $scope.currentUser.userAccount.person.offerer.studiesLevelGrade[z].id;
                        $scope.tieneMaestria = true;
                        $scope.getStudiesGradeByLevel(7);
                    }
                }
            }
        }
        GenericService.getByURL("Language/")
            .then(function (result) {
                $scope.languages = result.data;
            });

        $scope.getStudiesGradeByLevel(2);

        $scope.getAllRelationShipType();
    }

    $scope.nextStep = function (nextStep) {
        console.log('nextStep ' + nextStep);
        if (nextStep == '2') {
            $state.go('Offerer.AboutTheWork');
        } else if (nextStep == '4') {
            $scope.saveFamilyAndEducation();
        }
    };

    getOfferer();

}]);
RRHH.controller("PreviousJobsAndReferenceController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService','$translatePartialLoader','$translate', function ($scope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService,$translatePartialLoader,$translate) {
    $scope.currentUser = UserService.getCurrentUser();
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    if($scope.currentUser && $scope.currentUser.userAccount && $scope.currentUser.userAccount.person && $scope.currentUser.userAccount.person.id){
        console.log("OK");
    }else{
        bootbox.alert("Es necesario completar el paso de Información General", function () {
            $state.go('Offerer.GeneralInformation');
        });
    }

    $scope.messageResponse = {message: '', class: 'alert alert-success alert-dismissable', icon: 'fa fa-check', type: 'OK!'};
    $scope.referenciasPersonales = [];
    $scope.causeRetirement2 = [];
    $scope.regExps = {
        msjRequired: 'DATO REQUERIDO.',
        //firstName: {exp: /^[a-zA-Z]{2,}(\s[a-zA-Z]{2,})?$/, message: 'Unicamente debe ingresar letras.'},
        firstName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        //middleName: {exp: /^([a-zA-Z]{2,})?([a-zA-Z]{1,}\s[a-zA-Z]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        middleName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        decimal: {exp: /^[1-9]+[0-9]*(.[0-9]+)?$/, message: 'El valor ingresado no coincide con 1234.56'},
        number: {exp: /^[1-9]+[0-9]*$/, message: 'El valor ingresado no coincide con 1234'},
        numberOnly: {exp: /^[0-9]+$/, message: 'El valor ingresado no coincide con 1234'},
        cui: {exp: /^[1-9]+[0-9]*([0-9]+)+$/, message: 'El valor ingresado no coincide con 1234'},
        phone: {exp: /^([0-9]+){8,}$/, message: 'El Numero debe tener mas de 7 digitos.'},
        date: {exp: /^(?:(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:0?[1-9]|1[0-2]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:31(\/|-)(?:0?[13578]|1[02]))|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(29(\/|-)0?2)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/, message: 'El Numero debe tener mas de 7 digitos.'}
    };
    $scope.referenciasLaborales = [];
    $scope.referenciasPersonalestmp = {fullName: '', phone: '', offererReferenceType: {id: 1}, id: 0};
    $scope.offererReference = [];

    $scope.savePreviousJobsAndReferences = function () {
        console.log('Guardando Cambios ... savePreviousJobsAndReferences');
        console.log($scope.currentUser.userAccount.person);
        $scope.PreviousJobsTemp = [];
        if (validarPreviousJobs()) {

            if ($scope.previousJob1) {
                if ($scope.previousJob1.company) {
                    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob1.startDate);
                    var fechaInicio = new Date(parseInt(fechaI[3], 10), parseInt(fechaI[2], 10) - 1, parseInt(fechaI[1], 10));
                    console.log(fechaInicio);
                    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob1.endDate);
                    var fechaFin = new Date(parseInt(fechaF[3], 10), parseInt(fechaF[2], 10) - 1, parseInt(fechaF[1], 10));
                    console.log(fechaFin);
                    var data = {causeRetirement: $scope.previousJob1.causeRetirement, chief: $scope.previousJob1.chief, company: $scope.previousJob1.company, endDate: fechaFin, job: $scope.previousJob1.job, phone: $scope.previousJob1.phone, salary: $scope.previousJob1.salary, startDate: fechaInicio, id: $scope.previousJob1.id};
                    $scope.PreviousJobsTemp.push(data);
                }
            }

            if ($scope.previousJob2) {
                if ($scope.previousJob2.company) {
                    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob2.startDate);
                    var fechaInicio = new Date(parseInt(fechaI[3], 10), parseInt(fechaI[2], 10) - 1, parseInt(fechaI[1], 10));
                    console.log(fechaInicio);
                    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob2.endDate);
                    var fechaFin = new Date(parseInt(fechaF[3], 10), parseInt(fechaF[2], 10) - 1, parseInt(fechaF[1], 10));
                    console.log(fechaFin);
                    var data = {causeRetirement: $scope.previousJob2.causeRetirement, chief: $scope.previousJob2.chief, company: $scope.previousJob2.company, endDate: fechaFin, job: $scope.previousJob2.job, phone: $scope.previousJob2.phone, salary: $scope.previousJob2.salary, startDate: fechaInicio, id: $scope.previousJob2.id};
                    $scope.PreviousJobsTemp.push(data);
                }
            }


            $scope.objectTemp = $scope.PreviousJobsTemp;
//        $scope.objectTemp.push($scope.personDataFieldTemp);
//        $scope.objectTemp.push($scope.personReligionTemp);
//        $scope.objectTemp.push($scope.personTypeTransportTemp);
            console.log($scope.objectTemp);
            if ($scope.currentUser.userAccount.person.offerer.id && $scope.objectTemp) {
                OffererService.update($scope.currentUser.userAccount.person.offerer.id + "/previousJobs", $scope.objectTemp)
                    .then(function (result) {
                        console.log(result);
                        if (result.status == '200' || result.status == '201') {
                            $scope.currentUser.userAccount.person.offerer.previousJobs = result.data;
                            UserService.setCurrentUser($scope.currentUser);
                            $scope.messageResponse.message = result.status + ' ' + result.statusText;
                            console.log($scope.messageResponse.message);
                            $state.go('Offerer.AdditionalInformation');
                            return true;
                        } else {
                            bootbox.alert(result.status + ' ' + result.statusText);
                            return false;
                        }
                    });
            } else {
                $state.go('Offerer.AdditionalInformation');
            }
            //$state.go('/CV/dashboard');
        } else {
            console.log("error");
            return false;
        }
    };

    function validarPreviousJobs() {
        var resp = true;
        var campos = ['company', 'phone', 'job', 'chief', 'salary', 'startDate', 'endDate', 'causeRetirement'];
        for (var x = 0; x < campos.length; x++) {
            if ($scope.previousJob1) {
                if (!$scope.previousJob1.id) {
                    $scope.previousJob1.id = 0;
                }

                if ($scope.previousJob1.company && $scope.previousJob1.company != '') {
                    if (!$scope.previousJob1[campos[x]] && $scope.previousJob1[campos[x]] != '') {
                        bootbox.alert("<h3>Ingrese " + campos[x] + "</h3>");
                        return false;
                        break;
                    }
                } else if ($scope.previousJob1[campos[x]] && $scope.previousJob1[campos[x]] != '') {
                    bootbox.alert("<h3>Complete los campos</h3>");
                    return false;
                    break;
                }
            }
            if ($scope.previousJob2) {
                if (!$scope.previousJob2.id) {
                    $scope.previousJob2.id = 0;
                }

                if ($scope.previousJob2.company && $scope.previousJob2.company != '') {
                    if (!$scope.previousJob2[campos[x]] && $scope.previousJob2[campos[x]] != '') {
                        bootbox.alert("<h3>Ingrese " + campos[x] + "</h3>");
                        return false;
                        break;
                    }
                } else if ($scope.previousJob2[campos[x]] && $scope.previousJob2[campos[x]] != '') {
                    bootbox.alert("<h3>Complete los campos</h3>");
                    return false;
                    break;
                }
            }
        }
        x
        console.log($scope.offererReference);
        if ($scope.offererReference) {
            if ($scope.offererReference.length < 3) {
                bootbox.alert("<h3>Ingrese por lo menos 3 Referencias</h3>");
                return false;
            }
        }
        return resp;
    }

    $scope.guardarReference = function () {
        if ($scope.referenciasPersonalestmp.fullName != '' && $scope.referenciasPersonalestmp.phone != '' && $scope.referenciasPersonalestmp.phone) {
            console.log($scope.referenciasPersonalestmp);
            console.log($scope.referenceSelected);
            OffererService.update($scope.currentUser.userAccount.person.offerer.id + "/offererReference", $scope.referenciasPersonalestmp)
                .then(function (result) {
                    console.log(result);
                    if (result.status == '200' || result.status == '201') {
                        if ($scope.referenceSelected > -1) {
                            $scope.offererReference[$scope.referenceSelected] = $scope.referenciasPersonalestmp;
                        } else {
                            for (var x = 0; x < $scope.offererReference.length; x++) {
                                if ($scope.offererReference[x].fullName == $scope.referenciasPersonalestmp.fullName && $scope.offererReference[x].phone == $scope.referenciasPersonalestmp.phone) {
                                    $scope.offererReference.splice(x, 1);
                                    break;
                                }
                            }

                            $scope.offererReference.push(result.data);
                            console.log($scope.offererReference);
                        }
                        $scope.referenciasPersonalestmp = {fullName: '', phone: '', offererReferenceType: {id: 1}, id: 0};
                        $scope.referenceSelected = -1;
                        $scope.currentUser.userAccount.person.offerer.offererReference = $scope.offererReference;
                        UserService.setCurrentUser($scope.currentUser);
                        $scope.messageResponse.message = result.status + ' ' + result.statusText;
                        console.log($scope.messageResponse.message);
//                        $state.go('Offerer.AboutTheWork');
                        return true;
                    } else {
                        bootbox.alert(result.status + ' ' + result.statusText);
                        return false;
                    }
                });
//            console.log($scope.currentUser.userAccount.person);
//            $scope.objectTemp=$scope.offererReference;
//            console.log($scope.objectTemp);
//
        }
    };
    $scope.editarRegistroReference = function (index) {
        console.log(index);
        $scope.referenceSelected = index;
        $scope.referenciasPersonalestmp = $scope.offererReference[index];
        var temp = {fullName: $scope.referenciasPersonalestmp.fullName, phone: $scope.referenciasPersonalestmp.phone, id: $scope.referenciasPersonalestmp.id, offererReferenceType: {id: 1}};
        $scope.referenciasPersonalestmp = temp;
    };
    $scope.removerRegistroReference = function (index) {

        OffererService.destroy($scope.offererReference[index].id + "/offererReference")
            .then(function (result) {
                console.log(result);
                if (result.status == '200' || result.status == '201') {
                    $scope.currentUser.userAccount.person.offerer.offererReference = $scope.offererReference;
                    UserService.setCurrentUser($scope.currentUser);
                    $scope.messageResponse.message = result.status + ' ' + result.statusText;
                    console.log($scope.messageResponse.message);
                    return true;
                } else {
                    bootbox.alert(result.status + ' ' + result.statusText);
                    return false;
                }
            });
        $scope.offererReference.splice(index, 1);
        $scope.referenceSelected = -1;
    };
    $scope.guardaReferencia = function () {
        $scope.referenciasPersonales.push($scope.referenciasPersonalestmp);
        console.log($scope.referenciasPersonalestmp.phone);
        $scope.referenciasPersonalestmp = '';
        console.log($scope.referenciasPersonales);
    };

    $scope.nextStep = function (nextStep) {
        console.log('nextStep ' + nextStep);
        if (nextStep == '3') {
            $state.go('Offerer.FamilyAndEducation');
        } else if (nextStep == '5') {
            $scope.savePreviousJobsAndReferences();
        }
    };

    function getOfferer() {
        console.log($scope.currentUser);
        if($scope.currentUser.userAccount.person.offerer){
            for (var z = 0; z < $scope.currentUser.userAccount.person.offerer.previousJobs.length; z++) {
                if (!$scope.currentUser.userAccount.person.offerer.previousJobs[1]) {
                    $scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate, 'dd/MM/yyyy');
                    $scope.currentUser.userAccount.person.offerer.previousJobs[0].endDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[0].endDate, 'dd/MM/yyyy');
                    $scope.previousJob1 = $scope.currentUser.userAccount.person.offerer.previousJobs[0];
                } else {
                    var todaypj = new Date($scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate).getTime();
                    console.log(todaypj);
                    var todayp = new Date($scope.currentUser.userAccount.person.offerer.previousJobs[1].startDate).getTime();
                    console.log(todayp);
                    if (todaypj < todayp) {
                        $scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate, 'dd/MM/yyyy');
                        $scope.currentUser.userAccount.person.offerer.previousJobs[0].endDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[0].endDate, 'dd/MM/yyyy');
                        $scope.previousJob2 = $scope.currentUser.userAccount.person.offerer.previousJobs[0];
                        $scope.currentUser.userAccount.person.offerer.previousJobs[1].startDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[1].startDate, 'dd/MM/yyyy');
                        $scope.currentUser.userAccount.person.offerer.previousJobs[1].endDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[1].endDate, 'dd/MM/yyyy');
                        $scope.previousJob1 = $scope.currentUser.userAccount.person.offerer.previousJobs[1];
                    } else {
                        $scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[0].startDate, 'dd/MM/yyyy');
                        $scope.currentUser.userAccount.person.offerer.previousJobs[0].endDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[0].endDate, 'dd/MM/yyyy');
                        $scope.previousJob1 = $scope.currentUser.userAccount.person.offerer.previousJobs[0];
                        $scope.currentUser.userAccount.person.offerer.previousJobs[1].startDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[1].startDate, 'dd/MM/yyyy');
                        $scope.currentUser.userAccount.person.offerer.previousJobs[1].endDate = $filter('date')($scope.currentUser.userAccount.person.offerer.previousJobs[1].endDate, 'dd/MM/yyyy');
                        $scope.previousJob2 = $scope.currentUser.userAccount.person.offerer.previousJobs[1];
                    }
                }


            }
        }

        if($scope.currentUser.userAccount.person.offerer){
            for (var z = 0; z < $scope.currentUser.userAccount.person.offerer.offererReference.length; z++) {
                if ($scope.currentUser.userAccount.person.offerer.offererReference[z].offererReferenceType.id == 1)
                    $scope.offererReference = $scope.currentUser.userAccount.person.offerer.offererReference;
            }
        }

    }

    getOfferer();
}]);
RRHH.controller("AdditionalInformationController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService','$translatePartialLoader','$translate', function ($scope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService,$translatePartialLoader,$translate) {
    $scope.currentUser = UserService.getCurrentUser();
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    if($scope.currentUser && $scope.currentUser.userAccount && $scope.currentUser.userAccount.person && $scope.currentUser.userAccount.person.id){
        console.log("OK");
    }else{
        bootbox.alert("Es necesario completar el paso de Información General", function () {
            $state.go('Offerer.GeneralInformation');
        });
    }
    $scope.messageResponse = {message: '', class: 'alert alert-success alert-dismissable', icon: 'fa fa-check', type: 'OK!'};
    $scope.ReligionAll = [];
    $scope.allFieldDataType = [];
    $scope.Salud = {};
    $scope.Salud.height = [];
    $scope.Salud.Weight = [];
    $scope.Economia = [];
    $scope.TypeTransport = false;
    $scope.Economia.typeTransportC = false;
    $scope.Economia.typeTransportM = false;
    $scope.Economia.typeTransportTP = false;
    $scope.adicional = [];
    $scope.adicional.religion = {id:null};


    $scope.getAllReligion = function () {
        GenericService.allReligion()
            .then(function (result) {
                $scope.ReligionAll = result.data;
            });
    };
    $scope.economiaTypeTransPort = function () {
        if ($scope.Economia.typeTransportTP || $scope.Economia.typeTransportM || $scope.Economia.typeTransportC) {
            $scope.TypeTransport = true;
        } else {
            $scope.TypeTransport = false;
        }
    };

    $scope.saveAdditionalInformation = function () {
        console.log('Guardando Cambios ... saveAdditionalInformation');
        console.log($scope.currentUser.userAccount.person);
        $scope.personDataFieldTemp = [];
        $scope.personReligionTemp = [];
        if ($scope.currentUser.userAccount.person.personDataField.length > 0) {
            $scope.personDataFieldTemp = $scope.currentUser.userAccount.person.personDataField;
            for (var z = 0; z < $scope.currentUser.userAccount.person.personDataField.length; z++) {
                for (var y = 0; y < $scope.allFieldDataType.length; y++) {
                    if ($scope.allFieldDataType[y].id == $scope.currentUser.userAccount.person.personDataField[z].fieldDataType.id) {
                        $scope.personDataFieldTemp[z].value = $scope.Salud[$scope.allFieldDataType[y].name];
                    }
                }
            }
        } else {
            for (var y = 0; y < $scope.allFieldDataType.length; y++) {
                if ($scope.currentUser.userAccount.person.gender == 'M') {
                    value: $scope.Salud.pregnant = 'N';
                }
                var a = {value: $scope.Salud[$scope.allFieldDataType[y].name], fieldDataType: {id: $scope.allFieldDataType[y].id, name: $scope.allFieldDataType[y].name}};
                console.log(a);
                $scope.personDataFieldTemp.push(a);
                console.log($scope.personDataFieldTemp);
            }
        }
        console.log('$scope.personDataFieldTemp');
        console.log($scope.personDataFieldTemp);
        $scope.personReligionTemp = {id: $scope.adicional.religion.id};
        console.log($scope.personReligionTemp);
        $scope.personTypeTransportTemp = [];

        if ($scope.Economia.typeTransportC) {
            var d = {typeTransport: 'C'};
            $scope.personTypeTransportTemp.push(d);
        }
        if ($scope.Economia.typeTransportM) {
            var d = {typeTransport: 'M'};
            $scope.personTypeTransportTemp.push(d);
        }
        if ($scope.Economia.typeTransportTP) {
            var d = {typeTransport: 'TP'};
            $scope.personTypeTransportTemp.push(d);
        }
        if ($scope.Economia.typeTransportC || $scope.Economia.typeTransportM || $scope.Economia.typeTransportTP) {
            $scope.TypeTransport = true;
        }
        console.log('$scope.personTypeTransportTemp');
        console.log($scope.personTypeTransportTemp);

        $scope.objectTemp = {personDataField: $scope.personDataFieldTemp, religion: $scope.personReligionTemp, personTypeTransport: $scope.personTypeTransportTemp};
        console.log($scope.objectTemp);
        if ($scope.currentUser.userAccount.person.id) {
            PersonService.update($scope.currentUser.userAccount.person.id + "/personDataField", $scope.objectTemp)
                .then(function (result) {
                    console.log(result);
                    if (result.status == '200' || result.status == '201') {
                        $scope.currentUser.userAccount.person.personDataField = result.data.personDataField;
                        $scope.currentUser.userAccount.person.personTypeTransport = result.data.personTypeTransport;
                        $scope.currentUser.userAccount.person.religion = result.data.religion;
                        $scope.currentUser.userAccount.person.offerer.offererStatus = {id: 2};
                        UserService.setCurrentUser($scope.currentUser);
                        $scope.messageResponse.message = result.status + ' ' + result.statusText;
                        console.log($scope.messageResponse.message);
                        $state.go('Offerer.Dashboard');
                        return true;
                    } else {
                        bootbox.alert(result.status + ' ' + result.statusText);
                        return false;
                    }
                });
        }
        //$state.go('/CV/dashboard');
    };

    function getOfferer() {
        for (var z = 0; z < $scope.currentUser.userAccount.person.personDataField.length; z++) {
            if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'Weight') {
                $scope.Salud.Weight = $scope.currentUser.userAccount.person.personDataField[z].value;
            } else if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'Height') {
                $scope.Salud.Height = $scope.currentUser.userAccount.person.personDataField[z].value;
            } else if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'medicalCondition') {
                $scope.Salud.medicalCondition = $scope.currentUser.userAccount.person.personDataField[z].value;
            } else if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'consumeMedicament') {
                $scope.Salud.consumeMedicament = $scope.currentUser.userAccount.person.personDataField[z].value;
            } else if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'surgicalOperation') {
                $scope.Salud.surgicalOperation = $scope.currentUser.userAccount.person.personDataField[z].value;
            } else if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'familyArrested') {
                $scope.Salud.familyArrested = $scope.currentUser.userAccount.person.personDataField[z].value;
            } else if ($scope.currentUser.userAccount.person.personDataField[z].fieldDataType.name == 'pregnant') {
                $scope.Salud.pregnant = $scope.currentUser.userAccount.person.personDataField[z].value;
            }
        }

        if ($scope.currentUser.userAccount.person.personTypeTransport.length > 0) {
            for (var x = 0; x < $scope.currentUser.userAccount.person.personTypeTransport.length; x++) {
                if ($scope.currentUser.userAccount.person.personTypeTransport[x].typeTransport == 'TP') {
                    $scope.Economia.typeTransportTP = true;
                } else if ($scope.currentUser.userAccount.person.personTypeTransport[x].typeTransport == 'M') {
                    $scope.Economia.typeTransportM = true;
                } else if ($scope.currentUser.userAccount.person.personTypeTransport[x].typeTransport == 'C') {
                    $scope.Economia.typeTransportC = true;
                }
                if ($scope.Economia.typeTransportTP || $scope.Economia.typeTransportM || $scope.Economia.typeTransportC) {
                    $scope.TypeTransport = true;
                } else {
                    $scope.TypeTransport = false;
                }
            }
        }

        if ($scope.currentUser.userAccount.person.religion) {
            $scope.adicional.religion.id = $scope.currentUser.userAccount.person.religion.id;
        }
        ;

        GenericService.allFieldDataType()
            .then(function (result) {
                $scope.allFieldDataType = result.data;
                console.log($scope.allFieldDataType);
            });

        $scope.getAllReligion();
    }

    $scope.nextStep = function (nextStep) {
        console.log('nextStep ' + nextStep);
        if (nextStep == '4') {
            $state.go('Offerer.PreviousJobsAndReferences');
        } else if (nextStep == '6') {
            if (!$scope.Salud.Height || !$scope.Salud.Weight || !$scope.adicional.religion || !$scope.Salud.familyArrested || !$scope.TypeTransport) {
                bootbox.alert("<h3>ERROR: Por favor complete los datos</h3>");
            } else {
                $scope.saveAdditionalInformation();
            }


        }
    };

    getOfferer();
}]);

RRHH.controller("ReportOffererController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService', function ($scope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService) {
    $scope.currentUser = UserService.getCurrentUser();
    $scope.messageResponse = {message: '', class: 'alert alert-success alert-dismissable', icon: 'fa fa-check', type: 'OK!'};
    $scope.ReligionAll = [];
    $scope.allFieldDataType = [];
    $scope.Salud = {};
    $scope.Salud.height = [];
    $scope.Salud.Weight = [];
    $scope.Economia = [];
    $scope.TypeTransport = false;
    $scope.Economia.typeTransportC = false;
    $scope.Economia.typeTransportM = false;
    $scope.Economia.typeTransportTP = false;
    $scope.adicional = [];
    $scope.adicional.religion = [];
    $scope.report = [];


    function getOfferer() {
        $scope.report.print = OffererService.url($scope.currentUser.userAccount.person.id + "/reportOfferer");
//        OffererService.fetch($scope.currentUser.userAccount.person.id+"/reportOfferer")
//            .then(function (result) {
//                $scope.report.print=result.data;
//                UserService.setCurrentUser($scope.currentUser);
//                $scope.messageResponse.message = result.status + ' ' + result.statusText;
//            });
    }

    $scope.nextStep = function (nextStep) {
        console.log('nextStep ' + nextStep);
        if (nextStep == '5') {
            $state.go('Offerer.AdditionalInformation');
        }
    };

    getOfferer();
}]);

RRHH.controller("ReportController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService', function ($scope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService) {
    $scope.report = [];
    $scope.getReport=function(url,paginas,filename,params) {
        //var param="{'offererId':'"+params+"'}";
        $scope.report.print = OffererService.url($scope.person.offerer.id + "/getReport?urlReport="+url+"&paginas="+paginas+"&filename="+filename+"&params="+params);
    }

    $scope.getReportModal=function(url,paginas,filename,modal,title,params) {
        $scope.report.print = OffererService.url($scope.person.offerer.id + "/getReport?urlReport="+url+"&paginas="+paginas+"&filename="+filename);
        if(modal) {
            bootbox.dialog({
                message: "<object type=\"application/pdf\" data=\"" + $scope.report.print + "\" style=\"width:100%;height:500px\"></object>",
                title: title
            }).find("div.modal-dialog").addClass("largeWidth");
        }
    }


}]);

// Controller for New User View
RRHH.controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'LoginService', 'UserService', '$window', 'Token', 'GenericService', 'ConstanteService','LangService','$translatePartialLoader','$translate', function ($rootScope, $scope, $state, LoginService, UserService, $window, Token, GenericService, ConstanteService,LangService,$translatePartialLoader,$translate) {
    var login = this;
    $rootScope.isLogged = false;
    if(UserService.getCurrentUser()!=null){
        $rootScope.isLogged = true;
    }

    //this.cancel = $scope.$dismiss;
    $translatePartialLoader.addPart('login');
    $translate.refresh();
    $scope.langs=[];
    login.updateLang=function(){
        $scope.langs.push(login.pais);
        if(login.pais=="es-GT"){
            $scope.langs.push("en-GT");
            $rootScope.ocultarCamposHonduras = false;
        }else if(login.pais=="en-GT") {
            $scope.langs.push("es-GT");
            $rootScope.ocultarCamposHonduras = false;
        }else if(login.pais=="es-HN") {
            $scope.langs.push("en-HN");
            $rootScope.ocultarCamposHonduras = true;
        }else if(login.pais=="en-HN"){
            $scope.langs.push("es-HN");
            $rootScope.ocultarCamposHonduras = true;
        }
        LangService.setLangs($scope.langs);
        LangService.setLangUser(login.pais);
        $translate.use(login.pais);
        $translate.refresh();
    };
    login.pais=null;
    $rootScope.accessToken = Token.get();
    console.log($rootScope.accessToken);
    login.authenticate = function (provider) {
        console.log(provider);
        Token.setProvider(provider);
        var extraParams = $scope.askApproval ? {approval_prompt: 'force'} : {};
        console.log(extraParams);
        Token.getTokenByPopup(extraParams)
            .then(function (params) {
                console.log(params);
                Token.verifyAsync(params.access_token).
                    then(function (data) {
                        console.log(data);
                        if (provider == 'linkedin') {
                            params.access_token=data.access_token;
                            params.expires_in=data.expires_in;
                            data.token=params.access_token;
                        }
                        UserService.setProvider(provider);
                        Token.set(params.access_token);
                        UserService.setCurrentUser(data);
                        $rootScope.$apply(function () {
                            $scope.accessToken = params.access_token;
                            $scope.expiresIn = params.expires_in;
                            GenericService.AuthUserInfo($scope.accessToken, provider, '')
                                .then(function (result) {
                                    console.log(result.data);
                                    if (provider == 'linkedin') {
                                        var email=result.data.emailAddress;
                                        result.data.email=email;
                                        result.data.name=result.data.firstName+' '+result.data.lastName;
                                        if(result.data.pictureUrl){
                                            result.data.picture=result.data.pictureUrl;
                                        }
                                    }else if(provider == 'facebook'){
                                        result.data.picture='https://graph.facebook.com/'+result.data.id+'/picture?type=large';
                                    }
                                    var user = {username: result.data.email, password: '', token: params.access_token};
                                    signIn(user);
                                    UserService.setCurrentUserInfo(result.data);
                                    $rootScope.googleUserInfo = UserService.getCurrentUserInfo();
                                });
                        });
                    }, function () {
                        alert("Failed to verify token.");
                    });
            }, function () {
                alert("Failed to get token from popup.");
            });
    };
    //login.user={username:'',password:'',token:null,id:null};
    function signIn(user) {
        console.log("user: *****");
        console.log(user);
        //alert(user);
        LoginService.login(user)
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
                    $state.go('RRHH.Dashboard');
                } else {
                    logout();
                }
            });
    }

    function register(user) {
        LoginService.register(user)
            .then(function (response) {
                login(user);
            });
    }

    function logout() {
        LoginService.logout()
            .then(function (response) {
                var provider=UserService.getProvider();
                if(provider=='google'){
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
    login.aceptar = false;

}]);

RRHH.controller("MailBoxController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'UserAccountService', 'ConstanteService','$translatePartialLoader','$translate', function ($scope, OffererService, PersonService, GenericService, $state, $filter, UserService, UserAccountService, ConstanteService,$translatePartialLoader,$translate) {
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    $scope.inbox = [];
    $scope.urlServerFiles = ConstanteService.urlServerFiles;
    function getInbox(status) {
        GenericService.getByURL("Inbox/byStatus/" + status)
            .then(function (response) {
                console.log(response);
                $scope.inbox = response.data;
            });
    }

    $scope.getInbox = getInbox;
    $scope.getInbox("E");

}]);

RRHH.controller("OffererAllController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'UserAccountService', 'ConstanteService','$modal','$translatePartialLoader','$translate','JobInterviewService','bootbox', function ($scope,  OffererService, PersonService, GenericService, $state, $filter, UserService, UserAccountService, ConstanteService,$modal,$translatePartialLoader,$translate,JobInterviewService,bootbox) {
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;

    $scope.selectAllCheck=false;
    $scope.offererId=0;
    $scope.offerers=[];
    $scope.fullAddress='';
    $scope.offerersSelected=[];
    $scope.interviews=[];
    $scope.interviewers=[];
    $scope.evnts=[];
    $scope.currentUser = UserService.getCurrentUser();
    $scope.urlServerFiles = ConstanteService.urlServerFiles;
    $scope.checked = false;
    $scope.offererName="";
    $scope.rangoEdad="";
    $scope.maritalStatus="";
    $scope.gender="";

    $scope.toggle = function(){
        $scope.checked = !$scope.checked
        if($scope.checked){
            getStudiesLevels();
            getLocationByEmployee();
        }
    };
    $scope.typeSearch=0;
    $scope.dataTable={};
    $scope.page=1;
    $scope.pageSize=50;
    $scope.movePage=function(value){
        if(value=='+'){
            if($scope.page<=$scope.dataTable.totalPages){
                $scope.page++;
                $scope.searchFull($scope.typeSearch)
            }
        }else{
            if($scope.page>0){
                $scope.page--;
                $scope.searchFull($scope.typeSearch)
            }
        }
    }
    /*
    function getOffererByStatus(status) {
        GenericService.getByURL("Offerer/OffererByStatus3/" + status+"?locationid=0&levelId="+$scope.levelStudiesId+"&page="+$scope.page+"&pageSize="+$scope.pageSize)
            .then(function (response) {
                console.log(response);
                $scope.offerers = response.data;
                for (var a in $scope.offerers){
                    $scope.offerers[a].button='Programar Entrevista';
                    if(!$scope.offerers[a].codigooferentevh || $scope.offerers[a].codigooferentevh==null){
                        $scope.offerers[a].buttonTraslate='Trasladar a Visual Hur';
                    }
                }
            });
        $scope.showCalendar=false;
    };*/


    $scope.levelStudiesGrade="";
    $scope.levelStudiesId=0;
    $scope.studiesLevels=[];
    $scope.studiesLevelsGrade=[];
    $scope.locationAll=[];
    $scope.locationid=0;

    function getStudiesLevels() {
        console.log($scope.currentUser);
        if($scope.studiesLevels.length==0){
            GenericService.getByURL("StudiesLevel/")
                .then(function (response) {
                    console.log(response);
                    $scope.studiesLevels=response.data;
                });
        }
    };

    $scope.getStudiesLevelsGrades=function() {
        console.log($scope.currentUser);
        //if($scope.studiesLevelsGrade.length==0){
            GenericService.getByURL("StudiesLevelGrade/byUserAccount/1?levelId="+$scope.levelStudiesId)
                .then(function (response) {
                    console.log(response);
                    $scope.studiesLevelsGrade=response.data;
                });
        //}
    };

    function getLocationByEmployee() {
        GenericService.getByURL("Location/byEmployee")
            .then(function (response) {
                console.log(response);
                $scope.locationAll=response.data;
            });
    };
    /*
    function getInterviewers() {
        GenericService.getByURL("Employee/employees")
            .then(function (response) {
                console.log(response);
                $scope.interviewers=response.data;
            });
    };*/

    $scope.addOffererSelected = function (offerer) {
        $scope.offererCheck=offerer;
        offerer=[];
        if($scope.offererCheck.active){
            $scope.offererCheck.active=false;
        }else{
            $scope.offererCheck.active=true;
        }
//        console.log($scope.offererCheck.active);
//        console.log(offerer.index);
//        console.log($scope.offerers);
    };

    $scope.selectAllChecks = function(){
        if(!$scope.selectAllCheck){
            $scope.selectAllCheck= true;
            for (var a in $scope.offerers){
                $scope.offerers[a].active=false;
            }
//            $scope.offerersSelected=$scope.offerers;
        }else{
            $scope.selectAllCheck= false;
            for (var a in $scope.offerers){
                $scope.offerers[a].active=true;
            }
            $scope.offerersSelected=[];
        }
    };

    $scope.searchFull=function(type){
        $scope.typeSearch=type;
        console.log(type);
        var params="";

        if(type==0){ //Single
            params+="?offererName="+$scope.offererName;
            GenericService.getByURL("Offerer/OffererByStatus3/" + 1 +params)
                .then(function (response) {
                    console.log(response);
                    $scope.offerers = response.data;
                    $scope.checked = false;
                });
        }else{ //Full
            $scope.rangoEdad=$('#rangoEdad').val();
            var name="";//$scope.name1+" "+$scope.name2+" "+$scope.name3+" "+$scope.name4;
            name+=$scope.name1?$scope.name1:"";
            name+=$scope.name2?" "+$scope.name2:"";
            name+=$scope.name3?" "+$scope.name3:"";
            name+=$scope.name4?" "+$scope.name4:"";
            params+="?offererid="+$scope.offererId+"&offererName="+name+"&gender="+$scope.gender+"&maritalStatus="+$scope.maritalStatus+"&edad="+$scope.rangoEdad+"&levelStudies="+$scope.levelStudiesGrade+"&locationid="+$scope.locationid+"&levelId="+$scope.levelStudiesId+"&page="+$scope.page+"&pageSize="+$scope.pageSize;
            GenericService.getByURL("Offerer/OffererByStatus3/" + 1+params)
                .then(function (response) {
                    console.log(response);
                    $scope.offerers = response.data;
                    $scope.checked = false;
                });
        }
    };

    $scope.programarEntrevista = function(objData){
        objData.personalRequisition=0;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'programInterview.html',
            controller: 'ProgramInterviewCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                objData: function () {
                    return objData;
                }
            }
        });
        modalInstance.result.then(function (objData) {
            $scope.objData = objData;
            console.log(angular.toJson($scope.objData));
                var ok = $filter('filter')($scope.offerers, {id: objData.statusid}, true);
                var index = $scope.offerers.indexOf(ok[0]);
                $scope.offerers.splice(index,1);

//            GenericService.postByURL("JobInterview/Questions/" + $scope.InterviewData.OffererJobInterview.id, $scope.InterviewData.OffererJobInterview)
//                .then(function (response) {
//                    console.log(response.data);
//                    $scope.refetchEvents();
//                });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });


        if(1==1){
            return false;
        }

    };



    function showModalReview(offerer) {
        $scope.OffererResult=offerer;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContentReview.html',
            controller: 'ReviewsInstanceCtrl',
            size: 'xl',
            backdrop: 'static',
            resolve: {
                OffererResult: function () {
                    return $scope.OffererResult;
                }
            }
        });
        modalInstance.result.then(function (OffererResult) {
            $scope.OffererResult = OffererResult;
            //getOfferer($scope.OffererResult.id);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    $scope.showModalReview=showModalReview;

    $scope.createCalendar= function (){

        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            buttonText: {//This is to add icons to the visible buttons
                prev: "<span class='fa fa-caret-left'></span>",
                next: "<span class='fa fa-caret-right'></span>",
                today: 'today',
                month: 'month',
                week: 'week',
                day: 'day'
            },
            //Random default events
            events: $scope.evnts,
            editable: true,

            // remove event
            eventClick: function (calEvent, jsEvent, view) {
                console.log(calEvent);
                $('#calendar').fullCalendar('removeEvents', calEvent._id);
            },
            today:true,
            // select day calendar
            selectable: true,
            select: function(start, end, allDay) {
                console.log(start);
                console.log(end);
                console.log(allDay);
                var t=$scope.evnts.length+1;
                var evnt={
                    _id:'_fc'+t,
                    title: $scope.offerersSelected[0].fullName,
                    start: start,
                    end: end,
                    allDay:true,
                    backgroundColor: "#3c8dbc", //Primary (light-blue)
                    borderColor: "#3c8dbc" //Primary (light-blue)
                };
                $scope.evnts.push(evnt);
                console.log($scope.evnts);
                //$('#calendar').fullCalendar('refresh', true);
//                $('#calendar').fullCalendar( 'addEvent', evnt );
            }
        });
//        $('#calendar').fullCalendar( 'today' );
    };

//    function refreshCalendar(){
//        $('#calendar').fullCalendar( 'today' );
//    }

    //$scope.refreshCalendar=refreshCalendar;

    //$scope.getOffererByStatus=getOffererByStatus;
    $scope.searchFull(0);


    $scope.items = ['item1', 'item2', 'item3'];
    $scope.animationsEnabled = true;

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

}]);

RRHH.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

RRHH.controller('CompanyController', ['$scope','$translatePartialLoader','$translate', function ($scope,$translatePartialLoader,$translate) {
    //$translatePartialLoader.addPart('General');
    //$translate.refresh();
    $scope.index = 10;
    $scope.Message = "";
    $scope.permitirCrearCompany = false;
    $scope.crearEmpresa = function () {
        console.log($scope.permitirCrearCompany);
        $scope.permitirCrearCompany = !$scope.permitirCrearCompany;
    };

    var options = {};

    var items = [
        new primitives.orgdiagram.ItemConfig({
            id: 0,
            parent: null,
            title: "Moviendo Personas de Recursos Humanos",
            description: "Empresa",
            phone: "1 (416) 001-4567",
            email: "scott.aasrud@mail.com",
            image: "https://www.megapaca.gt/lookandfeel/img/logo/mprh.jpg",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.RoyalBlue
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 1,
            parent: 0,
            title: "La Megapaca, S.A.",
            description: "Empresa",
            phone: "1 (416) 002-4567",
            email: "ted.lucas@mail.com",
            image: "https://www.megapaca.gt/lookandfeel/img/logo/megapaca.jpg",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.Darkorange
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 2,
            parent: 0,
            title: "IMPASA",
            description: "Empresa",
            phone: "1 (416) 003-4567",
            email: "joao.stuger@mail.com",
            image: "demo/images/photos/c.png",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.Chocolate
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 3,
            parent: 0,
            title: "APICASA",
            description: "Empresa",
            phone: "1 (416) 003-4567",
            email: "joao.stuger@mail.com",
            image: "demo/images/photos/c.png",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.Black
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 4,
            parent: 0,
            title: "MegaCom",
            description: "Empresa",
            phone: "1 (416) 003-4567",
            email: "joao.stuger@mail.com",
            image: "demo/images/photos/c.png",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.RoyalBlue
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 5,
            parent: 0,
            title: "Blue & Blouze",
            description: "Empresa",
            phone: "1 (416) 003-4567",
            email: "joao.stuger@mail.com",
            image: "demo/images/photos/c.png",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.RoyalBlue
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 6,
            parent: 0,
            title: "MaryPaz",
            description: "Empresa",
            phone: "1 (416) 003-4567",
            email: "joao.stuger@mail.com",
            image: "demo/images/photos/c.png",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.RoyalBlue
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 7,
            parent: 0,
            title: "La Paca",
            description: "Empresa",
            phone: "1 (416) 003-4567",
            email: "joao.stuger@mail.com",
            image: "https://www.megapaca.gt/lookandfeel/img/logo/megapaca.jpg",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.DarkGreen
        }),
        new primitives.orgdiagram.ItemConfig({
            id: 8,
            parent: 0,
            title: "MPRH",
            description: "Empresa",
            phone: "1 (416) 001-4567",
            email: "scott.aasrud@mail.com",
            image: "https://www.megapaca.gt/lookandfeel/img/logo/mprh.jpg",
            ubicaciones: 0, empleadosActivos: 100, plazasVacantes: 5,
            itemTitleColor: primitives.common.Colors.RoyalBlue
        }),
    ];

    options.items = items;
    options.cursorItem = 0;
    options.highlightItem = 0;
    //options.hasSelectorCheckbox = primitives.common.Enabled.True;
    options.templates = [getContactTemplate()];
    options.defaultTemplateName = "contactTemplate";

    $scope.myOptions = options;

    $scope.setCursorItem = function (item) {
        $scope.myOptions.cursorItem = item;
    };

    $scope.setHighlightItem = function (item) {
        $scope.myOptions.highlightItem = item;
    };

    $scope.deleteItem = function (index) {
        $scope.myOptions.items.splice(index, 1);
    }

    $scope.addItem = function (index, parent) {
        var id = $scope.index++;
        $scope.myOptions.items.splice(index, 0, new primitives.orgdiagram.ItemConfig({
            id: id,
            parent: parent,
            title: "New title " + id,
            description: "New description " + id,
            image: "demo/images/photos/b.png"
        }));
    }

    $scope.onMyCursorChanged = function () {
        $scope.Message = "onMyCursorChanged";
    }

    $scope.onMyHighlightChanged = function () {
        $scope.Message = "onMyHighlightChanged";
    }

    function getContactTemplate() {
        var result = new primitives.orgdiagram.TemplateConfig();
        result.name = "contactTemplate";

        result.itemSize = new primitives.common.Size(220, 120);
        result.minimizedItemSize = new primitives.common.Size(5, 5);
        result.minimizedItemCornerRadius = 5;
        result.highlightPadding = new primitives.common.Thickness(2, 2, 2, 2);


        var itemTemplate = jQuery(
                '<div class="bp-item bp-corner-all bt-item-frame">'
                + '<div name="titleBackground" class="bp-item bp-corner-all bp-title-frame" style="background:{{itemConfig.itemTitleColor}};top: 2px; left: 2px; width: 216px; height: 20px;">'
                + '<div name="title" class="bp-item bp-title" style="top: 3px; left: 6px; width: 208px; height: 18px;">{{itemConfig.title}}</div>'
                + '</div>'
                + '<div class="bp-item bp-photo-frame" style="top: 26px; left: 2px; width: 60px; height: 35px;">'
                + '<img name="photo" src="{{itemConfig.image}}" style="height: 35px; width:60px;" />'
                + '</div>'
                + '<div class="bp-item" style="top: 26px; left: 45px; width: 162px; height: 18px; font-size: 12px;">Ubicaciones {{itemConfig.ubicaciones}}</div>'
                + '<div class="bp-item" style="top: 44px; left: 45px; width: 162px; height: 18px; font-size: 12px;">Empleados Activos {{itemConfig.empleadosActivos}}</div>'
                + '<div class="bp-item" style="top: 62px; left: 45px; width: 162px; height: 36px; font-size: 10px;">{{itemConfig.description}}</div>'
                + '</div>'
        ).css({
                width: result.itemSize.width + "px",
                height: result.itemSize.height + "px"
            }).addClass("bp-item bp-corner-all bt-item-frame");
        result.itemTemplate = itemTemplate.wrap('<div>').parent().html();

        return result;
    }

}]);

RRHH.controller('ProgramInterviewCtrl',['$scope','$modalInstance','objData','$translatePartialLoader','$translate','GenericService','JobInterviewService','$state', function ($scope, $modalInstance, objData,$translatePartialLoader,$translate,GenericService,JobInterviewService,$state) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();
    console.log(objData);
    $scope.interviewers=[];
    $scope.vacantPosition=[];
    $scope.objData=objData;
    $scope.objData.dateinterview=null;
    $scope.objData.interviewerid=null;
    $scope.objData.vacantPosition=null;
    $scope.personalRequisitions=[];

//    $scope.InterviewQuestions = InterviewData.questions;
//    $scope.Offerer = InterviewData.Offerer;
//    $scope.OffererJobInterview = InterviewData.OffererJobInterview;
//    $scope.finalizado = InterviewData.finalizado;
    //if(!$scope.OffererJobInterview.startDate){
//    $scope.OffererJobInterview.startDate = new Date();
    //}
    /*
     $scope.selected = {
     InterviewQuestions: $scope.InterviewQuestions[0]
     };*/

    function getInterviewers() {
        GenericService.getByURL("Employee/employees")
            .then(function (response) {
                console.log(response);
                $scope.interviewers=response.data;
            });
    };

    function getPersonalRequisitions() {
        GenericService.getByURL("PersonalRequisition")
            .then(function (response) {
                console.log(response);
                $scope.personalRequisitions=response.data;
            });
    };

    getPersonalRequisitions();

    getInterviewers();
    //getVacantPosition();

    $scope.outputs = {};
    $scope.getData = function () {
            console.log($scope.objData);
        if($scope.objData.dateinterview==null || $scope.objData.dateinterview==""){
            bootbox.alert("Por favor seleccione un entrevistador", function(){
                return false;
            });
        }else if($scope.objData.interviewerid==null || $scope.objData.interviewerid==""){
            bootbox.alert("Por favor seleccione una Fecha", function(){
                return false;
            });
        }else if($scope.objData.personalRequisition==null || $scope.objData.personalRequisition==""){
            bootbox.alert("Por favor seleccione una Requisicion de Personal", function(){
                return false;
            });
        }

//            console.log(obj);
            $scope.intervieWerTemp={date:new Date($scope.objData.dateinterview), interviewer: {id:parseInt($scope.objData.interviewerid)}, offerer:{id:$scope.objData.offererid}, observation:$scope.objData.vacantPosition,personalRequisition:{id:$scope.objData.personalRequisition}};
            console.log($scope.intervieWerTemp);
            JobInterviewService.create($scope.intervieWerTemp)
                .then(function (result) {
                    console.log(result);
                    if (result.status == '200' || result.status == '201') {
                        $modalInstance.close($scope.objData);
                        bootbox.alert("<h4>Entrevista programada para:</h4>" +
                                "<div class='form-group'><b>Oferente:</b><input type='text' class='form-control' value='"+$scope.objData.fullName.replace(/,/g,' ').replace(';',' ')+"' readonly></div>" +
                                "<div class='form-group'><b>Fecha:</b><input type='text' class='form-control' value='"+new Date($scope.objData.dateinterview).toLocaleString()+"' readonly></div>" +
                                "<div class='form-group'><b>Entrevistador:</b><input type='text' class='form-control' value='"+result.data.interviewer.fullName.replace(/,/g,' ').replace(';',' ')+"' readonly></div>" +
                                "");
                        return true;
                    } else {
                        bootbox.alert(result.status + ' ' + result.statusText);
                        return false;
                    }
                });
            //$scope.OffererJobInterview.endDate = new Date();
           // InterviewData.OffererJobInterview = $scope.OffererJobInterview;
            //alert('Se esta enviando las respuetas.');

    };
    /*
     $scope.ok = function () {
     $modalInstance.close($scope.selected.InterviewQuestions);
     };*/

    $scope.cancel = function () {
        $scope.objData.dateinterview=null;
        $modalInstance.dismiss('cancel');
    };
}]);



