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


            ProfileCreate: function(profileData) {
                return $http({
                    url:    "/api/profile/create/",
                    method: "GET",
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


            ProfileUpdate: function(tagline) {
                return $http({
                    url:    "/api/profile/update/",
                    method: "POST",
                    params: {
                        "tagline": tagline
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

        Init: function($root, $location) {

            var searchQuery = $location.search().q;

            if ($root.controller != "list") {
                $root.textQuery    = "";
                $root.skipSize     = 0;
                $root.tQ           = "";
            } else {
                $root.textQuery    = searchQuery;
                $root.skipSize     = 0;
                $root.tQ           = searchQuery;
            }

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
                } else {
                    $("#header .search-placeholder").show();
                }

                $root.showBack = $root.controller != "list" || searchQuery !== true || typeof searchQuery !== "undefined";

            });

            if (searchQuery !== true && typeof searchQuery !== "undefined") {
                $root.searchQuery = searchQuery;
                $("#header .search-placeholder").hide();
            } else {
                $("#header .search-placeholder").show();
            }

            $root.showBack = $root.controller != "list" || searchQuery !== true || typeof searchQuery !== "undefined";

        }

    };
}]);