/**
 * Created by wramirez on 27/05/2015.
 */
angular.module('angularTranslateApp', ['pascalprecht.translate'])
    .config(function($translateProvider, $translatePartialLoaderProvider ) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'translations/{lang}/{part}.json'
        });
        $translateProvider.preferredLanguage('es-GT');
    });