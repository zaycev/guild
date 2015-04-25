/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";

app.run(["auth", "$rootScope", "$location", "$cookies", "LdtApi", "ngProgress",
         function(auth, $rootScope, $location, $cookies, LdtApi, ngProgress) {

    auth.hookEvents();

    $rootScope.Auth             = auth;
    $rootScope.textQuery        = "";
    $rootScope.skipSize         = 0;
    $rootScope.tQ               = "";

    $rootScope.showSearch       = false;
    $rootScope.showBack         = false;

    $rootScope.showEmailWarning = auth.isAuthenticated && !Boolean($cookies.dissmissWarning) && !Boolean($cookies.emailSet);

    $rootScope.DissmissEmailWarning = function() {
        $cookies.dissmissWarning = true;
        $rootScope.showEmailWarning = auth.isAuthenticated && !Boolean($cookies.dissmissWarning) && !Boolean($cookies.emailSet);
    };

    //
    $rootScope.OpenIdea = function(iid) {
        $location.path("idea").search({"i": iid});
    }


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
                    alert("PROFILE CREATE");
                    ngProgress.complete();
                    $cookies.dissmissWarning = false;
                    $cookies.emailSet = Boolean(data.email);
                    $rootScope.showEmailWarning = auth.isAuthenticated && !Boolean($cookies.dissmissWarning) && !Boolean($cookies.emailSet);
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
