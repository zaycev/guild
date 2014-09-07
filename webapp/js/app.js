/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";


var app = angular.module("NlcdClient", ["ngRoute", "ngSanitize", "angularFileUpload", "auth0"])
    .config(["$routeProvider", "$locationProvider", "authProvider", "$httpProvider",


    function($routeProvider, $locationPrvioder, authProvider, $httpProvider) {

        $httpProvider.interceptors.push('authInterceptor');

        $routeProvider.when("/list", {
             templateUrl: "/webapp/partials/client/list.html",
             controller: "ListController",
             requiresLogin: true
        });

        $routeProvider.when("/post", {
             templateUrl: "/webapp/partials/client/post.html",
             controller: "PostController",
             requiresLogin: true
        });

        $routeProvider.when("/view", {
             templateUrl: "/webapp/partials/client/view.html",
             controller: "ViewController",
             requiresLogin: true
        });

        $routeProvider.when("/profile", {
             templateUrl: "/webapp/partials/client/profile.html",
             controller: "ProfileController",
             requiresLogin: true
        });

        $routeProvider.when("/login", {
             templateUrl: "/webapp/partials/client/login.html",
             controller: "LoginController"
        });

        $routeProvider.otherwise({redirectTo: "/list"});

        authProvider.init({
            domain: 'letsdo.auth0.com',
            clientID: 'x9fQt7BU6A5HjucW01o69AS64OJiv8fI',
            callbackURL: location.href,
            loginUrl: '/login'
        });


}]).run(function(auth) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();

    jQuery(document).ready(function($) {
    $("#header .search input[type='text']")
        .on("focusin", function(){
            $("#header .search-placeholder").hide();
        })
        .on("focusout", function(){
            if( !$(this).val() ) {
                $("#header .search-placeholder").show();
            }
        });

});

});



// angular.module("ng").filter("cut", function () {
//     return function (value, wordwise, max, tail) {
//         if (!value) return "";

//         max = parseInt(max, 10);
//         if (!max) return value;
//         if (value.length <= max) return value;

//         value = value.substr(0, max);
//         if (wordwise) {
//             var lastspace = value.lastIndexOf(' ');
//             if (lastspace != -1) {
//                 value = value.substr(0, lastspace);
//             }
//         }

//         return value + (tail || " ...");
//     };
// });


// angular.module("ng")
//     .filter("to_trusted", ["$sce", function($sce){
//         return function(text) {
//             return $sce.trustAsHtml(text);
//         };
//     }]);


String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


String.prototype.CutStr =  function (value, wordwise, max, tail) {
    if (!value) return "";

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
        var lastspace = value.lastIndexOf(' ');
        if (lastspace != -1) {
            value = value.substr(0, lastspace);
        }
    }

    return value + (tail || " ...");
};
