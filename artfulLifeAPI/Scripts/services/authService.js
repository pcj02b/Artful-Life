recipeApp.factory('authService', [function () {
    var currentUser = undefined;
    var signedIn = false;
    var service = {
        getUser: function () {
            return currentUser
        },
        isSignedIn: function () {
            return signedIn
        }
    }

    service.signOut = function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            currentUser = undefined;
            signedIn = false;
            if (typeof (updateShopper) != "undefined") {
                updateShopper();
                console.log("ran update Shopper")
            }
            if (typeof (updateRecipes) != "undefined") {
                updateRecipes();
                console.log("ran update Recipes")
            }
            if (typeof (updateCooking) != "undefined") {
                updateCooking();
                console.log("ran update Cooking")
            }
            if (typeof (updateMain) != "undefined") {
                updateMain();
                console.log("ran update main");
            }
        });
    }

    onSignIn = function (googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);

        currentUser = profile.getEmail();
        signedIn = true;
        if (typeof (updateShopper) != "undefined") {
            console.log("ran update Shopper")
            updateShopper();
        }
        if (typeof (updateRecipes) != "undefined") {
            console.log("ran update Recipes")
            updateRecipes();
        }
        if (typeof (updateCooking) != "undefined") {
            console.log("ran update Cooking")
            updateCooking();
        }
        if (typeof (updateMain) != "undefined") {
            updateMain();
            console.log("ran update main");
        }
    };

    return service;
}]);