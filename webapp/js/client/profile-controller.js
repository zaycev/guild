app.controller("ProfileController", ["$scope", "$location", "$sce", "ApiFactory",
    function ($scope, $location, $sce, ApiFactory) {

    var userId = $location.search().userId;

    ApiFactory.Profile(userId).success(function(data) {

        $scope.profileData = data.data;

    });


}]);