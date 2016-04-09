(function(){
    angular
        .module("BILAPI")
        .directive('exampleCalculator', exampleCalculator);

    function exampleCalculator(){
        return {
            link: function(scope, elem, attrs) {
                //getting the elements we want to manipulate
                var calcWrapper = elem.find('.exampleSearch');
                var calcButtons = elem.find('.btn');
                var calcInputAddon = elem.find('.input-group-addon');
                //watching for changes in calculator style backgroundColor
                scope.$watch('calculator.settings.style.backgroundColor', function(newvalue,oldvalue) {
                    //settingg the new  background color to the wrapper div
                    if(newvalue && newvalue != 'undefined'){
                        calcWrapper.css('background-color',newvalue);
                    }
                });
                //watching for changes in calculator style textColor
                scope.$watch('calculator.settings.style.textColor', function(newvalue,oldvalue) {
                    //settingg the new  background color to the wrapper div
                    if(newvalue && newvalue != 'undefined'){
                        calcWrapper.css('color',newvalue);
                    }
                });
                //watching for changes in calculator style buttonColor
                scope.$watch('calculator.settings.style.buttonColor', function(newvalue,oldvalue) {
                    //settingg the new  background color to the wrapper div
                    if(newvalue && newvalue != 'undefined'){
                        calcButtons.css('background-color',newvalue);
                        calcInputAddon.css('background-color',newvalue);
                    }
                });
                //watching for changes in calculator style buttonTextColor
                scope.$watch('calculator.settings.style.buttonTextColor', function(newvalue,oldvalue) {
                    //settingg the new  background color to the wrapper div
                    if(newvalue && newvalue != 'undefined'){
                        calcButtons.css('color',newvalue);
                    }
                });
            },
            templateUrl: "directives/examplecalculator/tmpl/examplecalculator.html"
        };
    }

})();