/**
 * Created by wramirez on 05/02/2015.
 */
'use strict';

/**
 * A module to include instead of `angularOauth` for a service preconfigured
 * for Google OAuth authentication.
 *
 * Guide: https://developers.google.com/accounts/docs/OAuth2UserAgent
 */
angular.module('facebookOauth', ['angularOauth']).

    constant('FacebookTokenVerifier', function(config, accessToken) {
        var $injector = angular.injector(['ng']);
        return $injector.invoke(['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
            var deferred = $q.defer();
            var verificationEndpoint = 'https://graph.facebook.com/v2.3/oauth/access_token';

            $rootScope.$apply(function() {
                $http({method: 'GET', url: verificationEndpoint, params: {access_token: accessToken}}).
                    success(function(data) {
                        if (data.audience == config.clientId) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject({name: 'invalid_audience'});
                        }
                    }).
                    error(function(data, status, headers, config) {
                        deferred.reject({
                            name: 'error_response',
                            data: data,
                            status: status,
                            headers: headers,
                            config: config
                        });
                    });
            });

            return deferred.promise;
        }]);
    });/*.
    config(function(TokenProvider, FacebookTokenVerifier) {
        TokenProvider.extendConfig({
            authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
            scopes: ["email"],
            verifyFunc: FacebookTokenVerifier
        });
    });*/