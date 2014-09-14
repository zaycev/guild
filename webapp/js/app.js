/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";


var app = angular.module("LdtApp", ["ngRoute", "ngSanitize", "angularFileUpload", "auth0", "ngProgress"])
    .config(["$routeProvider", "$locationProvider", "authProvider", "$httpProvider",


    function($routeProvider, $locationPrvioder, authProvider, $httpProvider) {

        $httpProvider.interceptors.push('authInterceptor');

        $routeProvider.when("/list", {
             templateUrl: "/webapp/partials/list.html",
             controller: "ListController"
        });

        $routeProvider.when("/post", {
             templateUrl: "/webapp/partials/post.html",
             controller: "PostController"
        });

        $routeProvider.when("/profile", {
             templateUrl: "/webapp/partials/profile.html",
             controller: "ProfileController"
        });


        $routeProvider.when("/idea", {
             templateUrl: "/webapp/partials/idea.html",
             controller: "IdeaController"
        });


        $routeProvider.otherwise({redirectTo: "/list"});

        authProvider.init({
            domain: 'letsdo.auth0.com',
            clientID: 'x9fQt7BU6A5HjucW01o69AS64OJiv8fI',
            callbackURL: location.href
        });


}])



app.directive("ngEnter", function () {
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
