/**
 * Created by wramirez on 24/10/2015.
 */
ACS.controller('ResidentController', ['$scope', 'ConstanteService','GenericServiceSinc','DTOptionsBuilder', 'DTColumnBuilder', function ($scope,ConstanteService,GenericServiceSinc,DTOptionsBuilder, DTColumnBuilder) {
    //$scope.urlServerFiles=ConstanteService.urlServerFiles;
    var resident = this;
    resident.residents=[];

    GenericServiceSinc.getByURL("resident/").then(function(data){
        console.log(data);
        resident.residents=data;
    });

    resident.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withButtons([
            'columnsToggle',
            'colvis',
            'copy',
            'print',
            'excel',
            {
                text: 'Some button',
                key: '1',
                action: function (e, dt, node, config) {
                    alert('Button activated');
                }
            }
        ]);

    resident.dtColumnDefs = [
        DTColumnBuilder.newColumn(0),
        DTColumnBuilder.newColumn(1),
        DTColumnBuilder.newColumn(2),
        DTColumnBuilder.newColumn(3)
    ];

}]);

ACS.controller('SecureTokenController', ['$scope', 'GenericServiceSinc','GenericService', function ($scope,GenericServiceSinc,GenericService) {
    $scope.sectors=[];
    $scope.sector={};
    $scope.residences=[];
    $scope.residence={};
    $scope.SecureRegisterToken={partner:{},sector:{},residence:{},token:''};
    $scope.SecureRegisterTokenNew={};
    $scope.imprimir=false;
    GenericServiceSinc.getByURL("sector/").then(function(data){
        console.log(data);
        $scope.sectors=data;
    });

    $scope.generarToken=function(){
        $scope.SecureRegisterToken={partner:{id:$scope.sector.partner.id},sector:{id:$scope.sector.id},residence:{id:$scope.residence.id}};
        //$scope.SecureRegisterToken={"dateCreated":null,    "active":true,    "partner":{"id":1},    "sector":{"id":1},    "residence":{"id":1},    "token":"123456789",    "endDate":null,    "person":null,    "id":null};
        //$scope.SecureRegisterToken={dateCreated:null,    active:true,     token:"123456789",    endDate:null,    id:null,sector:{id:1},residence:{id:1},partner:{id:1}};
        console.log($scope.SecureRegisterToken);
        GenericService.postByURL("secureRegisterToken",$scope.SecureRegisterToken).then(function(result){
            console.log(result);
            $scope.SecureRegisterTokenNew=result.data;
            window.print();
        });
    }

    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        //var originalContents = document.body.innerHTML;

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=500,height=500,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="style.css" />' +
                '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    }

}]);