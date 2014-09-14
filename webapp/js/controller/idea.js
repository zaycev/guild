/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("IdeaController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "idea";
        NavApi.Init($rootScope, $location);

        $scope.auth = auth;
        $scope.idea = null;
        $scope.ideaId = $location.search().i;

        //
        ngProgress.start()
        LdtApi.IdeaGet($scope.ideaId)
            .success(function(ideaData) {
                console.log(ideaData);
                ngProgress.stop();
                $scope.idea = ideaData;
            })
            .error(function() {
                ngProgress.stop();
                $rootScope.ShowError();
            });

}]);