/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";

app.run(["auth", "$rootScope", "$location", function(auth, $rootScope, $location) {

    console.log("Search Init");

    auth.hookEvents();

    $rootScope.searchQuery = "";
    $rootScope.sQ = "";
    $rootScope.showBack = false;

    $rootScope.Back = function() {
        console.log("Back;");
    };
    $rootScope.Search = function() {
        $location.path("list").search({"q": $rootScope.searchQuery});
        $rootScope.sQ = $rootScope.searchQuery;
    };
    $rootScope.Create = function() {
        console.log("Create;");
    };
    $rootScope.Login = function() {
        console.log("Login;");
    };
    $rootScope.Logout = function() {
        console.log("Logout;");
    };


}]);