/**
 * Created by wramirez on 05/02/2015.
 */
'use strict';


angular.module('angularOauth', []).

    provider('Token', function () {
        var urlOAuth="http://localhost:63342"; //DESARROLLO
        //var urlOAuth="http://pruebas.megapaca.gt"; //PRUEBAS
        //var urlOAuth="http://www.mprh.com.gt"; //PRODUCCION
        /**
         * Given an flat object, returns a query string for use in URLs.  Note
         * that for a given object, the return value may be.
         *
         * @example
         * <pre>
         // returns 'color=red&size=large'
         objectToQueryString({color: 'red', size: 'large'})
         * </pre>
         *
         * @param {Object} obj A flat object containing keys for such a string.
         * @returns {string} A string suitable as a query string.
         */
        var objectToQueryString = function (obj) {
            var str = [];
            angular.forEach(obj, function (value, key) {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            });
            return str.join("&");
        };

        // This response_type MUST be passed to the authorization endpoint using
        // the implicit grant flow (4.2.1 of RFC 6749).
        var RESPONSE_TYPE = 'token';

        // Create a special object for config fields that are required and missing.
        // If any config items still contain it when Token is used, raise an error.
        var REQUIRED_AND_MISSING = {};

        var config = {
            clientId: REQUIRED_AND_MISSING,
            redirectUri: REQUIRED_AND_MISSING,
            authorizationEndpoint: REQUIRED_AND_MISSING,
            localStorageName: 'accessToken',
            verifyFunc: REQUIRED_AND_MISSING,
            scopes: []
        };

        var provider;
        var params;

        this.extendConfig = function (configExtension) {
            config = angular.extend(config, configExtension);
        };

        this.$get = function ($q, $http, $window, $rootScope) {
            var requiredAndMissing = [];
            angular.forEach(config, function (value, key) {
                if (value === REQUIRED_AND_MISSING) {
                    requiredAndMissing.push(key);
                }
            });

            if (requiredAndMissing.length) {
                throw new Error("TokenProvider is insufficiently configured.  Please " +
                    "configure the following options using " +
                    "TokenProvider.extendConfig: " + requiredAndMissing.join(", "))
            }

            if (!config.clientId) {
                throw new Error("clientId needs to be configured using TokenProvider.");
            }

            var getParams = function () {
                // TODO: Facebook uses comma-delimited scopes. This is not compliant with section 3.3 but perhaps support later.
                //console.log("getParams " + provider);
                params = {response_type: config.responseType || RESPONSE_TYPE, client_id: config.clientId, redirect_uri: config.redirectUri, scope: config.scopes.join(" ")};
                if (provider == 'google') {
                    params = {
                        response_type: config.responseType || RESPONSE_TYPE,
                        client_id: "1020728751709-3s6cff09m7iil4jpbm5rstjrscpo9h9m.apps.googleusercontent.com",
                        redirect_uri: urlOAuth+'/MPRH/oauth2callback.html',
                        scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.profile"].join(" "),
                        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',localStorageName:'accessToken'};
                } else if (provider == 'facebook') {
                    params = {
                        response_type: config.responseType || RESPONSE_TYPE,
                        client_id: "1632285350338372",redirect_uri: urlOAuth+'/MPRH/oauth2callback.html',
                        scope: 'email',authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',localStorageName:'accessToken'};
                }else if (provider == 'linkedin') {
                    params = {response_type: 'code',client_id: "771mydpqxose5q",
                        redirect_uri: urlOAuth+'/MPRH/oauth2callback.html',state:'DCEeFWf45wramirezA53sdfKef424',
                        scope: ["r_basicprofile", "r_emailaddress","w_share"].join(" "),client_secret:'NYlnYvLBcXpx3zXV',
                        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',localStorageName:'accessToken'};
                }else if (provider == 'yahoo') {
                    params = {response_type: 'code',client_id: "dj0yJmk9bks3czhORXB1Slo2JmQ9WVdrOU5HOHhibmRuTnpnbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wNw--",
                        redirect_uri: urlOAuth+'/MPRH/oauth2callback.html',client_secret: '6c0ce580b382621db19b97b57488fa8ad956c749',language:"en-us",
                        authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',localStorageName:'accessToken'};
                }else if (provider == 'live') {
                    params = {response_type: 'code',client_id: "0000000040155714",
                        redirect_uri: urlOAuth+'/MPRH/oauth2callback.html',
                        scope: ["r_basicprofile", "r_emailaddress","w_share","r_fullprofile"].join(" "),
                        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',localStorageName:'accessToken'};
                }else if (provider == 'twitter') {
                    params = {response_type: 'code',client_id: "771mydpqxose5q",
                        redirect_uri: urlOAuth+'/MPRH/oauth2callback.html',
                        scope: ["r_basicprofile", "r_emailaddress","w_share","r_fullprofile"].join(" "),
                        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',localStorageName:'accessToken'};
                }
                config.authorizationEndpoint=params.authorizationEndpoint;
                //console.log(params);
                return params;
            };

            var buildAuthorizationUrl = function (extraParams) {
                var params = angular.extend(getParams(), extraParams);
                return config.authorizationEndpoint + '?' + objectToQueryString(params);
            }

            return {
                // TODO: get/set might want to support expiration to reauthenticate
                // TODO: check for localStorage support and otherwise perhaps use other methods of storing data (e.g. cookie)

                /**
                 * Returns the stored access token.
                 *
                 * @returns {string} The access token.
                 */
                get: function () {
                    return localStorage[config.localStorageName];
                },

                /**
                 * Persist the access token so that it can be retrieved later by.
                 *
                 * @param accessToken
                 */
                set: function (accessToken) {
                    localStorage[config.localStorageName] = accessToken;
                },

                /**
                 * Forgets the access token.
                 */
                clear: function () {
                    localStorage.removeItem(config.localStorageName);
                },

                /**
                 * Verifies that the access token is was issued for the use of the current client.
                 *
                 * @param accessToken An access token received from the authorization server.
                 * @returns {Promise} Promise that will be resolved when the authorization server has verified that the
                 *  token is valid, and we've verified that the token is passed back has audience that matches our client
                 *  ID (to prevent the Confused Deputy Problem).
                 *
                 *  If there's an error verifying the token, the promise is rejected with an object identifying the `name` error
                 *  in the name member.  The `name` can be either:
                 *
                 *    - `invalid_audience`: The audience didn't match our client ID.
                 *    - `error_response`: The server responded with an error, typically because the token was invalid.  In this
                 *      case, the callback parameters to `error` callback on `$http` are available in the object (`data`,
                 *      `status`, `headers`, `config`).
                 */
                verifyAsync: function (accessToken) {

                    var $injector = angular.injector(['ng','ngResource']);
                    return $injector.invoke(['$http', '$rootScope', '$q','$resource', function ($http, $rootScope, $q,$resource) {
                        var deferred = $q.defer();
                        var verificationEndpoint='';
                        var parametros={};
                        var method="GET";
                        if(provider=='google'){
                            verificationEndpoint = 'https://www.googleapis.com/oauth2/v1/tokeninfo';
                            parametros={access_token: accessToken};
                        }else if(provider=='facebook'){
                            //verificationEndpoint = 'https://graph.facebook.com/v2.3/oauth/access_token';
                            verificationEndpoint = 'https://graph.facebook.com/me';
                            parametros={access_token: accessToken};
                        }else if(provider=='linkedin'){
                            //method="POST";
                            verificationEndpoint = 'https://www.linkedin.com/uas/oauth2/accessToken';
                            parametros={grant_type: 'authorization_code',code:accessToken,redirect_uri:params.redirect_uri,client_id:params.client_id,client_secret:params.client_secret};
                        }else if(provider=='yahoo'){
                            verificationEndpoint = 'https://api.login.yahoo.com/oauth2/get_token';
                            parametros={access_token: accessToken};
                        }else if(provider=='live'){
                            verificationEndpoint = '';
                            parametros={access_token: accessToken};
                        }else if(provider=='twitter'){
                            verificationEndpoint = '';
                            parametros={access_token: accessToken};
                        }
                        //console.log(verificationEndpoint);
                        var req = {
                            method: method,
                            url: verificationEndpoint,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            params: parametros
                        };
                        console.log(req);
                        /*
                        var User = $resource(verificationEndpoint, {}, { });
                        User.get(parametros, function (data) {
                            alert(JSON.stringify(data));
                        });*/

                        $rootScope.$apply(function () {
                            //$http({method: method, url: verificationEndpoint, params: parametros}).
                            $http(req).
                                success(function (data) {
                                    //console.log(data);
                                    if (provider=='google' && data.audience == config.clientId) {
                                        deferred.resolve(data);
                                    }else if (provider=='facebook' || provider=='linkedin' || provider=='live') {
                                        deferred.resolve(data);
                                    } else {
                                        deferred.reject({name: 'invalid_audience'});
                                    }
                                }).
                                error(function (data, status, headers, config) {
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


                    //return config.verifyFunc(config, accessToken);
                },

                /**
                 * Verifies an access token asynchronously.
                 *
                 * @param extraParams Additional params to be appended to the query string of the request.
                 * @param popupOptions Settings for the display of the popup.
                 * @returns {Promise} Promise that will be resolved when the authorization server has verified that the
                 *  token is valid, and we've verified that the token is passed back has audience that matches our client
                 *  ID (to prevent the Confused Deputy Problem).
                 *
                 *  If there's an error verifying the token, the promise is rejected with an object identifying the `name` error
                 *  in the name member.  The `name` can be either:
                 *
                 *    - `invalid_audience`: The audience didn't match our client ID.
                 *    - `error_response`: The server responded with an error, typically because the token was invalid.  In this
                 *      case, the callback parameters to `error` callback on `$http` are available in the object (`data`,
                 *      `status`, `headers`, `config`).
                 */
                getTokenByPopup: function (extraParams, popupOptions) {
                    popupOptions = angular.extend({
                        name: 'AuthPopup',
                        openParams: {
                            width: 650,
                            height: 300,
                            resizable: true,
                            scrollbars: true,
                            status: true
                        }
                    }, popupOptions);
                    //console.log(popupOptions);
                    var deferred = $q.defer(),
                        url = buildAuthorizationUrl(extraParams),
                        resolved = false;
                    //console.log(url);
                    var formatPopupOptions = function (options) {
                        //console.log(options);
                        var pairs = [];
                        angular.forEach(options, function (value, key) {
                            if (value || value === 0) {
                                value = value === true ? 'yes' : value;
                                pairs.push(key + '=' + value);
                            }
                        });
                        return pairs.join(',');
                    };
                    var popup = window.open(url, popupOptions.name, formatPopupOptions(popupOptions.openParams));
                    //console.log(popup);
                    // TODO: binding occurs for each reauthentication, leading to leaks for long-running apps.

                    angular.element($window).bind('message', function (event) {
                        // Use JQuery originalEvent if present
                        //console.log("Entro a message");
                        //console.log(event);
                        event = event.originalEvent || event;
                        //console.log(event);
                        if (event.source == popup && event.origin == window.location.origin) {
                            //console.log("Entro a if source");
                            $rootScope.$apply(function () {
                                if (event.data.access_token) {
                                    deferred.resolve(event.data);
                                }else if(provider=='linkedin' || provider=='live'){
                                    deferred.resolve(event.data);
                                } else {
                                    deferred.reject(event.data)
                                }
                            })
                        }
                    });

                    // TODO: reject deferred if the popup was closed without a message being delivered + maybe offer a timeout

                    return deferred.promise;
                },
                getTokenInSameWindow: function (extraParams) {
                    var url = buildAuthorizationUrl(extraParams);
                    $window.location.href = url;
                },
                setProvider: function (providerNew) {
                    provider = providerNew;
                    //console.log("setProvider " + provider);
                }
            }
        }
    }).

/**
 * A controller for the redirect endpoint that inspects the URL redirected to by the authorization server and sends
 * it back to other windows using.
 */
    controller('CallbackCtrl', function ($scope, $location) {
        var urlOAuth="http://localhost:63342"; //DESARROLLO
        //var urlOAuth="http://pruebas.megapaca.gt"; //PRUEBAS
        //var urlOAuth="http://www.mprh.com.gt"; //PRODUCCION
        /**
         * Parses an escaped url query string into key-value pairs.
         *
         * (Copied from Angular.js in the AngularJS project.)
         *
         * @returns Object.<(string|boolean)>
         */
        function parseKeyValue(/**string*/keyValue) {
            //console.log("keyValue");
            //console.log(keyValue);
            //alert(keyValue);
            var obj = {}, key_value, key;
            angular.forEach((keyValue || "").split('&'), function (keyValue) {
                if (keyValue) {
                    key_value = keyValue.split('=');
                    key = decodeURIComponent(key_value[0]);
                    obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
                }
            });
            return obj;
        }

        var queryString = $location.path().substring(1);  // preceding slash omitted
        //console.log(queryString);
        //alert(JSON.stringify($location.absUrl()));
        if(queryString===''){
            //console.log("queryString "+queryString);
            queryString=$location.absUrl().replace(urlOAuth+'/MPRH/oauth2callback.html?','');
            queryString=queryString.replace('code','access_token');
        }
        //alert(JSON.stringify(queryString));
        var params = parseKeyValue(queryString);
        //console.log(queryString);
        //console.log(params);
        // TODO: The target origin should be set to an explicit origin.  Otherwise, a malicious site that can receive
        //       the token if it manages to change the location of the parent. (See:
        //       https://developer.mozilla.org/en/docs/DOM/window.postMessage#Security_concerns)

        window.opener.postMessage(params, "*");
        window.close();

    });