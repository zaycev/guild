app.controller("ProfileController", ["$scope", "$location", "$sce", "ApiFactory",
    function ($scope, $location, $sce, ApiFactory) {


    ApiFactory.Profile().success(function(data) {

        $scope.profileData = data.data;

    });


}]);