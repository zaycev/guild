/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";

app.run(["auth", "$rootScope", "$location", "LdtApi", "ngProgress",
         function(auth, $rootScope, $location, LdtApi, ngProgress) {

    auth.hookEvents();
    $rootScope.Auth         = auth;
    $rootScope.textQuery    = "";
    $rootScope.skipSize     = 0;
    $rootScope.tQ           = "";
    $rootScope.showBack     = false;


    //
    $rootScope.Back = function() {
        $location.path("list");
        $location.url($location.path());
    };


    //
    $rootScope.Search = function() {
        $location.path("list").search({"q": $rootScope.textQuery});
        $rootScope.tQ = $rootScope.textQuery;
    };


    //
    $rootScope.Create = function() {
        if (!auth.isAuthenticated) {
            $rootScope.Login();
            return;
        }
        $location.path("post");
    };


    //
    $rootScope.Login = function() {

        auth.signin({
            popup: true
        }, function() {
            ngProgress.start();
            LdtApi.ProfileCreate(auth.profile)
                .success(function(data) {
                    ngProgress.complete();
                    window.location.reload();
                })
                .error(function(data) {
                    $rootScope.ShowError("LogIn");
                });

        }, function() {
            console.log("Some error occurred");
        });
    };


    //
    $rootScope.Logout = function() {
        auth.signout();
        window.location = location.protocol + "//" + location.host + location.pathname + "#list";
    };


    //
    $rootScope.ShowError = function(message) {
        ngProgress.complete();
    };


}]);
