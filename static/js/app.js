/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";


var app = angular.module("LdtApp", ["ngRoute", "ngSanitize", "ngCookies", "angularFileUpload", "ngProgress", "auth0"])
    .config(["$routeProvider", "$locationProvider", "$httpProvider", "authProvider",


    function($routeProvider, $locationPrvioder, $httpProvider, authProvider) {

        $routeProvider.when("/list", {
             templateUrl: "/static/partials/list.html",
             controller: "ListController"
        });

        $routeProvider.when("/idea", {
             templateUrl: "/static/partials/idea.html",
             controller: "IdeaController"
        });

        $routeProvider.when("/edit-idea", {
             templateUrl: "/static/partials/edit-idea.html",
             controller: "EditIdeaController"
        });

        $routeProvider.when("/post", {
             templateUrl: "/static/partials/post.html",
             controller: "PostController"
        });

        $routeProvider.when("/profile", {
             templateUrl: "/static/partials/profile.html",
             controller: "ProfileController"
        });

        $routeProvider.when("/edit-profile", {
             templateUrl: "/static/partials/edit-profile.html",
             controller: "EditProfileController"
        });

        $routeProvider.otherwise({redirectTo: "/list"});

        authProvider.init({
            domain: 'letsdo.auth0.com',
            clientID: 'x9fQt7BU6A5HjucW01o69AS64OJiv8fI',
            callbackURL: location.href
        });

        $httpProvider.interceptors.push("authInterceptor");

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


app.filter("parseIsoDate", function() {
  return function(input) {
    return new Date(input);
  };
});
