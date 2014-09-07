app.controller("ViewController", ["$scope", "$location", "$sce", "ApiFactory",
    function ($scope, $location, $sce, ApiFactory) {

        $scope.projectId = $location.search().projectId;
        $scope.projectData = undefined;

        console.log($scope.projectId);

        ApiFactory.View($scope.projectId).success(function(data) {

            $scope.projectData = data.data;

        });

}]);