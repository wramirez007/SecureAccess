/**
 * Created by wramirez on 31/01/2015.
 */
//filtro para poner todo el texto en mayúsculas
ACS.filter("toUpper", function(){
    return function(text){
        if(text != null){
            return text.toUpperCase();
        }
    }
});

ACS.filter("fullName", function(){
    return function(text){
        if(text != null){
            text=text.replace(/,+/g, ' ');
            text=text.replace(/;+/g, ' ');
            return text;
        }
    }
});

ACS.filter('fromNow', function() {
    return function(date) {
        moment.locale("es");
        return moment(date).fromNow();
    }
});

ACS.filter('moment', [
    function () {
        return function (date, method) {
            moment.locale("es");
            var momented = moment(date);
            return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
        };
    }
]);

ACS.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

ACS.filter('propsFilter', function() {
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