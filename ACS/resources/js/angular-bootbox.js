/**
 * Created by wramirez on 24/05/2015.
 */
'use strict';
angular.module('angular-bootbox', []).factory('bootbox', [function () {
    return bootbox;
}]).provider('$bootbox', function () {
    return {
        setDefaults: function (options) {
            bootbox.setDefaults(options);
        },
        $get: function () {
            return {

            }
        }
    }
});