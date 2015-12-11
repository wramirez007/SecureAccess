/**
 * Created by wramirez on 31/01/2015.
 */
angular.module('BasicPrimitives', [], function ($compileProvider) {
    $compileProvider.directive('bpOrgDiagram', function ($compile) {
        function link(scope, element, attrs) {
            var itemScopes = [];

            var config = new primitives.orgdiagram.Config();
            angular.extend(config, scope.options);

            config.onItemRender = onTemplateRender;
            config.onCursorChanged = onCursorChanged;
            config.onHighlightChanged = onHighlightChanged;

            var chart = jQuery(element).orgDiagram(config);

            scope.$watch('options.highlightItem', function (newValue, oldValue) {
                var highlightItem = chart.orgDiagram("option", "highlightItem");
                if (highlightItem != newValue) {
                    chart.orgDiagram("option", { highlightItem: newValue });
                    chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.PositonHighlight);
                }
            });

            scope.$watch('options.cursorItem', function (newValue, oldValue) {
                var cursorItem = chart.orgDiagram("option", "cursorItem");
                if (cursorItem != newValue) {
                    chart.orgDiagram("option", { cursorItem: newValue });
                    chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
                }
            });

            scope.$watchCollection('options.items', function (items) {
                chart.orgDiagram("option", { items: items });
                chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
            });

            function onTemplateRender(event, data) {
                var itemConfig = data.context;

                switch (data.renderingMode) {
                    case primitives.common.RenderingMode.Create:
                        /* Initialize widgets here */
                        var itemScope = scope.$new();
                        itemScope.itemConfig = itemConfig;
                        $compile(data.element.contents())(itemScope);
                        if (!scope.$parent.$$phase) {
                            itemScope.$apply();
                        }
                        itemScopes.push(itemScope);
                        break;
                    case primitives.common.RenderingMode.Update:
                        /* Update widgets here */
                        var itemScope = data.element.contents().scope();
                        itemScope.itemConfig = itemConfig;
                        break;
                }
            }

            function onButtonClick(e, data) {
                scope.onButtonClick();
                scope.$apply();
            }

            function onCursorChanged(e, data) {
                scope.options.cursorItem = data.context ? data.context.id : null;
                scope.onCursorChanged();
                scope.$apply();
            }

            function onHighlightChanged(e, data) {
                scope.options.highlightItem = data.context ? data.context.id : null;
                scope.onHighlightChanged();
                scope.$apply();
            }

            element.on('$destroy', function () {
                /* destroy items scopes */
                for (var index = 0; index < scopes.length; index++) {
                    itemScopes[index].$destroy();
                }

                /* destory jQuery UI widget instance */
                chart.remove();
            });
        };

        return {
            scope: {
                options: '=options',
                onCursorChanged: '&onCursorChanged',
                onHighlightChanged: '&onHighlightChanged',
            },
            link: link
        };
    });
});


RRHH.directive('capitalize', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);  // capitalize initial value
        }
    };
}).directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                // on mouseenter
                $(element).tooltip('show');
            }, function () {
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
}).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]).directive("loader", function ($rootScope) {
        return function ($scope, element, attrs) {
            $scope.$on("loader_show", function () {
                return element.show();
            });
            return $scope.$on("loader_hide", function () {
                return element.hide();
            });
        };
    }
).directive('stringToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value, 10);
                });
            }
        };
    }
);


