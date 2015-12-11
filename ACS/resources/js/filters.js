/**
 * Created by wramirez on 31/01/2015.
 */
//filtro para poner todo el texto en mayúsculas
RRHH.filter("toUpper", function(){
    return function(text){
        if(text != null){
            return text.toUpperCase();
        }
    }
});

RRHH.filter("fullName", function(){
    return function(text){
        if(text != null){
            text=text.replace(/,+/g, ' ');
            text=text.replace(/;+/g, ' ');
            return text;
        }
    }
});

 RRHH.filter('fromNow', function() {
    return function(date) {
        moment.locale("es");
        return moment(date).fromNow();
    }
});

RRHH.filter('moment', [
    function () {
        return function (date, method) {
            moment.locale("es");
            var momented = moment(date);
            return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
        };
    }
]);

RRHH.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);
/*
RRHH.filter('flatten' , function(){
    return function(array){
        return array.reduce(function(flatten, group){
            group.items.forEach(function(item){
                flatten.push({ group: group.name , name: item.name})
            })
            return flatten;
        },[]);
    }
})*/

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