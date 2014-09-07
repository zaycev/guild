/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ListController", ["$scope", "$location", "$sce", "ApiFactory",
    function ($scope, $location, $sce, ApiFactory) {

        $scope.projectList = [];

        ApiFactory.List().success(function(data) {

            $scope.projectList = data.data;

        });

}]);