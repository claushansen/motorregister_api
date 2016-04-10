(function(){
    angular
        .module("BILAPI")
        .directive('keepInSight', keepInSight);

    function keepInSight(){
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                $(window).scroll(function(){
                    var parentoffset = elem.parent().offset().top;
                    if($(window).scrollTop() > parentoffset ) {
                        elem
                            .stop()
                            .animate({"marginTop": ($(window).scrollTop() - parentoffset)+60}, "slow");
                    }else{
                        elem
                            .stop()
                            .animate({"marginTop": 0}, "slow");
                    }
                });
            }
        };
    }

})();
