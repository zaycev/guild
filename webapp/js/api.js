/*
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */

"use strict";

app.factory("LdtApi", ["$http", "$location",
    function($http, $location) {

        return {

            List: function(size, skip, query) {
                return $http({
                    url:    "/api/v1/list",
                    method: "GET",
                    params: {
                        "size": size,
                        "skip": skip,
                        "query": query
                    }
                });
            },

            View: function(projectId) {
                return $http({
                    url:    "/api/v1/view",
                    method: "GET",
                    params: {
                        "projectId": projectId
                    }
                });
            },

            Profile: function(userId) {
                return $http({
                    url:    "/api/v1/profile",
                    method: "GET",
                    params: {
                        "userId": userId
                    }
                });
            },

            Post: function(userId, newTitle, newDescription, newImage) {

                return $http({
                    url:    "/api/v1/post",
                    method: "GET",
                    params: {
                        "userId": userId,
                        "title": newTitle,
                        "description": newDescription,
                        "image": newImage
                    }
                });

            },

            NewUser: function(userId, userName, userScreenName, userPicture) {

                return $http({
                    url:    "/api/v1/new_user",
                    method: "GET",
                    params: {
                        "userId": userId,
                        "userName": userName,
                        "userScreenName": userScreenName,
                        "userPicture": userPicture
                    }
                });

            },


            UpVote: function(userId, projectId) {

                return $http({
                    url:    "/api/v1/up_vote",
                    method: "GET",
                    params: {
                        "userId": userId,
                        "projectId": projectId,
                    }
                });

            },


            SaveProfile: function(profileData) {
                return $http({
                    url:    "/api/v1/save",
                    method: "GET",
                    params: {
                        "userId": profileData.userId,
                        "tagLine": profileData.tagLine
                    }
                });
            },

            PostComment: function(userId, projectId, commentText) {

                return $http({
                    url:    "/api/v1/comment",
                    method: "GET",
                    params: {
                        "userId": userId,
                        "projectId": projectId,
                        "commentText": commentText,
                    }
                });


            }

        };
}]);



app.factory("NavApi", [function() {

    return {

        Init: function($root, $location) {

            var searchQuery = $location.search().q;
            console.log([searchQuery]);

            $(document).ready(function($) {
                $("#header .search input[type='text']")
                    .on("focusin", function(){
                        $("#header .search-placeholder").hide();
                    })
                    .on("focusout", function(){
                        if( !$(this).val() && searchQuery !== true && typeof searchQuery !== "undefined" ) {
                            $("#header .search-placeholder").show();
                        }
                    });
                var hashtag = "#letsdoit ";
                checkValue($("#lets-do-it input[type='text']").val());
                $("#lets-do-it input[type='text']")
                    .on("keyup", function(){
                        checkValue($("#lets-do-it input[type='text']").val());
                    })
                    .on("focusin", function(){
                        if( !$(this).val() ) {
                            $(this).val(hashtag);
                        }
                    })
                    .on("focusout", function(){
                        if( !$(this).val() ) {
                            $("#lets-do-it.comment")
                                .removeClass("comment")
                                .addClass("join")
                                    .find("button")
                                        .text("Lets do it");
                        }
                    });
                function checkValue(str){
                    if(str) {
                        if(str.indexOf(hashtag) >= 0) {
                            $("#lets-do-it")
                                .removeClass("comment")
                                .addClass("join")
                                    .find("button")
                                        .text("Lets do it");
                        } else {
                            $("#lets-do-it")
                                .removeClass("join")
                                .addClass("comment")
                                    .find("button")
                                        .text("Comment");
                        }
                    } else {
                        $("#lets-do-it")
                            .removeClass("comment")
                            .addClass("join")
                                .find("button")
                                    .text("Lets do it");
                    }
                }

                if (searchQuery !== true && typeof searchQuery !== "undefined") {
                    $root.searchQuery = searchQuery;
                    $("#header .search-placeholder").hide();
                    console.log("Hide");
                } else {
                    $("#header .search-placeholder").show();
                    console.log("Show");
                }

                $root.showBack = $root.controller != "list" || searchQuery !== true || typeof searchQuery !== "undefined";
                console.log($root.showBack);

            });

            if (searchQuery !== true && typeof searchQuery !== "undefined") {
                $root.searchQuery = searchQuery;
                $("#header .search-placeholder").hide();
                console.log("Hide");
            } else {
                $("#header .search-placeholder").show();
                console.log("Show");
            }

            $root.showBack = $root.controller != "list" || searchQuery !== true || typeof searchQuery !== "undefined";
            console.log($root.showBack);

        }

    };
}]);