(function(){
    angular
        .module("mycalculator")
        .directive('applyStyles', applyStyles);

    function applyStyles(){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                scope.$watch('settings.settings.style', function(newvalue,oldvalue) {
                    //settingg the new  background color to the wrapper div
                    if(newvalue && newvalue != 'undefined'){

                        //Getting style settings
                        var style = scope.settings.settings.style;
                        //getting the elements we want to manipulate

                        var body = $(document.body);
                        var calcButtons = elem.find('.btn');
                        var calcInputAddon = elem.find('.input-group-addon');

                        body.css('background-color',style.backgroundColor);
                        body.css('color',style.textColor);

                        calcButtons.css('background-color',style.buttonColor);
                        calcButtons.css('border-color',style.buttonColor);
                        calcButtons.css('color',style.buttonTextColor);

                        calcInputAddon.css('background-color',style.buttonColor);

                    }
                });



            }
        };
    }

})();
