/**
Author: Vova Zaytsev <zaytsev@usc.edu>
**/

"use strict";


var app = angular.module("NlcdClient", ["ngRoute", "ngSanitize", "angularFileUpload"])
    .config(["$routeProvider", "$locationProvider",


    function($routeProvider, $locationPrvioder) {

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

        $routeProvider.otherwise({redirectTo: "/list"});

}]);



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
