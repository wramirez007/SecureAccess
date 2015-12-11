/**
 * Created by wramirez on 23/05/2015.
 */
RRHH.controller("InterviewsController", ['$rootScope', '$scope', 'ConstanteService', 'GenericService', 'UserService', 'uiCalendarConfig', '$modal', 'bootbox', '$filter', '$translatePartialLoader', '$translate', 'JobInterviewService','OffererService', function ($rootScope, $scope, ConstanteService, GenericService, UserService, uiCalendarConfig, $modal, bootbox, $filter, $translatePartialLoader, $translate, JobInterviewService,OffererService) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();
    $scope.currentUser = UserService.getCurrentUser();
    $scope.urlServerFiles = ConstanteService.urlServerFiles;
    $scope.interviews = [];
    $scope.offererName = "";
    $scope.InterviewQuestions = [];

    $scope.refetchEvents = function () {
        GenericService.getByURL(current_url)
            .then(function (response) {
                console.log(response);
                $scope.interviews = response.data;
                $scope.events = [];
                for (var x = 0; x < $scope.interviews.length; x++) {
                    var textColor = 'black';
                    var color = '#ffffff';
                    //console.log($scope.interviews[x]);
                    if($scope.interviews[x].offererStatusId==2){
                        textColor = 'yellow';
                    } else if($scope.interviews[x].offererStatusId==3){
                        textColor = 'orange';
                    } else if ($scope.interviews[x].startdate && $scope.interviews[x].enddate && $scope.interviews[x].offererStatusId==4) {
                        textColor = 'green';
                    } else if ($scope.interviews[x].startdate) {
                        textColor = 'blue';
                    } else if ($scope.interviews[x].enddate) {
                        textColor = 'red';
                    }
                    $scope.events.push({id: $scope.interviews[x].id, title: $scope.interviews[x].interview, allDay: false, start: new Date($scope.interviews[x].dateInterview), img: $scope.urlServerFiles + $scope.interviews[x].interviewImage, textColor: textColor, color: color,
                        interviewId: $scope.interviews[x].id, offererId: $scope.interviews[x].offererId, offerer: $scope.interviews[x].offerer, imgOfferer: $scope.urlServerFiles + $scope.interviews[x].offererImage,
                        startdate: $scope.interviews[x].startdate, enddate: $scope.interviews[x].enddate,offererStatusId:$scope.interviews[x].offererStatusId,offererStatus:$scope.interviews[x].offererStatus,offererGender:$scope.interviews[x].offererGender
                    });
                }
                uiCalendarConfig.calendars['myCalendar'].fullCalendar('removeEventSource', $scope.events);
                //uiCalendarConfig.calendars['myCalendar'].fullCalendar( 'addEventSource', $scope.events);
                uiCalendarConfig.calendars['myCalendar'].fullCalendar('refetchEvents');
            });
    };
    $scope.report = [];
    $scope.getReportInterview=function(id,url,paginas,filename,interviewId) {
        var params="{'interviewId':'"+interviewId+"'}";
        $scope.report.print = OffererService.url(id + '/getReport?urlReport='+url+'&paginas='+paginas+'&filename='+filename+'&params='+params);
    };

    function showModalQuestions() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'InterviewInstanceCtrl',
            size: 'xl',
            backdrop: 'static',
            resolve: {
                InterviewData: function () {
                    return $scope.InterviewData;
                }
            }
        });
        modalInstance.result.then(function (InterviewData) {
            $scope.InterviewData = InterviewData;
            //console.log(angular.toJson($scope.InterviewData.OffererJobInterview.offererJobInterviewDatas));
            console.log($scope.InterviewData);
            GenericService.postByURL("JobInterview/Questions/" + $scope.InterviewData.OffererJobInterview.id, $scope.InterviewData.OffererJobInterview)
                .then(function (response) {
                    console.log(response.data);
                    GenericService.putByURL("Offerer/"+$scope.InterviewData.Offerer.offererId+"/Location", $scope.InterviewData.offererLocations)
                        .then(function(response){
                            console.log(response.data);
                            GenericService.putByURL("Offerer/"+$scope.InterviewData.Offerer.offererId+"/Family", $scope.InterviewData.offererFamilys)
                                .then(function(response){
                                    console.log(response.data);
                                    GenericService.putByURL("Offerer/"+$scope.InterviewData.Offerer.offererId+"/previousJobs", $scope.InterviewData.previousJobs)
                                        .then(function(response){
                                            console.log(response.data);
                                            GenericService.putByURL("Offerer/"+$scope.InterviewData.Offerer.offererId+"/Credit", $scope.InterviewData.offererCredit)
                                                .then(function(response){
                                                    console.log(response.data);
                                                    $scope.refetchEvents();
                                                });
                                        });
                                });
                        });
                });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    function getInterviewers() {
        GenericService.getByURL("Employee/employees")
            .then(function (response) {
                console.log(response);
                $scope.interviewers=response.data;
            });
    };
    getInterviewers();
    $scope.person = {};
    $scope.person.selected = undefined;
    $scope.todos = function() {
        $scope.person.selected = undefined;
        $scope.refetchEvents();
    };

    $scope.showModalReview= function(offerer) {
        console.log("offerer ***********");
        console.log(offerer);
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
    };

    $scope.openInterview = function (size, date) {
        //'/reports/MPRH/Reclutamiento/CVLight',1,'CVLight'
        $scope.getReportInterview(date.offererId,'/reports/MPRH/SolicitudEmpleo/Entevista',3,'Entrevista',date.id);
        GenericService.getByURL("JobInterview/" + date.id)
            .then(function (response) {
                console.log(response.data);
                var today = $filter('amDateFormat')(date.start, 'dddd D/MMMM/YYYY h:mm:ss a');
                var message = "Entrevista programada para el día <b>" + today + "</b>, con <b>" + date.offerer + "</b>, porfavor confirme para iniciar.";
                var label = "Iniciar Entrevista!!";
                var finalizado = false;
                if(date.offererStatusId==0){
                    message = "El Oferente debe Completar el Perfil para iniciar con la entrevista.";
                }if(date.offererStatusId==3){
                    message = "Perfil Completado.";
                    label = "Ver y Confirmar Respuestas!!";
                }else if (date.startdate && date.enddate && date.offererStatusId==4) {
                    message = "Entrevista Finalizada.";
                    label = "Ver Respuestas!!";
                    finalizado = true;
                } else if (date.startdate) {
                    message = "Entrevista InCompleta.";
                }
                $scope.InterviewData = {questions: $scope.InterviewQuestions, Offerer: date, response: [], OffererJobInterview: response.data, finalizado: finalizado};
                bootbox.dialog({
                    message: message,
                    title: "<img src=" + date.img + " class='img-circle' height=20px width=20px /> " + date.title + ", Entrevistador(a) asignado.",
                    buttons: {
                        info: {
                            label: "Imprimir Entrevista",
                            className: "btn-info",
                            callback: function () {
                                console.log("Imprimir Entrevista");
                                bootbox.dialog({
                                    message: "<object type=\"application/pdf\" data=\"" + $scope.report.print + "\" style=\"width:100%;height:500px\"></object>",
                                    title: "Entrevista!!!"
                                }).find("div.modal-dialog").addClass("largeWidth");
                            }
                        },
                        main: {
                            label: "Ver Ficha Oferente",
                            className: "btn-primary",
                            callback: function() {
                                GenericService.getByURL("Offerer/Offerer/Reviews?offererid="+date.offererId)
                                    .then(function (response) {
                                        console.log(response);
                                        if(response.data){
                                            $scope.showModalReview(response.data[0]);
                                        }
                                    });
                            }
                        },
                        success: {
                            label: label,
                            className: "btn-success",
                            callback: function () {
                                showModalQuestions();
                            }
                        },
                        danger: {
                            label: "Cancelar!!",
                            className: "btn-danger",
                            callback: function () {
                            }
                        }
                    }
                });

            });
    };


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        //$scope.alertMessage = (date.title + ' was clicked ');
        console.log(date.title + ' was clicked ');
        console.log(date);
        $scope.openInterview('xl', date);
    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        var a = event.start._d.getTime() + 21600000;
        if (event.start._d > new Date() && !event.enddate) {
            bootbox.confirm("Desea re-programar para la fecha " + new Date(a).toLocaleString(), function (result) {
                if (result) {
                    $scope.intervieWerTemp = {date: new Date(a), interviewer: {id: null}, offerer: {id: null}, id: event.id, startDate: null, endDate: null};
                    JobInterviewService.update(event.id, $scope.intervieWerTemp)
                        .then(function (result) {
                            console.log(result);
                            if (result.status == '200' || result.status == '201') {
                                var ok = $filter('filter')($scope.events, {id: event.id}, true);
                                var index = $scope.events.indexOf(ok[0]);
                                $scope.events[index].start = new Date(result.data.date);
                                bootbox.alert("Cambiado Exitosamente");
                                event.start._d = new Date(a);
                                $scope.refetchEvents();
                                return true;
                            } else {
                                bootbox.alert(result.status + ' ' + result.statusText);
                                $scope.refetchEvents();
                                return false;
                            }
                        });
                } else {
                    $scope.refetchEvents();
                }
            });
        } else {
            bootbox.alert("No se puede cambiar, Oferente ya entrevistado");
            $scope.refetchEvents();
        }


        //$scope.intervieWerTemp={date:obj.dateInterViewer.toISOString(), interviewer: {id:parseInt(obj.interviewer)}, offerer:{id:obj.offerer.id}};
        //$scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        var a = event.start._d.getTime() + 21600000;
        console.log(new Date(a));
//        event.start._d=a;
//        console.log(event._start._d.setTime(21600000));
//        console.log(event._start._i.setTime(21600000));
//        console.log(event.start._i.setTime(21600000));
        //$scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.events = [/*
     {title: 'All Day Event', start: new Date(y, m, 1), color: '#f00', textColor: 'yellow'},
     {title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
     {id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false},
     {id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false},
     {title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false}*/
    ];

    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function () {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
        console.log("changeView");
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            console.log("renderCalendar");
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
        element.attr({'tooltip': event.title, 'tooltip-append-to-body': true});
        if (event.img !== undefined) {
            console.log("img " + event.img);
            var icon = "<img src=" + event.img + " class='img-circle' height=20px width=20px />";
            element.find('.fc-title').html(icon + event.title+"<br><em>"+event.offererStatus+"</em>");
        }

        //$compile(element)($scope);
    };
    var currentLangCode = 'es';
    var current_url = '';
    var new_url = '';
    $scope.uiConfig = {
        calendar: {
            height: 525,
            editable: true,
            lang: currentLangCode,
            selectable: true,
            selectHelper: true,
            axisFormat: 'HH:mm',
            header: {
                left: 'month agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            events: function (start, end, timezone, callback) {
                var year = end.year();
                var month = end.month();
                console.log(new Date(start.unix()));
                console.log(new Date(end.unix()));
                var interviewId=$scope.person.selected == undefined?0:$scope.person.selected.id;
                new_url = "JobInterview/?year=" + year + "&month=" + month + "&offererName=" + $scope.offererName+"&interviewId="+interviewId;
                if (new_url != current_url) {
                    $scope.events = [];
                    GenericService.getByURL(new_url)
                        .then(function (response) {
                            console.log(response);
                            $scope.interviews = response.data;
                            for (var x = 0; x < $scope.interviews.length; x++) {
                                var textColor = 'black';
                                var color = 'yellow';
                                console.log($scope.interviews[x]);
                                if($scope.interviews[x].offererStatusId==2){
                                    //textColor = 'yellow';
                                    color = 'yellow';
                                } else if($scope.interviews[x].offererStatusId==3){
                                    color = 'orange';
                                } else if ($scope.interviews[x].startdate && $scope.interviews[x].enddate && $scope.interviews[x].offererStatusId==4) {
                                    color = 'green';
                                } else if ($scope.interviews[x].startdate) {
                                    textColor = 'white';
                                    color = 'DarkCyan';
                                } else if ($scope.interviews[x].enddate) {
                                    textColor = 'white';
                                    color = 'DarkRed';
                                }
                                $scope.events.push({id: $scope.interviews[x].id, title: $scope.interviews[x].interview, allDay: false, start: new Date($scope.interviews[x].dateInterview), img: $scope.urlServerFiles + $scope.interviews[x].interviewImage, textColor: textColor, color: color,
                                    interviewId: $scope.interviews[x].id, offererId: $scope.interviews[x].offererId, offerer: $scope.interviews[x].offerer, imgOfferer: $scope.urlServerFiles + $scope.interviews[x].offererImage,
                                    startdate: $scope.interviews[x].startdate, enddate: $scope.interviews[x].enddate,offererStatusId:$scope.interviews[x].offererStatusId,offererStatus:$scope.interviews[x].offererStatus,offererGender:$scope.interviews[x].offererGender
                                });
                            }
                            current_url = new_url;
                            callback($scope.events);
                        });
                } else {
                    callback($scope.events);
                }
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender,
            dayClick: function (date, jsEvent, view) {
                console.log('Clicked on: ' + date.format());
                //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //alert('Current view: ' + view.name);
                // change the day's background color just for fun
                //$(this).css('background-color', 'red');
            }
        }
    };
    //getInterviewsByStatus('0');
    $scope.eventSources = [];


}]);

RRHH.controller('InterviewInstanceCtrl', ['$scope', '$modalInstance', 'InterviewData', '$translatePartialLoader', '$translate','GenericService', function ($scope, $modalInstance, InterviewData, $translatePartialLoader, $translate,GenericService) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();

    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
        {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
        {stateOn: 'glyphicon-heart'},{stateOff: 'glyphicon-off'}
    ];

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

    $scope.offererLocations = [];
    $scope.previousJobs=[];
    $scope.otherJobs=[];
    $scope.offererFamilys=[];
    $scope.offererCredit=[];
    $scope.listSN = [
        {value: true, label: 'SI'},
        {value: false, label: 'NO'}
    ];
    $scope.getOffererInterview = function () {
        console.log($scope.Offerer.offererId);
        GenericService.getByURL("Offerer/" + $scope.Offerer.offererId)
            .then(function (result) {
                console.log(result.data);
                $scope.offererLocations = result.data.offererLocations;
                $scope.previousJobs=result.data.previousJobs;
                $scope.offererFamilys=result.data.offererFamily;
                $scope.offererCredit=result.data.offererCredit;
            });
    }

    $scope.AgregarFilaLocation = function () {
        $scope.offererLocations.push({familyWork: false, location: null, workDay: null, timeDistance: 10, relationShipType: null, fullNameFamily: null});
    }

    $scope.AgregarFilaJob = function () {
        $scope.previousJobs.push({});
    }
    $scope.AddRowOtherJob = function () {
        $scope.otherJobs.push({});
    }

    $scope.AgregarFilaFamily = function () {
        $scope.offererFamilys.push({});
    }

    $scope.AgregarFilaCredit=function(){
        $scope.offererCredit.push({});
    }

    $scope.QuitarFilaLocation = function (index) {
        $scope.offererLocations.splice(index,1);
    }

    $scope.QuitarFilaJob = function (index) {
        $scope.previousJobs.splice(index,1);
    }
    $scope.RemoveRowOtherJob = function (index) {
        $scope.otherJobs.splice(index,1);
    }

    $scope.QuitarFilaFamily = function (index) {
        $scope.offererFamilys.splice(index,1);
    }

    $scope.QuitarFilaCredit=function(index){
        $scope.offererCredit.splice(index,1);
    }

    $scope.getCurrency = function () {
        GenericService.getByURL("Currency")
            .then(function (result) {
                console.log(result.data);
                $scope.currencys = result.data;
            });
    }

    $scope.getWorkDay = function () {
        GenericService.getByURL("WorkDay")
            .then(function (result) {
                console.log(result.data);
                $scope.workDays = result.data;
            });
    }

    $scope.getLocations = function () {
        GenericService.getByURL("Location")
            .then(function (result) {
                console.log(result.data);
                $scope.locations = result.data;
            });
    }

    $scope.getRelationShipTypes = function () {
        GenericService.getByURL("RelationShipType/list")
            .then(function (result) {
                console.log(result.data);
                $scope.relationShipTypes = result.data;
            });
    }


    $scope.outputs = {};
    $scope.getData = function () {
        //if ($scope.myNewForm.$valid) { // && $scope.OffererJobInterview.recommended > 0
            $scope.OffererJobInterview.endDate = new Date();
            for(var x=0;x<$scope.OffererJobInterview.offererJobInterviewDatas.length;x++){
                console.log($scope.OffererJobInterview.offererJobInterviewDatas[x]);
                if($scope.OffererJobInterview.offererJobInterviewDatas[x].question){
                    if($.isArray($scope.OffererJobInterview.offererJobInterviewDatas[x].response)){
                        $scope.OffererJobInterview.offererJobInterviewDatas[x].response=$scope.OffererJobInterview.offererJobInterviewDatas[x].response.toString();
                    }
                    if($scope.OffererJobInterview.offererJobInterviewDatas[x].question.rateResponseList){
                        if($scope.OffererJobInterview.offererJobInterviewDatas[x].response){
                            //console.log($scope.OffererJobInterview.offererJobInterviewDatas[x].response+" = "+$scope.OffererJobInterview.offererJobInterviewDatas[x].question.rateResponseList);
                            var responseList=$scope.OffererJobInterview.offererJobInterviewDatas[x].question.rateResponseList.split('|');
                            for(var y=0;y<responseList.length;y++){
                                var rateResponse=responseList[y].split('=');
                                if($scope.OffererJobInterview.offererJobInterviewDatas[x].response==rateResponse[0]){
                                    $scope.OffererJobInterview.offererJobInterviewDatas[x].rate=rateResponse[1];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            InterviewData.OffererJobInterview = $scope.OffererJobInterview;
            InterviewData.offererLocations=$scope.offererLocations;
            InterviewData.previousJobs=$scope.previousJobs;
            InterviewData.offererFamilys=$scope.offererFamilys;
            InterviewData.offererCredit=$scope.offererCredit;
            //alert('Se esta enviando las respuetas.');
            $modalInstance.close(InterviewData);
        //}
    };
    /*
     $scope.ok = function () {
     $modalInstance.close($scope.selected.InterviewQuestions);
     };*/

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };
}]);

RRHH.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    }
});

RRHH.controller("ReviewsController", ['$rootScope', '$scope', 'ConstanteService', 'GenericService', 'UserService', 'uiCalendarConfig', '$modal', 'bootbox', '$filter', '$translatePartialLoader', '$translate', function ($rootScope, $scope, ConstanteService, GenericService, UserService, uiCalendarConfig, $modal, bootbox, $filter, $translatePartialLoader, $translate) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();
    $scope.currentUser = UserService.getCurrentUser();
    $scope.urlServerFiles = ConstanteService.urlServerFiles;
    $scope.offerers = [];
    $scope.offerer = {};
    $scope.offererId = 0;
    $scope.offererName = "";
    $scope.InterviewQuestions = [];
    $scope.OffererResult;
    $scope.maritalStatus="";
    $scope.gender="";
    $scope.checked = false; // This will be binded using the ps-open attribute
    $scope.name1="";
    $scope.name2="";
    $scope.name3="";
    $scope.name4="";
    $scope.rangoEdad="";
    $scope.locationid=0;
    $scope.toggle = function(){
        $scope.checked = !$scope.checked
        getLocationByEmployee();
    };

    $scope.searchFull=function(type){
        var params="";

        if(type==0){ //Single
            params+="?offererName="+$scope.offererName;
            GenericService.getByURL("Offerer/Offerer/Reviews"+params)
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
            params+="?offererName="+name+"&gender="+$scope.gender+"&maritalStatus="+$scope.maritalStatus+"&edad="+$scope.rangoEdad+"&offererid="+$scope.offererId+"&locationid="+$scope.locationid;
            GenericService.getByURL("Offerer/Offerer/Reviews"+params)
                .then(function (response) {
                    console.log(response);
                    $scope.offerers = response.data;
                    $scope.checked = false;
                });
        }
    };

    function getLocationByEmployee() {
        GenericService.getByURL("Location/byEmployee")
            .then(function (response) {
                console.log(response);
                $scope.locationAll=response.data;
            });
    };


    $scope.showModalReview= function(offerer) {
        console.log("offerer ***********");
        console.log(offerer);
        $scope.OffererResult=offerer;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContentReview.html',
            controller: 'ReviewsInstanceCtrl',
            size: 'xxl',
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
    };
    //$scope.showModalReview=showModalReview;



}]);

RRHH.controller('ReviewsAboutWorkInstanceCtrl', ['$scope','$rootScope',  '$translatePartialLoader', '$translate', 'GenericService','ConstanteService','$filter','OffererService', function ($scope,$rootScope, $translatePartialLoader, $translate, GenericService,ConstanteService,$filter,OffererService) {

    //$scope.changeAboutWork=function(){

        GenericService.allWorkPlaceType()
            .then(function (result) {
                $scope.workPlaceType = result.data;
            });

        if($scope.person.offerer.workPlaceType.length>0){
            $scope.Job.workPlaceType.id=$scope.person.offerer.workPlaceType[0].id;
        }

        GenericService.allWorkDay()
            .then(function (result) {
                $scope.workDay = result.data;
            });

        if($scope.person.offerer.workDay){
            $scope.Job.workDay.id=$scope.person.offerer.workDay[0].id;
        }

        GenericService.allCurrency()
            .then(function (result) {
                $scope.currency = result.data;
                if($rootScope.ocultarCamposHonduras){
                    var ok = $filter('filter')($scope.currency, {id: 1}, true);
                    console.log(ok);
                    var index = $scope.currency.indexOf(ok[0]);
                    $scope.currency.splice(index,1);
                }
            });

        if($scope.person.offerer.currency){
            $scope.Job.currency.id=$scope.person.offerer.currency.id;
        }

        if($scope.person.offerer.salary){
            $scope.Job.salaryRequired=$scope.person.offerer.salary;
        }

        GenericService.allWorkingArea()
            .then(function (result) {
                $scope.workingArea = result.data;
                $scope.Job.workingArea=$scope.person.offerer.workingArea;
                for (var x = 0; x < $scope.workingArea.length; x++) {
                    var ok = $filter('filter')($scope.Job.workingArea, {id: $scope.workingArea[x].id}, true);
                    if (ok.length == 1) {
                        $scope.workingArea[x].ok = true;
                    } else {
                        $scope.workingArea[x].ok = false;
                    }
                }
            });

        if($scope.person.offerer.company){
            for(var a in $scope.person.offerer.company){
                $scope.Job.offererCompany.push($scope.person.offerer.company[a].company);
            }

        }

        GenericService.allCompany($scope.person.offerer.id)
            .then(function (result) {
                $scope.company = result.data;
                for (var x = 0; x < $scope.company.length; x++) {
                    console.log($scope.Job.offererCompany);
                    var ok = $filter('filter')($scope.Job.offererCompany, {id: $scope.company[x].id}, true);
                    if (ok.length == 1) {
                        $scope.company[x].refererBy = ok[0].refererBy;
                        $scope.company[x].ok = true;
                    } else {
                        $scope.company[x].refererBy = "";
                        $scope.company[x].ok = false;
                    }
                };
            });

        var id = 0;
        if ($scope.person.address.length > 0) {
            for (var x = 0; x < $scope.person.address.length; x++) {
                var adr = $scope.person.address[x];
                if (adr.addressType.id = 1) {
                    id = adr.address.country.id;
                    break;
                }
            }
        }

        GenericService.allStatesByCountry(id)
            .then(function (result) {
                $scope.statesResidence = result.data;
                $scope.Job.state = $scope.person.offerer.state;
                for (var x = 0; x < $scope.statesResidence.length; x++) {
                    var ok = $filter('filter')($scope.Job.state, {id: $scope.statesResidence[x].id}, true);
                    if (ok.length == 1) {
                        $scope.statesResidence[x].ok = true;
                    } else {
                        $scope.statesResidence[x].ok = false;
                    }
                };
            });
    //};

}]);

RRHH.controller('ReviewsReferenceInstanceCtrl', ['$scope','$rootScope',  '$translatePartialLoader', '$translate', 'GenericService','ConstanteService','$filter','OffererService','$modal', function ($scope,$rootScope, $translatePartialLoader, $translate, GenericService,ConstanteService,$filter,OffererService,$modal) {

    $scope.referenciasPersonalestmp = {fullName: '', phone: '', offererReferenceType: {id: 1}, id: 0};
    $scope.offererReference = [];
    $scope.ReferenceMain={};
    $scope.guardarReference = function () {
        if ($scope.referenciasPersonalestmp.fullName != '' && $scope.referenciasPersonalestmp.phone != '' && $scope.referenciasPersonalestmp.phone) {
            console.log($scope.referenciasPersonalestmp);
            console.log($scope.referenceSelected);
            OffererService.update($scope.person.offerer.id + "/offererReference", $scope.referenciasPersonalestmp)
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
                        $scope.person.offerer.offererReference = $scope.offererReference;
                        return true;
                    } else {
                        bootbox.alert(result.status + ' ' + result.statusText);
                        return false;
                    }
                });
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
                    $scope.person.offerer.offererReference = $scope.offererReference;
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
        $scope.referenciasPersonalestmp = '';
    };

    $scope.confirmarRegistroReference=function(reference,index){
        console.log(reference);
        GenericService.getByURL("OffererReference/"+reference.id)
            .then(function (result) {
                if (result.status == '200' || result.status == '201') {
                    $scope.ReferenceMain = result.data;
                    console.log($scope.ReferenceMain);
                    if($scope.ReferenceMain.confirm){
                        for(var a in $scope.ReferenceMain.offererReferenceDatas){
                            if($scope.ReferenceMain.offererReferenceDatas[a].question.id==4){
                                var arr=$scope.ReferenceMain.offererReferenceDatas[a].response.split(",");
                                console.log(arr);
                                $scope.ReferenceMain.offererReferenceDatas[a].response=arr;
                            }
                        }
                    }
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'confirmReferenceByType.html',
                        controller: 'ConfirmReferenceInstanceCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            ReferenceMain: function () {
                                return $scope.ReferenceMain;
                            }
                        }
                    });
                    modalInstance.result.then(function (ReferenceMain) {
                        $scope.ReferenceMain = ReferenceMain;
                        if($scope.ReferenceMain){
                            if($scope.ReferenceMain.offererReferenceDatas){
                                for(var b in $scope.ReferenceMain.offererReferenceDatas){
                                    if($.isArray($scope.ReferenceMain.offererReferenceDatas[b].response)){
                                        $scope.ReferenceMain.offererReferenceDatas[b].response=$scope.ReferenceMain.offererReferenceDatas[b].response.toString();
                                    }
                                }
                            }
                        }

                        if($scope.ReferenceMain.offererReferenceDatas){
                            for (var a in $scope.ReferenceMain.offererReferenceDatas){
                                if($scope.ReferenceMain.offererReferenceDatas[a].question){
                                    if($scope.ReferenceMain.offererReferenceDatas[a].question.rateResponseList){
                                        var responseList=$scope.ReferenceMain.offererReferenceDatas[a].question.rateResponseList.split('|');
                                        for(var y=0;y<responseList.length;y++){
                                            var rateResponse=responseList[y].split('=');
                                            if($scope.ReferenceMain.offererReferenceDatas[a].response==rateResponse[0]){
                                                $scope.ReferenceMain.offererReferenceDatas[a].rate=rateResponse[1];
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        console.log($scope.ReferenceMain);
                        GenericService.putByURL("OffererReference/"+reference.id,$scope.ReferenceMain)
                            .then(function (result) {
                                console.log(result.data);
                                if (result.status == '200' || result.status == '201') {
                                    $scope.offererReference.splice(index, 1);
                                    $scope.offererReference.push(result.data);
                                    $scope.person.offerer.offererReference=$scope.offererReference;
                                    bootbox.alert('Ok, se confirmó la referencia, '+$scope.ReferenceMain.fullName);
                                }else{
                                    bootbox.alert('Ocurrio un Error al grabar la confirmacion de referencia.');
                                }
                            });
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }
            });
    };



    $scope.offererReference = $scope.person.offerer.offererReference;

}]);

RRHH.controller('ConfirmReferenceInstanceCtrl', ['$scope','$rootScope', '$modalInstance', 'ReferenceMain', '$translatePartialLoader', '$translate', 'GenericService','ConstanteService','$filter','OffererService', function ($scope,$rootScope,$modalInstance, ReferenceMain, $translatePartialLoader, $translate, GenericService,ConstanteService,$filter,OffererService) {
    $scope.ReferenceMain = ReferenceMain;
    $scope.fnSaveReference=function(){
        ReferenceMain=$scope.ReferenceMain;
        $modalInstance.close(ReferenceMain);
    };
    $scope.cerrar=function(){
        $modalInstance.dismiss('cancel');
    }
}]);

RRHH.controller('ReviewsEstudiosRealizadosInstanceCtrl', ['$scope','$rootScope',  '$translatePartialLoader', '$translate', 'GenericService','ConstanteService','$filter','OffererService', function ($scope,$rootScope, $translatePartialLoader, $translate, GenericService,ConstanteService,$filter,OffererService) {
    $scope.getStudiesLevelAll = function () {
        GenericService.getByURL("StudiesLevel/")
            .then(function (result) {
                if (result.status == '200' || result.status == '201') {
                    $scope.studiesLevelAll = result.data;
                    console.log($scope.studiesLevelAll);
                }
            });
    };
    $scope.getStudiesLevelAll();

    $scope.getStudiesGradeByLevel2 = function (type) {
        GenericService.getByURL("StudiesLevelGrade/byLevel/" + type)
            .then(function (result) {
                if (result.status == '200' || result.status == '201') {
                    console.log(result.data);
                    if ($scope.studiesLevel != 1) {//preprimaria
                        $scope.studiesGradeLevelAll = result.data;
                    }else {
                        $scope.studiesGradeLevelAll = [];
                    }
                }
            });
    };

    $scope.guardarEducacion2 = function () {
        console.log($scope.studiesLevelAll);
        console.log($scope.studiesLevel.id);
        var ok = $filter('filter')($scope.studiesGradeLevelAll, {id: parseInt($scope.studiesGrade.id)}, true);
        $scope.studiesLevel2 = ok[0];
        console.log(ok);
        console.log($scope.studiesLevel2);
        for(var a in $scope.studiesLevelGrade){
            console.log($scope.studiesLevelGrade[a].studiesLevel.id);
            if($scope.educacionSelected==-1 && $scope.studiesLevelGrade[a].studiesLevel.id==$scope.studiesLevel2.studiesLevel.id && $scope.studiesLevel2.studiesLevel.id!=5){
                bootbox.alert("Ya existe un grado en "+$scope.studiesLevel2.studiesLevel.name+"!!");
                return false;
            }
        }
        if ($scope.studiesLevel2) {
            if ($scope.educacionSelected > -1) {
                console.log($scope.educacionSelected);
                $scope.studiesLevelGrade[$scope.educacionSelected] = $scope.studiesLevel2;
            } else {
                $scope.studiesLevelGrade.push($scope.studiesLevel2);
            }
            if($scope.studiesLevelGrade){
                OffererService.update($scope.person.offerer.id + "/Education", $scope.studiesLevelGrade)
                    .then(function (result) {
                        console.log(result.data);
                        if (result.status == '200' || result.status == '201') {
                            $scope.person.offerer.studiesLevelGrade = result.data;
                        }
                    });
            }
        } else {
            bootbox.alert("Datos Incompletos!!!");
        }
        $scope.educacionSelected = -1;
        $scope.studiesLevel={id:0, name:''};
        $scope.studiesGrade={id:0, name:''};
    };

    $scope.editarRegistroEducacion = function (g, index) {
        $scope.studiesLevel=g.studiesLevel;
        $scope.educacionSelected = index;
        $scope.getStudiesGradeByLevel2($scope.studiesLevel.id);
        $scope.studiesGrade= g;
    };

    $scope.removerRegistroEducacion = function (index) {
        $scope.studiesLevelGrade.splice(index, 1);
        $scope.educacionSelected = -1;
        OffererService.update($scope.person.offerer.id + "/Education", $scope.studiesLevelGrade)
            .then(function (result) {
                console.log(result.data);
                $scope.studiesLevelGrade = result.data;
            });
    };
}]);

RRHH.controller('ReviewsInstanceCtrl', ['$scope','$rootScope', '$modalInstance', 'OffererResult', '$translatePartialLoader', '$translate', 'GenericService','ConstanteService','$filter','OffererService','$modal','PreviousJobsService','FileUploadService', function ($scope,$rootScope,$modalInstance, OffererResult, $translatePartialLoader, $translate, GenericService,ConstanteService,$filter,OffererService,$modal,PreviousJobsService,FileUploadService) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();
    $scope.urlServerFiles = ConstanteService.urlServerFiles;
    $scope.OffererResult = OffererResult;
    $scope.offererId=$scope.OffererResult.offererid;

    $scope.person;
    $scope.genders = ConstanteService.genders;
    $scope.maritalStatus = ConstanteService.maritalStatus;
    $scope.newOfferer = { firstName: '', middleName: '', mainLastName: '', secondLastName: '', marriedLastName: '', countryBirth: '', stateBirth: ''};
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
        date: {exp: /^(?:(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:0?[1-9]|1[0-2]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:31(\/|-)(?:0?[13578]|1[02]))|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(29(\/|-)0?2)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/, message: 'El Numero debe tener mas de 7 digitos.'},
        fullName: {exp: /([a-zA-Z\-]+){3,}\s+([a-zA-Z\-]+){3,}/, message: 'El Numero debe tener mas de 7 digitos.'}
    };
    $scope.driverLicense = false;
    $scope.newOfferer.driverLicenseA = false;
    $scope.newOfferer.driverLicenseB = false;
    $scope.newOfferer.driverLicenseC = false;
    $scope.newOfferer.driverLicenseM = false;
    $scope.familiares=[];
    $scope.Family={};
    $scope.workPlaceType=[];
    $scope.Job = {currency: {id: 1}, workDay: {id: 1}, workPlaceType: {id: 1}};
    $scope.workingArea = [];
    $scope.Job.offererCompany = [];
    $scope.Salud = {};
    $scope.allFieldDataType = [];
    $scope.studiesLevel={id:0,name:''};
    $scope.studiesGrade={id:0,name:''};
    $scope.studiesGradeLevelAll=[];
    $scope.studiesLevelGrade=[];
    $scope.educacionSelected=-1;
    $scope.updateStatus={id:0, name:''};
    $scope.updateStatusOfferer=true;
    $scope.statusAll=[];
    $scope.newstatusAll=[];
    $scope.noTengoLicencia = function () {
        $scope.person.driverLicense = [];
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
                $scope.person.driverLicense.push(d);
            }
            if ($scope.newOfferer.driverLicenseB) {
                var d = {driver: 'B'};
                $scope.person.driverLicense.push(d);
            }
            if ($scope.newOfferer.driverLicenseC) {
                var d = {driver: 'C'};
                $scope.person.driverLicense.push(d);
            }
            if ($scope.newOfferer.driverLicenseM) {
                var d = {driver: 'M'};
                $scope.person.driverLicense.push(d);
            }
        } else {
            $scope.driverLicense = false;
        }
    };
    $scope.OffererReview={employee:null,offerer:null,offererStatus:{},observation:null,attachment:null,offererStatusReason:{}};
    $scope.actualizarEstado=function(){
        $scope.showStatus=!$scope.showStatus;
        //$scope.OffererReview.offerer=$scope.person.offerer;
        //$scope.OffererReview.offererStatus=$scope.person.offerer.offererStatus;
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'actualizarEstadoOferente.html',
            controller: 'ActualizarEstadoOferenteInstanceCtrl',
            backdrop: 'static',
            resolve: {
                OffererReview: function () {
                    return $scope.OffererReview;
                }
            }
        });
        modalInstance.result.then(function (OffererReview) {
            $scope.OffererReview = OffererReview;
            console.log($scope.OffererReview);
            GenericService.postByURL("Offerer/" + $scope.person.offerer.id+"/Review",$scope.OffererReview)
                .then(function (result) {
                    console.log(result.data);
                    if (result.status == '200' || result.status == '201') {
                        getReview($scope.person.offerer.id);
                    }
                });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    function fullNamePart() {
        var fullName = $scope.newOfferer.firstName + ',' + $scope.newOfferer.middleName + ';' + $scope.newOfferer.mainLastName + ',' + $scope.newOfferer.secondLastName;
        if ($scope.newOfferer.marriedLastName) {
            $scope.person.fullName = fullName + ':' + $scope.newOfferer.marriedLastName;
        } else {
            $scope.person.fullName = fullName;
        }
    };
    function setPhone() {
        if ($scope.currentUser.userAccount.person.phone && $scope.currentUser.userAccount.person.phone.length > 0) {
            for (var x = 0; x < $scope.person.phone.length; x++) {
                if ($scope.person.phone[x].phoneType.id == 1) { //Phone
                    $scope.person.phone[x].phoneNumber = $scope.newOfferer.phone;
                } else if ($scope.person.phone[x].phoneType.id == 2) { //CellPhone
                    $scope.person.phone[x].phoneNumber = $scope.newOfferer.cellPhone;
                }
            }
        } else {
            $scope.person.phone = [];
            var phone = {};
            phone.phoneType = {id: 1};
            phone.phoneNumber = $scope.newOfferer.phone;
            if($scope.newOfferer.phone){
                $scope.person.phone.push(phone);
            }

            var cellPhone = {};
            cellPhone.phoneType = {id: 2};
            cellPhone.phoneNumber = $scope.newOfferer.cellPhone;
            $scope.person.phone.push(cellPhone);
        }
    };
    function getAddressByType(type) {
        var existe = -1;
        for (var x = 0; x < $scope.person.address.length; x++) {
            var address = $scope.person.address[x];
            console.log(address);
            if (address.addressType.id == type) {
                existe = x;
                break;
            }
        }
        console.log("Type " + type + " existe=" + existe);
        if (existe >= 0) {
            if (type == 1) { //Residencia
                $scope.person.address[existe].address.country.id = $scope.newOfferer.residenceCountry.id;
                $scope.person.address[existe].address.state.id = $scope.newOfferer.residenceState.id;
                $scope.person.address[existe].address.city.id = $scope.newOfferer.residenceCity.id;
                $scope.person.address[existe].address.number = $scope.newOfferer.residenceNumber;
                $scope.person.address[existe].address.street = $scope.newOfferer.residenceStreet;
                $scope.person.address[existe].address.suburb = $scope.newOfferer.residenceSuburb;
                $scope.person.address[existe].address.zone = $scope.newOfferer.residenceZone;
                $scope.person.address[existe].address.fullAddress = $scope.newOfferer.residenceFullAddress;
            } else if (type == 2) { //Nacimiento
                $scope.person.address[existe].address.country.id = $scope.newOfferer.birthCountry.id;
                $scope.person.address[existe].address.state.id = $scope.newOfferer.birthState.id;
                $scope.person.address[existe].address.city.id = $scope.newOfferer.birthCity.id;
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
                $scope.person.address.push(address);
            } else if (type == 2) { //Nacimiento
                address.address.country.id = $scope.newOfferer.birthCountry.id;
                address.address.state.id = $scope.newOfferer.birthState.id;
                address.address.city.id = $scope.newOfferer.birthCity.id;
                $scope.person.address.push(address);
            }
        }
    };
    function getIdentificationByType(type) {
        var existe = -1;
        for (var x = 0; x < $scope.person.identifications.length; x++) {
            var ident = $scope.person.identifications[x];
            if (ident.identificationType.id == type) {
                existe = x;
                break;
            }
        }
        console.log("Type " + type + " existe=" + existe);
        if (existe >= 0) {
            if (type == 1) { //CUI
                if ($scope.person.identifications[existe].modify) {
                    $scope.person.identifications[existe].identification = $scope.newOfferer.cui;
                    $scope.person.identifications[existe].identificationFields = [];
                    if ($scope.newOfferer.identCountryId) {
                        var identificationFields = {identificationTypeField: {id: 1}, values: $scope.newOfferer.identCountryId};
                        $scope.person.identifications[existe].identificationFields.push(identificationFields);
                    }
                    if ($scope.newOfferer.identStateId) {
                        var identificationFields = {identificationTypeField: {id: 2}, values: $scope.newOfferer.identStateId};
                        $scope.person.identifications[existe].identificationFields.push(identificationFields);
                    }
                    if ($scope.newOfferer.identCityId) {
                        var identificationFields = {identificationTypeField: {id: 3}, values: $scope.newOfferer.identCityId};
                        $scope.person.identifications[existe].identificationFields.push(identificationFields);
                    }
                }
            } else if (type == 4) { //NIT
                if ($scope.person.identifications[existe].modify) {
                    $scope.person.identifications[existe].identification = $scope.newOfferer.nit;
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
                $scope.person.identifications.push(identification);
            } else if (type == 4) { //NIT
                identification.identification = $scope.newOfferer.nit;
                if ($scope.newOfferer.nit != null) {
                    $scope.person.identifications.push(identification);
                }

            }
        }
    }
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

    $scope.review=[];
    $scope.now=new Date();
    function getReview(id) {
        $scope.now=new Date();
        GenericService.getByURL("Offerer/" + id+"/Review")
            .then(function (response) {
                $scope.review=response.data;
                if($scope.review.length>0){
                    for(var a in $scope.review){
                        if($scope.review[a].attachment!=null){
                            $scope.review[a].attachment=ConstanteService.urlServerUploadFiles+"/resources/"+$scope.review[a].attachment
                        }

                    }
                }
                console.log(response.data);
            })
    }


    function getOfferer(id) {
        GenericService.getByURL("Person/byOfferer/" + id)
            .then(function (response) {
                console.log(response.data);
                $scope.person = response.data;

                var fullName = $scope.person.fullName.split(';');
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

                if ($scope.person.phone) {
                    for (var x = 0; x < $scope.person.phone.length; x++) {
                        if ($scope.person.phone[x].phoneType.id == 1) {
                            $scope.newOfferer.phone = $scope.person.phone[x].phoneNumber;
                        } else if ($scope.person.phone[x].phoneType.id == 2) {
                            $scope.newOfferer.cellPhone = $scope.person.phone[x].phoneNumber;
                        }
                    }
                }
                $scope.newOfferer.nitModify = true;
                $scope.newOfferer.cuiModify = true;
                for (var x = 0; x < $scope.person.identifications.length; x++) {
                    if ($scope.person.identifications[x].identificationType.id == 1) {
                        $scope.newOfferer.cui = $scope.person.identifications[x].identification;
                        $scope.newOfferer.cuiModify = $scope.person.identifications[x].modify;
                        if ($scope.person.identifications[x].identificationFields) {
                            for (var y = 0; y < $scope.person.identifications[x].identificationFields.length; y++) {
                                if ($scope.person.identifications[x].identificationFields[y].identificationTypeField.id == 1) {
                                    $scope.newOfferer.identCountryId = $scope.person.identifications[x].identificationFields[y].values;
                                } else if ($scope.person.identifications[x].identificationFields[y].identificationTypeField.id == 2) {
                                    $scope.newOfferer.identStateId = $scope.person.identifications[x].identificationFields[y].values;
                                } else if ($scope.person.identifications[x].identificationFields[y].identificationTypeField.id == 3) {
                                    $scope.newOfferer.identCityId = $scope.person.identifications[x].identificationFields[y].values;
                                }
                            }
                        }
                    } else if ($scope.person.identifications[x].identificationType.id == 4) {
                        $scope.newOfferer.nit = $scope.person.identifications[x].identification;
                        $scope.newOfferer.nitModify = $scope.person.identifications[x].modify;
                    }
                }
                $scope.newOfferer.driverLicenseNA = true;
                for (var x = 0; x < $scope.person.driverLicense.length; x++) {
                    if ($scope.person.driverLicense[x].driver == 'A') {
                        $scope.driverLicense = true;
                        $scope.newOfferer.driverLicenseA = true;
                        $scope.newOfferer.driverLicenseNA = false;
                    } else if ($scope.person.driverLicense[x].driver == 'B') {
                        $scope.driverLicense = true;
                        $scope.newOfferer.driverLicenseB = true;
                        $scope.newOfferer.driverLicenseNA = false;
                    } else if ($scope.person.driverLicense[x].driver == 'C') {
                        $scope.driverLicense = true;
                        $scope.newOfferer.driverLicenseC = true;
                        $scope.newOfferer.driverLicenseNA = false;
                    } else if ($scope.person.driverLicense[x].driver == 'M') {
                        $scope.driverLicense = true;
                        $scope.newOfferer.driverLicenseM = true;
                        $scope.newOfferer.driverLicenseNA = false;
                    }
                }
                $scope.noTengoLicencia();

                $scope.newOfferer.gender = $scope.person.gender;
                $scope.newOfferer.maritalStatus = $scope.person.maritalStatus;
                if ($scope.person.birthDate) {
                    var today = $filter('date')($scope.person.birthDate, 'dd/MM/yyyy');
                    console.log("Fecha " + today.substring(0, 10));
                    $scope.newOfferer.birthDate = today.substring(0, 10);
                }
                for (var z = 0; z < $scope.person.address.length; z++) {
                    if ($scope.person.address[z].addressType.id == 1) {
                        $scope.newOfferer.residenceZone = $scope.person.address[z].address.zone;
                        $scope.newOfferer.residenceFullAddress = $scope.person.address[z].address.fullAddress;
                        $scope.newOfferer.residenceNumber = $scope.person.address[z].address.number;
                        $scope.newOfferer.residenceStreet = $scope.person.address[z].address.street;
                        $scope.newOfferer.residenceSuburb = $scope.person.address[z].address.suburb;
                        $scope.newOfferer.residenceCountry = $scope.person.address[z].address.country;
                        $scope.newOfferer.residenceState = $scope.person.address[z].address.state;
                        $scope.newOfferer.residenceCity = $scope.person.address[z].address.city;
                    } else if ($scope.person.address[z].addressType.id == 2) {
                        $scope.newOfferer.birthCountry = $scope.person.address[z].address.country;
                        $scope.newOfferer.birthState = $scope.person.address[z].address.state;
                        $scope.newOfferer.birthCity = $scope.person.address[z].address.city;
                    }
                }
                if($scope.person.offerer.offererFamily){
                    for(var a in $scope.person.offerer.offererFamily){
                        console.log($scope.person.offerer.offererFamily);
                        $scope.familiares=$scope.person.offerer.offererFamily

                    }
                }

                if($scope.person.offerer.studiesLevelGrade){
                    for(var a in $scope.person.offerer.studiesLevelGrade){
                        console.log($scope.person.offerer.studiesLevelGrade);
                        $scope.studiesLevelGrade=$scope.person.offerer.studiesLevelGrade;
                    }
                }

                GenericService.allFieldDataType()
                    .then(function (result) {
                        $scope.allFieldDataType = result.data;
                        console.log($scope.allFieldDataType);
                    });



                for (var z = 0; z < $scope.person.personDataField.length; z++) {
                    if ($scope.person.personDataField[z].fieldDataType.name == 'Weight') {
                        $scope.Salud.Weight = $scope.person.personDataField[z].response;
                    } else if ($scope.person.personDataField[z].fieldDataType.name == 'Height') {
                        $scope.Salud.Height = $scope.person.personDataField[z].response;
                    } else if ($scope.person.personDataField[z].fieldDataType.name == 'medicalCondition') {
                        $scope.Salud.medicalCondition = $scope.person.personDataField[z].response;
                    } else if ($scope.person.personDataField[z].fieldDataType.name == 'consumeMedicament') {
                        $scope.Salud.consumeMedicament = $scope.person.personDataField[z].response;
                    } else if ($scope.person.personDataField[z].fieldDataType.name == 'surgicalOperation') {
                        $scope.Salud.surgicalOperation = $scope.person.personDataField[z].response;
                    } else if ($scope.person.personDataField[z].fieldDataType.name == 'familyArrested') {
                        $scope.Salud.familyArrested = $scope.person.personDataField[z].response;
                    } else if ($scope.person.personDataField[z].fieldDataType.name == 'pregnant') {
                        $scope.Salud.pregnant = $scope.person.personDataField[z].response;
                    }
                }

                for (var z = 0; z < $scope.person.offerer.previousJobs.length; z++) {
                    if (!$scope.person.offerer.previousJobs[1]) {
                        $scope.person.offerer.previousJobs[0].startDate = $filter('date')($scope.person.offerer.previousJobs[0].startDate, 'dd/MM/yyyy');
                        $scope.person.offerer.previousJobs[0].endDate = $filter('date')($scope.person.offerer.previousJobs[0].endDate, 'dd/MM/yyyy');
                        $scope.previousJob1 = $scope.person.offerer.previousJobs[0];
                    } else {
                        var todaypj = new Date($scope.person.offerer.previousJobs[0].startDate).getTime();
                        console.log(todaypj);
                        var todayp = new Date($scope.person.offerer.previousJobs[1].startDate).getTime();
                        console.log(todayp);
                        if (todaypj < todayp) {
                            $scope.person.offerer.previousJobs[0].startDate = $filter('date')($scope.person.offerer.previousJobs[0].startDate, 'dd/MM/yyyy');
                            $scope.person.offerer.previousJobs[0].endDate = $filter('date')($scope.person.offerer.previousJobs[0].endDate, 'dd/MM/yyyy');
                            $scope.previousJob2 = $scope.person.offerer.previousJobs[0];
                            $scope.person.offerer.previousJobs[1].startDate = $filter('date')($scope.person.offerer.previousJobs[1].startDate, 'dd/MM/yyyy');
                            $scope.person.offerer.previousJobs[1].endDate = $filter('date')($scope.person.offerer.previousJobs[1].endDate, 'dd/MM/yyyy');
                            $scope.previousJob1 = $scope.person.offerer.previousJobs[1];
                        } else {
                            $scope.person.offerer.previousJobs[0].startDate = $filter('date')($scope.person.offerer.previousJobs[0].startDate, 'dd/MM/yyyy');
                            $scope.person.offerer.previousJobs[0].endDate = $filter('date')($scope.person.offerer.previousJobs[0].endDate, 'dd/MM/yyyy');
                            $scope.previousJob1 = $scope.person.offerer.previousJobs[0];
                            $scope.person.offerer.previousJobs[1].startDate = $filter('date')($scope.person.offerer.previousJobs[1].startDate, 'dd/MM/yyyy');
                            $scope.person.offerer.previousJobs[1].endDate = $filter('date')($scope.person.offerer.previousJobs[1].endDate, 'dd/MM/yyyy');
                            $scope.previousJob2 = $scope.person.offerer.previousJobs[1];
                        }
                    }


                }

                GenericService.getByURL("Person/"+$scope.person.id+"/getFilesInfornet")
                    .then(function (result) {
                        console.log("datos *********------------");
                        console.log(result);
                        if(result.data!=""){
                            $scope.filesInfornet = result.data;
                            if($scope.filesInfornet.length>0){
                                for(var a in $scope.filesInfornet){
                                    if($scope.filesInfornet[a].attachment!=null){
                                        $scope.filesInfornet[a].attachment=ConstanteService.urlServerUploadFiles+"/resources/"+$scope.filesInfornet[a].attachment
                                    }

                                }
                            }
                        }
                    });

                getAllCountrys();
                $scope.getAllStates('birth');
                $scope.getAllStates('ident');
                $scope.getAllStates('address');
                $scope.getAllCitys('birth');
                $scope.getAllCitys('address');
                $scope.getAllCitys('ident');
                $scope.getAllRelationShipType();


            });
    }

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

    $scope.menuSeleccionado="";
    $scope.mDatosGenerales=false;
    $scope.mIdentificacion=false;
    $scope.mTimeLine=true;
    $scope.mAreaInteres=false;

    $scope.mFamiliares=false;
    $scope.mEmergencias=false;
    $scope.mEstudiosRealizados=false;
    $scope.mEmpleosAnteriores=false;
    $scope.mInvestigacionInfornet=false;
    $scope.mReferencias=false;
    $scope.MenuURL="";
    $scope.URLBase="Modulo/Reclutamiento/Offerer/";
    $scope.getDataByMenu=function(menu,url){
        $scope.MenuURL=$scope.URLBase+url+".html";
        console.log($scope.MenuURL);
        $scope.menuSeleccionado=menu;
    };

    $scope.getDataByMenu('Análisis del Oferente','AnalisisOferente');

    getReview($scope.OffererResult.offererid);
    getOfferer($scope.OffererResult.offererid);

    $scope.getData = function () {

        OffererResult = $scope.OffererResult;
        $modalInstance.close(OffererResult);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.trasladaVisualHur=function(obj){
        console.log(obj);
        bootbox.confirm("Esta seguro de querer trasladar este oferente a Visual hur", function(result){
                if(result && !obj.codigooferentevh){
                    GenericService.getByURL("Offerer/" + obj.offererid+"/trasladaVH")
                        .then(function (response) {
                            //$scope.review=response.data;
                            console.log(response.data);
                            if (response.status == '200' || response.status == '201') {
                                $scope.OffererResult.codigoOferenteVH=response.data.codigoOferenteVH
                                bootbox.alert("Codigo de Oferente " + $scope.OffererResult.codigoOferenteVH + " Actualizado");
                            }else{
                                bootbox.alert(response.statusText);
                            }

                        });
                    console.log($scope.OffererResult);
                }else{
                    bootbox.alert("Este Proceso no se pudo completar");
                }
            }
        );
    };

    $scope.getAllRelationShipType = function () {
        GenericService.allRelationShipType()
            .then(function (result) {
                $scope.relationShipTypeAll = result.data;
            });
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
        $scope.familiaSelected = -1;
        OffererService.updateFamily($scope.person.offerer.id + '/Family', $scope.familiares)
            .then(function (result) {
                console.log(result.data);
                $scope.familiares = result.data;
                //        UserService.setCurrentUser($scope.currentUser);
                // $scope.messageResponse.message = result.status + ' ' + result.statusText;
                //console.log("Resp " + $scope.messageResponse.message);
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
                console.log($scope.familiares);
                console.log($scope.Family);
                $scope.familiares
                //$scope.currentUser.userAccount.person.offerer.offererFamily.push($scope.Family);
                for (var x = 0; x < $scope.familiares.length; x++) {
                    if ($scope.familiares[x].birthDate && $scope.familiares[x].birthDate != null) {
                        var fechax = $filter('date')($scope.familiares[x].birthDate, 'dd/MM/yyyy');
                        var fecha = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(fechax);
                        var today = new Date(parseInt(fecha[3], 10), parseInt(fecha[2], 10) - 1, parseInt(fecha[1], 10));
                        $scope.familiares[x].birthDate = today;
                    }
                }
                console.log($scope.familiares);
                OffererService.updateFamily($scope.person.offerer.id + '/Family', $scope.familiares)
                    .then(function (result) {
                        console.log(result.data);
                        if (result.status == '200' || result.status == '201') {
                            $scope.familiares = result.data;
                        }
                    });
            }
        } else {
            bootbox.alert("Datos Incompletos!!!");
        }
        $scope.Family = {};
        $scope.familiaSelected = -1;
    };

    $scope.offererStatus={};
    $scope.offererStatusReason={};
    var status={};
    $scope.OffererStatusUpdate = function () {
        status=angular.toJson($scope.offererStatus);
        console.log(status);
        console.log($scope.offererStatus);
        if($scope.offererStatus.offererStatusReason && $scope.offererStatus.offererStatusReason.length>0){
            $scope.offererStatusReason={};
        }else{
            $scope.saveChangeStatusOfferer();
        }
    };
    $scope.prueba=null;
    $scope.saveChangeStatusOfferer=function(){
        console.log(status);
    };

    $scope.confirmReferencePreviousJob = function (obj) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'confirmReferencePreviousJob.html',
                controller: 'ConfirmReferencePreviousJobCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    objData: function () {
                        return obj;
                    }
                }
            });

            modalInstance.result.then(function (objData) {
                $scope.objData = objData;
                PreviousJobsService.update(objData.previousJobs.id+"/confirm", objData)
                    .then(function (result){
                        console.log(result);
                        if (result.status == '200' || result.status == '201') {
                            bootbox.alert("Confirmado exitosamente!!");
                        }else{
                            bootbox.alert(result.status + ' ' + result.statusText);
                            return false;
                        }
                    });

            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });


            if(1==1){
                return false;
            }


    };



}]);

RRHH.controller('ActualizarEstadoOferenteInstanceCtrl',['$scope','$modalInstance','OffererReview','$translatePartialLoader','$translate','GenericService','$filter', function ($scope, $modalInstance, OffererReview,$translatePartialLoader,$translate,GenericService,$filter) {
    $scope.OffererReview=OffererReview;
    $scope.newStatus={id:null,name:null,nextStatus:null};
    $scope.offererStatus={};
    $scope.offererStatusReason={};
    $scope.fnSaveStatus = function () {
        console.log($scope.OffererReview);
        OffererReview=$scope.OffererReview;
        $modalInstance.close(OffererReview);
    };
    $scope.statusAll=[];
    $scope.newstatusAll=[];
    $scope.getStatusOfferer = function () {
        if($scope.OffererReview){
            GenericService.getByURL("OffererStatus/list")
                .then(function (response) {
                    console.log(response.data);
                    if(response.data){
                        $scope.statusAll=response.data;
                        for(var x in $scope.statusAll){
                            if(!$scope.statusAll[x].nextStatus){
                                $scope.newstatusAll.push($scope.statusAll[x]);
                            }
                        }
                        if($scope.newstatusAll){
                            $scope.statusAll=$scope.newstatusAll;
                        }
                    }
                })
        }
    };

    $scope.getStatusOfferer();

    $scope.cerrar = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

RRHH.controller('ReviewsOffererEvaluationInstanceCtrl',['$scope','$translatePartialLoader','$translate','GenericService','$filter', function ($scope,$translatePartialLoader,$translate,GenericService,$filter) {
    $scope.OffererEvaluations=[];
    $scope.EvaluationsType=[];
    $scope.OffererEvaluation={id:null,evaluationType:null,evaluatorInternal:null,offerer:null,ratingFinal:null,weightingFinal:null};
    $scope.OffererEvaluation.offerer=$scope.person.offerer;
    $scope.OffererEvaluation.offerer.previousJobs=null;
    $scope.getOffererEvaluations = function () {
        if($scope.OffererReview){
            GenericService.getByURL("OffererEvaluation/byOfferer/"+$scope.person.offerer.id)
                .then(function (response) {
                    console.log(response.data);
                    if(response.data){
                        $scope.OffererEvaluations=response.data;
                    }
                })
        }
    };
    $scope.getEvaluationsType = function () {
        if($scope.OffererReview){
            GenericService.getByURL("EvaluationType/")
                .then(function (response) {
                    console.log(response.data);
                    if(response.data){
                        $scope.EvaluationsType=response.data;
                    }
                });
        }
    };
    $scope.getOffererEvaluations();
    $scope.getEvaluationsType();

    $scope.saveRow=function(){
        console.log($scope.OffererEvaluation);
        GenericService.postByURL("OffererEvaluation/",$scope.OffererEvaluation)
            .then(function (response) {
                console.log(response.data);
                $scope.OffererEvaluation={id:null,evaluationType:null,evaluatorInternal:null,offerer:null,ratingFinal:null,weightingFinal:null};
                $scope.OffererEvaluation.offerer=$scope.person.offerer;
                $scope.OffererEvaluation.offerer.previousJobs=null;
                $scope.getOffererEvaluations();
            });
    };

    $scope.removeRow=function(itemId){
        console.log($scope.OffererEvaluation);
        GenericService.deleteByURL("OffererEvaluation",itemId)
            .then(function (response) {
                console.log(response.data);
                $scope.getOffererEvaluations();
            });
    };

}]);


RRHH.controller('ConfirmReferencePreviousJobCtrl',['$scope','$modalInstance','objData','$translatePartialLoader','$translate','GenericService','PreviousJobsService','$state','$filter', function ($scope, $modalInstance, objData,$translatePartialLoader,$translate,GenericService,PreviousJobsService,$state,$filter) {
    $translatePartialLoader.addPart('General');
    $translate.refresh();
    console.log(objData);
    $scope.objData=objData;
    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.objData.startDate);
    var fechaInicio = new Date(parseInt(fechaI[3], 10), parseInt(fechaI[2], 10) - 1, parseInt(fechaI[1], 10));
    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.objData.endDate);
    var fechaFin = new Date(parseInt(fechaF[3], 10), parseInt(fechaF[2], 10) - 1, parseInt(fechaF[1], 10));
    $scope.newObj={previousJobs:{id: parseInt(objData.id,10)},fullNameContactReference:'', jobContactReference:'',causeRetirement:$scope.objData.causeRetirement,job:$scope.objData.job,chief:$scope.objData.chief,salary:$scope.objData.salary,phone:$scope.objData.phone,startDate:fechaInicio,endDate:fechaFin,rehire:'',becauseRehire:'', supervise:'', performance:''};
    $scope.regExps = {
        msjRequired: 'DATO REQUERIDO.',
        firstName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        middleName: {exp: /^[A-Za-záéíóúñÁÉÍÓÚÑ]{2,}([\s][A-Za-záéíóúñÁÉÍÓÚÑ]{2,})*$/, message: 'Unicamente debe ingresar letras.'},
        decimal: {exp: /^[1-9]+[0-9]*(.[0-9]+)?$/, message: 'El valor ingresado no coincide con 1234.56'},
        number: {exp: /^[1-9]+[0-9]*$/, message: 'El valor ingresado no coincide con 1234'},
        numberOnly: {exp: /^[0-9]+$/, message: 'El valor ingresado no coincide con 1234'},
        cui: {exp: /^[1-9]+[0-9]*([0-9]+)+$/, message: 'El valor ingresado no coincide con 1234'},
        phone: {exp: /^([0-9]+){8,}$/, message: 'El Numero debe tener mas de 7 digitos.'},
        date: {exp: /^(?:(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:0?[1-9]|1[0-2]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:31(\/|-)(?:0?[13578]|1[02]))|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(29(\/|-)0?2)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/, message: 'El Numero debe tener mas de 7 digitos.'},
        fullName: {exp: /([a-zA-Z\-]+){3,}\s+([a-zA-Z\-]+){3,}/, message: 'El Numero debe tener mas de 7 digitos.'}
    };

    GenericService.getByURL("PreviousJobs/"+objData.id+"/confirm")
        .then(function (result) {
            if(result.data!=""){
                $scope.newObj = result.data;
            }
        });

    $scope.outputs = {};
    $scope.getDataPreviousJob = function () {
        console.log($scope.newObj);
        if(($scope.newObj.previousJobs==null || $scope.newObj.previousJobs=="") || ($scope.newObj.fullNameContactReference==null || $scope.newObj.fullNameContactReference=="") || ($scope.newObj.jobContactReference==null || $scope.newObj.jobContactReference=="") || ($scope.newObj.job==null || $scope.newObj.job=="") || ($scope.newObj.salary==null || $scope.newObj.salary=="") || ($scope.newObj.startDate==null || $scope.newObj.startDate=="") || ($scope.newObj.endDate==null || $scope.newObj.endDate=="") || ($scope.newObj.phone==null || $scope.newObj.phone=="") || ($scope.newObj.chief==null || $scope.newObj.chief=="") || ($scope.newObj.causeRetirement==null || $scope.newObj.causeRetirement=="") || ($scope.newObj.rehire==null || $scope.newObj.rehire=="")){
            return false;
        }
        $modalInstance.close($scope.newObj);
    };

    $scope.cancelPreviousJob = function () {
        $scope.newObj={previousJobs:{id: parseInt(objData.id,10)},fullNameContactReference:'', jobContactReference:'',causeRetirement:$scope.objData.causeRetirement,job:$scope.objData.job,chief:$scope.objData.chief,salary:$scope.objData.salary,phone:$scope.objData.phone,startDate:fechaInicio,endDate:fechaFin,rehire:'',becauseRehire:'', supervise:'', performance:''};
        $modalInstance.dismiss('cancel');
    };
}]);

RRHH.controller('RequisitionController', ['$scope','$rootScope', '$translatePartialLoader', '$translate', 'GenericService','ConstanteService','$filter','$modal', function ($scope,$rootScope,$translatePartialLoader, $translate, GenericService,ConstanteService,$filter,$modal) {
    $scope.requisitions=[];
    $scope.workPlaceStatusList=[];
    $scope.locations=[];
    //$scope.newPersonalRequisition={};
    $scope.newLocation=null;
    $scope.Units=[];
    $scope.WorkPlaces=[];
    $scope.regExps=ConstanteService.regExps;
    $scope.PersonalRequisition={id:null,dateCreated:null,active:true,startDate:null,endDate:null,employee:null,workPlaceStatus:null,workPlace:null,personalRequisitionOfferers:[],status:{id:1}};

    function getRequisitions(){
        GenericService.getByURL("PersonalRequisition")
            .then(function (result) {
                console.log(result.data);
                $scope.requisitions = result.data;
                if($scope.requisitions.length>0){
                    $scope.PersonalRequisition=$scope.requisitions[0];
                }
            });
    };


    $scope.PersonalRequisition.startDate=new Date();
    $scope.PersonalRequisition.endDate=new Date();
    $scope.newPersonalRequisition=function(){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalPersonalRequisition.html',
            controller: 'RequisitionControllerInstance',
            size: 'xxl',
            backdrop: 'static',
            resolve: {
                PersonalRequisition: function () {
                    return $scope.PersonalRequisition;
                }
            }
        });
        modalInstance.result.then(function (PersonalRequisition) {
            $scope.PersonalRequisition = PersonalRequisition;
            console.log($scope.PersonalRequisition);
            //$scope.PersonalRequisition.personalRequisitionOfferers=null;
            if($scope.PersonalRequisition.personalRequisitionOfferers==null){
                $scope.PersonalRequisition.personalRequisitionOfferers=[];
            }
            GenericService.postByURL("PersonalRequisition",$scope.PersonalRequisition)
                .then(function (result) {
                    console.log(result.data);
                    $scope.PersonalRequisition=result.data;
                    getRequisitions();
                });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    getRequisitions();

}]);

RRHH.controller('RequisitionControllerInstance',['$scope','$modalInstance','PersonalRequisition','$translatePartialLoader','$translate','GenericService','$filter','$modal', function ($scope, $modalInstance, PersonalRequisition,$translatePartialLoader,$translate,GenericService,$filter,$modal) {
    $scope.PersonalRequisition=PersonalRequisition;
    $scope.personalRequisitionOfferers=[];
    $scope.save = function () {
        console.log($scope.PersonalRequisition);
        $modalInstance.close($scope.PersonalRequisition);
    };
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function getPartners(){
        GenericService.getByURL("Partner")
            .then(function (result) {
                console.log(result.data);
                $scope.partnerList = result.data;
            });
    };

    function getWorkPlaceStatus(){
        GenericService.getByURL("WorkPlaceStatus")
            .then(function (result) {
                console.log(result.data);
                $scope.workPlaceStatusList = result.data;
            });
    };
    $scope.getLocations=function(){
        GenericService.getByURL("Location/byPartner/"+$scope.newPartner.id)
            .then(function (result) {
                console.log(result.data);
                $scope.locations = result.data;
            });
    }
    $scope.getUnitByLocation=function(){
        GenericService.getByURL("Location/"+$scope.newLocation.id)
            .then(function (result) {
                console.log(result.data);
                $scope.Units = result.data.units;
                $scope.newUnit=null;
                $scope.newWorkPlace=null;
            });
    }
    $scope.getWorkPlaceByLocationAndUnit=function(){
        var locationId=$scope.newLocation.id;
        var unitId=$scope.newUnit.id;
        var statusId=$scope.PersonalRequisition.workPlaceStatus.id;
        GenericService.getByURL("WorkPlace/findBy?locationId="+locationId+"&unitId="+unitId+"&workPlaceStatusId="+statusId)
            .then(function (result) {
                console.log(result.data);
                $scope.WorkPlaces = result.data;
            });
    }

    getPartners();
    getWorkPlaceStatus();
    //getLocations();
    $scope.ListOfferers=[];
    $scope.getOfferers=function(type){
        if(type==0){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalOffererM.html',
                controller: 'OffererControllerInstance',
                size: 'xl',
                backdrop: 'static',
                resolve: {
                    ListOfferers: function () {
                        return $scope.ListOfferers;
                    }
                }
            });
            modalInstance.result.then(function (ListOfferers) {
                $scope.ListOfferers = ListOfferers;
                console.log($scope.ListOfferers);
                for(var x=0;x<$scope.ListOfferers.length;x++){
                    var PersonalRequisitionOfferer={personalRequisition:null,offerer:{id:$scope.ListOfferers[x].offererid},offererEmployee:null,employee:null,status:{id:1}};
                    $scope.personalRequisitionOfferers.push(PersonalRequisitionOfferer);
                }
                $scope.PersonalRequisition.personalRequisitionOfferers=$scope.personalRequisitionOfferers;
                console.log($scope.PersonalRequisition);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }else{
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalOffererA.html',
                controller: 'OffererControllerInstance',
                size: 'xl',
                backdrop: 'static',
                resolve: {
                    ListOfferers: function () {
                        return $scope.ListOfferers;
                    }
                }
            });
            modalInstance.result.then(function (ListOfferers) {
                $scope.ListOfferers = ListOfferers;
                console.log($scope.ListOfferers);
                for(var x=0;x<$scope.ListOfferers.length;x++){
                    var PersonalRequisitionOfferer={personalRequisition:null,offerer:{id:$scope.ListOfferers[x].offererid},offererEmployee:null,employee:null,status:null};
                    $scope.personalRequisitionOfferers.push(PersonalRequisitionOfferer);
                }
                $scope.PersonalRequisition.personalRequisitionOfferers=$scope.personalRequisitionOfferers;
                console.log($scope.PersonalRequisition);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

    }
}]);

RRHH.controller('OffererControllerInstance',['$scope','$modalInstance','ListOfferers','$translatePartialLoader','$translate','GenericService','$filter','ConstanteService', function ($scope, $modalInstance, ListOfferers,$translatePartialLoader,$translate,GenericService,$filter,ConstanteService) {
    $scope.ListOfferers=ListOfferers;
    $scope.addOfferer=function(id){
        for(var x=0;x<$scope.offerers.length;x++){
            if($scope.offerers[x].offererid && $scope.offerers[x].offererid==id){
                $scope.ListOfferers.push($scope.offerers[x]);
                ConstanteService.findAndRemove($scope.offerers,'offererid',$scope.offerers[x].offererid);
            }
        }
    }
    $scope.delOfferer=function(id) {
        var existe=false;
        for(var x=0;x<$scope.ListOfferers.length;x++){
            if($scope.ListOfferers[x].offererid && $scope.ListOfferers[x].offererid==id){
                for(var y=0;y<$scope.offerers.length;y++){
                    if($scope.offerers[y].offererid && $scope.offerers[y].offererid==id){
                        existe=true;
                    }
                }
                if(existe==false){
                    $scope.offerers.push($scope.ListOfferers[x]);
                }
                ConstanteService.findAndRemove($scope.ListOfferers,'offererid',$scope.ListOfferers[x].offererid);
            }
        }
    }
    $scope.save = function () {
        console.log($scope.ListOfferers);
        $modalInstance.close($scope.ListOfferers);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.urlServerFiles = ConstanteService.urlServerFiles;
    $scope.offerers=[];
    $scope.offererName=null;
    $scope.checked=false;
    $scope.searchFull=function(type){
        console.log(type);
        var params="";
        if(type==0){ //Single
            params+="?offererName="+$scope.offererName;
            GenericService.getByURL("Offerer/OffererByStatus/" + 1 +params)
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
            params+="?offererName="+name+"&gender="+$scope.gender+"&maritalStatus="+$scope.maritalStatus+"&edad="+$scope.rangoEdad+"&levelStudies="+$scope.levelStudies+"&offererid="+$scope.offererId;
            GenericService.getByURL("Offerer/OffererByStatus/" + 1+params)
                .then(function (response) {
                    console.log(response);
                    $scope.offerers = response.data;
                    $scope.checked = false;
                });
        }
    };

    $scope.searchFull(0);

    $scope.toggle = function(){
        $scope.checked = !$scope.checked
        if($scope.checked){
            getStudiesLevels();
        }
    };

    $scope.levelStudies="";
    $scope.studiesLevels=[];
    function getStudiesLevels() {
        GenericService.getByURL("StudiesLevelGrade/byUserAccount/1")
            .then(function (response) {
                console.log(response);
                $scope.studiesLevels=response.data;
            });
    };


}]);

RRHH.controller("PreviousJobsAndReferenceController", [ '$scope', 'OffererService', 'PersonService', 'GenericService', '$state', '$filter', 'UserService', 'ConstanteService', function ($scope, OffererService, PersonService, GenericService, $state, $filter, UserService, ConstanteService) {
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
    $scope.savePreviousJobsAndReferences = function () {
        console.log('Guardando Cambios ... savePreviousJobsAndReferences');
        console.log($scope.currentUser.userAccount.person);
        $scope.PreviousJobsTemp = [];

        /*
            if ($scope.previousJob1) {
                if ($scope.previousJob1.company) {
                    if($scope.previousJob1.salary){
                        var salary=$scope.previousJob1.salary+"";
                        if(salary.indexOf(",") > -1){
                            $scope.previousJob1.salary=$scope.previousJob1.salary.replace(',','');
                        }
                    }
//                    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob1.startDate);
                    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($filter('date')($scope.previousJob1.startDate, 'dd/MM/yyyy'));
                    var fechaInicio = new Date(parseInt(fechaI[3], 10), parseInt(fechaI[2], 10) - 1, parseInt(fechaI[1], 10));
                    console.log(fechaInicio);
//                    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob1.endDate);
                    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($filter('date')($scope.previousJob1.endDate, 'dd/MM/yyyy'));
                    var fechaFin = new Date(parseInt(fechaF[3], 10), parseInt(fechaF[2], 10) - 1, parseInt(fechaF[1], 10));
                    console.log(fechaFin);
                    var data = {causeRetirement: $scope.previousJob1.causeRetirement, chief: $scope.previousJob1.chief, company: $scope.previousJob1.company, endDate: fechaFin, job: $scope.previousJob1.job, phone: $scope.previousJob1.phone, salary: $scope.previousJob1.salary, startDate: fechaInicio, id: $scope.previousJob1.id};
                    $scope.PreviousJobsTemp.push(data);
                }
            }

            if ($scope.previousJob2) {
                if ($scope.previousJob2.company) {
                    if($scope.previousJob2.salary){
                        var salary=$scope.previousJob2.salary+"";
                        if(salary.indexOf(",") > -1){
                            $scope.previousJob2.salary=$scope.previousJob2.salary.replace(',','');
                        }
                    }
//                    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob2.startDate);
                    var fechaI = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($filter('date')($scope.previousJob2.startDate, 'dd/MM/yyyy'));
                    var fechaInicio = new Date(parseInt(fechaI[3], 10), parseInt(fechaI[2], 10) - 1, parseInt(fechaI[1], 10));
                    console.log(fechaInicio);
//                    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($scope.previousJob2.endDate);
                    var fechaF = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec($filter('date')($scope.previousJob2.endDate, 'dd/MM/yyyy'));
                    var fechaFin = new Date(parseInt(fechaF[3], 10), parseInt(fechaF[2], 10) - 1, parseInt(fechaF[1], 10));
                    console.log(fechaFin);
                    var data = {causeRetirement: $scope.previousJob2.causeRetirement, chief: $scope.previousJob2.chief, company: $scope.previousJob2.company, endDate: fechaFin, job: $scope.previousJob2.job, phone: $scope.previousJob2.phone, salary: $scope.previousJob2.salary, startDate: fechaInicio, id: $scope.previousJob2.id};
                    if($scope.previousJob1){
                        if($scope.previousJob1==$scope.previousJob2){
                            return bootbox.alert("Los datos ingresados en los empleos no deben ser iguales");
                            $scope.previousJob2={};
                        }else{
                            $scope.PreviousJobsTemp.push(data);
                        }
                    }

                }
            }
            */

            $scope.objectTemp = $scope.PreviousJobsTemp;
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
                            return true;
                        } else {
                            bootbox.alert(result.status + ' ' + result.statusText);
                            return false;
                        }
                    });
            } else {
                alert("Hola Mundo");
            }
            //$state.go('/CV/dashboard');

    };

    function getOfferer() {
        console.log($scope.offererid);
        GenericService.getByURL("PreviousJobs/byOfferer/"+$scope.offererid)
            .then(function(result){
                console.log(result.data);
            });
    }

    getOfferer();
}]);

RRHH.controller("ReviewsOffererRelationEmployeeCtrl", [ '$scope', 'ConstanteService', 'GenericService', 'UserService', '$modal', 'bootbox', '$filter', '$translatePartialLoader', '$translate','OffererService', function ( $scope, ConstanteService, GenericService, UserService,  $modal, bootbox, $filter, $translatePartialLoader, $translate, OffererService) {


    $scope.Employee={};
    $scope.EmployeeLocation={};
    $scope.OneOffererEmployee={};
    $scope.offererEmployees = [];

    $scope.getOffererEmployeeDTO = function (){
        var id =$scope.person.offerer.id;
        GenericService.allOffererEmployeeDTO(id)
            .then(function (result){
                $scope.offererEmployees = result.data;
            });
    };
    $scope.getOffererEmployeeDTO();

    $scope.getAllRelationShipType = function () {
        GenericService.allRelationShipType()
            .then(function (result) {
                $scope.relationShipTypeAll = result.data;
            });
    };

    $scope.locationAll1= null;
    $scope.getAllLocation= function (){
        GenericService.allLocationAll()
            .then(function (result){
                $scope.locationAll1 = result.data;
            });
    };
    $scope.getAllLocation();

    $scope.getAllEmployee= function (id1) {
            if ($scope.Employee.allLocation) {
                var id = $scope.Employee.allLocation
                GenericService.allEmployeeByLocation(id)
                    .then(function (result) {
                        console.log(result);
                        $scope.employeeAll = result.data;
                    });
            }
    };
    $scope.getAllEmployee();

    $scope.saveOneRelationOffererEmployee = function (){
        $scope.empleado={id:0};
        console.log($scope.Employee.relationShipType);
        console.log($scope.Employee.employee);
        var     employee = $filter('filter')($scope.employeeAll,   {employeeId: parseInt($scope.Employee.employee)}, true );
        var relationship = $filter('filter')($scope.relationShipTypeAll, {code: $scope.Employee.relationShipType}, true);
        if(employee){
            $scope.empleado.id=employee[0].employeeId;
        }
        console.log(relationship[0]);
        $scope.Employee.employee = $scope.empleado;
        $scope.Employee.relationShipType = relationship[0];

        if ($scope.Employee.employee && $scope.Employee.relationShipType) {
            console.log("$scope.Employee*********************");
            console.log($scope.Employee);
            var temp = {employee: $scope.Employee.employee, relationShipType: $scope.Employee.relationShipType };
            $scope.Employee = temp;
            console.log($scope.Employee);

        OffererService.addOffererEmployee($scope.person.offerer.id + '/OffererEmployeeOne', $scope.Employee)
                .then(function (result) {
                    console.log(result.data);
                    if (result.status == '200' || result.status == '201') {
                        $scope.offererEmployees = result.data;
                    }
                });
        }else {
            bootbox.alert("Datos Incompletos!!!");
        }
        $scope.EmployeeLocation=[];
        $scope.Employee=[];

    }

    $scope.editRelationOffererEmployee = function (index) {
        console.log(index);
        $scope.relationSelected = index;
        $scope.Employee = $scope.offererEmployees[index];
        var temp = {allLocation: $scope.Employee.locationId, employee: $scope.Employee.employeeId, relationShipType: $scope.Employee.relationShipType.code};
        $scope.Employee = temp;
        $scope.getAllEmployee();
    };

    $scope.removeRelationOffererEmployee = function (index) {
//        $scope.offererEmployees.splice(index, 1);
        $scope.employeeSample={id:0};
        $scope.employeeOffererSelected = -1;
        $scope.employeeSample.id=$scope.offererEmployees[index].employeeId;
        $scope.Employee.employee = $scope.employeeSample;
        $scope.Employee.relationShipType = $scope.offererEmployees[index].relationShipType;
        var temp = {employee: $scope.Employee.employee, relationShipType: $scope.Employee.relationShipType };
        $scope.Employee = temp;
        console.log($scope.Employee);
        OffererService.stateFalseOffererEmployee($scope.person.offerer.id + '/OffererEmployeeState', $scope.Employee)
            .then(function (result) {
                console.log(result.data);
                if (result.status == '200' || result.status == '201') {
                    $scope.offererEmployees = result.data;

                }
                //        UserService.setCurrentUser($scope.currentUser);
                // $scope.messageResponse.message = result.status + ' ' + result.statusText;
                //console.log("Resp " + $scope.messageResponse.message);
            });
        $scope.Employee=[];
    };


}]);