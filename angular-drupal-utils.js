// Version
angular.module('angular.drupal.utils', [])
    .filter('object2Array', function() {
        return function(input) {
            var out = [];
            for (i in input) {
                out.push(input[i]);
            }
            return out;
        }
    })
    .directive('stringMatch', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, model) {
                if (!attrs.stringMatch) {
                    console.error('stringMatch expects a model as an argument!');
                    return;
                }
                scope.$watch(attrs.stringMatch, function(value) {
                    model.$setValidity('stringMatch', value === model.$viewValue);
                });
                model.$parsers.push(function(value) {
                    var isValid = value === scope.$eval(attrs.stringMatch);
                    model.$setValidity('stringMatch', isValid);
                    return isValid ? value : undefined;
                });
            }
        };
    })