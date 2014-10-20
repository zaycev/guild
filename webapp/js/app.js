/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";


var app = angular.module("LdtApp", ["ngRoute", "ngSanitize", "ngCookies", "angularFileUpload", "auth0", "ngProgress"])
    .config(["$routeProvider", "$locationProvider", "authProvider", "$httpProvider",


    function($routeProvider, $locationPrvioder, authProvider, $httpProvider) {

        $httpProvider.interceptors.push('authInterceptor');

        $routeProvider.when("/list", {
             templateUrl: "/webapp/partials/list.html",
             controller: "ListController"
        });

        $routeProvider.when("/idea", {
             templateUrl: "/webapp/partials/idea.html",
             controller: "IdeaController"
        });

        $routeProvider.when("/edit-idea", {
             templateUrl: "/webapp/partials/edit-idea.html",
             controller: "EditIdeaController"
        });

        $routeProvider.when("/post", {
             templateUrl: "/webapp/partials/post.html",
             controller: "PostController"
        });

        $routeProvider.when("/profile", {
             templateUrl: "/webapp/partials/profile.html",
             controller: "ProfileController"
        });

        $routeProvider.when("/edit-profile", {
             templateUrl: "/webapp/partials/edit-profile.html",
             controller: "EditProfileController"
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


app.filter("parseIsoDate", function() {
  return function(input) {
    return new Date(input);
  };
});
