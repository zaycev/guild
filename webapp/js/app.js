/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";


var app = angular.module("LdtApp", ["ngRoute", "ngSanitize", "angularFileUpload", "auth0"])
    .config(["$routeProvider", "$locationProvider", "authProvider", "$httpProvider",


    function($routeProvider, $locationPrvioder, authProvider, $httpProvider) {

        $httpProvider.interceptors.push('authInterceptor');

        $routeProvider.when("/list", {
             templateUrl: "/webapp/partials/client/list.html",
             controller: "ListController"
        });

        $routeProvider.when("/post", {
             templateUrl: "/webapp/partials/client/post.html",
             controller: "PostController"
        });

        $routeProvider.when("/view", {
             templateUrl: "/webapp/partials/client/view.html",
             controller: "ViewController"
        });

        $routeProvider.when("/profile", {
             templateUrl: "/webapp/partials/client/profile.html",
             controller: "ProfileController"
        });

        $routeProvider.when("/editProfile", {
             templateUrl: "/webapp/partials/client/editProfile.html",
             controller: "EditProfileController"
        });

        $routeProvider.when("/login", {
             templateUrl: "/webapp/partials/client/login.html",
             controller: "LoginController"
        });

        $routeProvider.otherwise({redirectTo: "/list"});

        authProvider.init({
            domain: 'letsdo.auth0.com',
            clientID: 'x9fQt7BU6A5HjucW01o69AS64OJiv8fI',
            callbackURL: location.href
        });


}]).run(function(auth) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();

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



app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
