(function(){
    angular
        .module("BILAPI").controller("HelpController",HelpController);
    function HelpController($scope){
        $scope.hello = "hi from HelpController";

        $scope.oneAtATime = true;

        $scope.groups = [
            {
                title: 'Hvad er BilApi?',
                content: 'BilApi er en tjeneste der udbydes til virksomheder i form af værksteder, undervognsbehandlere og andre der servicerer køretøjer. ' +
                'Ved at benytte det brugervenlige grænseflade kan disse virksomheder opsætte og tilpasse en prisberegner. ' +
                'Privatpersoner kan ved hjælp af deres registreringsnummer få tilbudt en pris for en ydelse ved virksomheden og vælge at kontakte virksomheden.'
            }
        ];

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
    }
})();
