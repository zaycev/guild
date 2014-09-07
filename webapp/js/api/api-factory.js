/*
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */

"use strict";

app.factory("ApiFactory", ["$http", "$location",
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

        };


}]);
