/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";

app.run(["auth", "$rootScope", "$location", "LdtApi",
         function(auth, $rootScope, $location, LdtApi) {

    console.log("Search Init");

    auth.hookEvents();

    $rootScope.Auth         = auth;

    $rootScope.textQuery    = "";
    $rootScope.skipSize     = 0;
    $rootScope.tQ           = "";
    $rootScope.showBack     = false;

    console.log(auth);


    $rootScope.Back = function() {
        console.log("Back;");
        $location.path("list");
    };


    $rootScope.Search = function() {
        $location.path("list").search({"q": $rootScope.textQuery});
        $rootScope.tQ = $rootScope.textQuery;
    };


    $rootScope.Create = function() {
        $location.path("post");
    };


    $rootScope.Login = function() {
        auth.signin({
            popup: true
        }, function() {

            LdtApi.ProfileCreate(auth.profile)
                .success(function(data) {
                    console.log(["success", data]);
                })
                .error(function(data) {
                    console.log(["error", data]);
                });

        }, function() {
            console.log("Some error occurred");
        });
    };


    $rootScope.Logout = function() {

        auth.signout();

        // LdtApi.ProfileGet()
        //     .success(function(data) {
        //         console.log(["ProfileGet", "success", data]);
        //     })
        //     .error(function(data) {
        //         console.log(["ProfileGet", "error", data]);
        //     });

    };


}]);