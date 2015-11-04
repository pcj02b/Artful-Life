var recipeApp = angular.module('recipeApp', []);

recipeApp.factory("AuthService", function () {
    var currentUser;
    onSignIn = function (googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);

        currentUser = profile.getEmail();
        console.log("type of updateStores: " + typeof (updateStores));
        console.log("type of updateRecipes: " + typeof (updateRecipes));

        if (typeof (updateShopper) != "undefined") {
            console.log("ran update Shopper")
            updateShopper();
        }
        if (typeof (updateRecipes) != "undefined") {
            console.log("ran update Recipes")
            updateRecipes();
        }
        if (typeof (updateHome) != "undefined") {
            console.log("ran update Home")
            updateHome();
        }
        if (typeof (updateCooking) != "undefined") {
            console.log("ran update Cooking")
            updateCooking();
        }
    };
    signOut = function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            currentUser = undefined;
            if (typeof (updateShopper) != "undefined") {
                console.log("ran update Shopper")
                updateShopper();
            }
            if (typeof (updateRecipes) != "undefined") {
                console.log("ran update Recipes")
                updateRecipes();
            }
            if (typeof (updateHome) != "undefined") {
                console.log("ran update Home")
                updateHome();
            }
            if (typeof (updateCooking) != "undefined") {
                console.log("ran update Cooking")
                updateCooking();
            }
        });
    };

    return {
        setUser: function (user) {
            currentUser = user;
        },
        getUser: function () {
            return currentUser;
        }
    };
});