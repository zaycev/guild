/*
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */

"use strict";

app.factory("LdtApi", ["$http", "$location",
    function($http, $location) {

        return {

            IdeaCreate: function(title, summary, pictureId) {
                return $http({
                    url:    "/api/idea/create/",
                    method: "POST",
                    params: {
                        "title": title,
                        "summary": summary,
                        "pictureId": pictureId
                    }
                });
            },

            IdeaUpdate: function(iid, title, summary, pictureId) {
                return $http({
                    url:    "/api/idea/update/",
                    method: "POST",
                    params: {
                        "iid": iid,
                        "title": title,
                        "summary": summary,
                        "pictureId": pictureId
                    }
                });
            },

            IdeaGet: function(iid) {
                return $http({
                    url:    "/api/idea/get/",
                    method: "GET",
                    params: {
                        "iid": iid
                    }
                });
            },

            IdeaList: function(skipSize, textQuery) {
                return $http({
                    url:    "/api/idea/list/",
                    method: "GET",
                    params: {
                        "skipSize": skipSize,
                        "textQuery": textQuery
                    }
                });
            },


            IdeaVote: function(iid) {
                return $http({
                    url:    "/api/idea/vote/",
                    method: "POST",
                    params: {
                        "iid": iid
                    }
                });
            },


            IdeaRemove: function(iid) {
                return $http({
                    url:    "/api/idea/remove/",
                    method: "POST",
                    params: {
                        "iid": iid
                    }
                });
            },


            ProfileCreate: function(profileData) {
                return $http({
                    url:    "/api/profile/create/",
                    method: "POST",
                    params: profileData
                });
            },


            ProfileGet: function(uid) {
                return $http({
                    url:    "/api/profile/get/",
                    method: "GET",
                    params: {
                        "uid": uid
                    }
                });
            },


            ProfileUpdate: function(tagline, email) {
                return $http({
                    url:    "/api/profile/update/",
                    method: "POST",
                    params: {
                        "tagline": tagline,
                        "email": email
                    }
                });
            },


            CommentCreate: function(iid, text) {
                return $http({
                    url:    "/api/comment/create/",
                    method: "POST",
                    params: {
                        "iid": iid,
                        "text": text
                    }
                });
            }


        };
}]);



app.factory("NavApi", [function() {

    return {

        Init: function($root, $location, $cookies) {

            var searchQuery = $location.search().q;
            var searchHolder = $("#header .search input[type='text']");

            $root.showEmailWarning = $root.Auth.isAuthenticated && !Boolean($cookies.dissmissWarning) && !Boolean($cookies.emailSet);

            if ($root.controller != "list") {
                $root.textQuery    = "";
                $root.skipSize     = 0;
                $root.tQ           = "";
            } else {
                $root.textQuery    = searchQuery;
                $root.skipSize     = 0;
                $root.tQ           = searchQuery;
            }

            $root.showBack = ! (
                $root.controller == "list"
                && !Boolean(searchQuery)
            );

            $("#HeaderSearch")
                .focusin(function(){
                    console.log("FOCUSIN");
                    $("#HeaderSearchPlaceholder").hide();
                })
                .focusout(function(){
                    console.log("FOCUSOUT");
                    if( !$(this).val()) {
                        $("#HeaderSearchPlaceholder").show();
                    }
                });


            var hashtag = "#letsdothis ";
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
                                    .text("Let's do this!");
                    }
                });

            function checkValue(str){
                if(str) {
                    if(str.indexOf(hashtag) >= 0) {
                        $("#lets-do-it")
                            .removeClass("comment")
                            .addClass("join")
                                .find("button")
                                    .text("Let's do this!");
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
                                .text("Let's do this!");
                }
            }

            if (Boolean(searchQuery)) {
                console.log("HIDE");
                $("#HeaderSearchPlaceholder").hide();
            } else {
                console.log("SHOW");
                $("#HeaderSearchPlaceholder").show();
            }

        }

    };
}]);
