/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("LoginController", ["$scope", "$location", "$sce", "ApiFactory", "auth",
    function ($scope, $location, $sce, ApiFactory, auth) {

        $scope.login = function() {
            auth.signin({
                popup: true
              }, function() {
                alert("Success");
              }, function(data) {
                console.log(data);
            });
        }

}]);