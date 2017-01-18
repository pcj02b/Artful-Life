recipeApp.factory('authService', [function () {
    var currentUser;
    var signedIn = false;
    var service = {
        getUser: function () {
            return currentUser
        },
        isSignedIn: function () {
            return signedIn
        },
        signOut: function () {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                currentUser = undefined;
                signedIn = false;
                if (typeof (updateShopper) != "undefined") {
                    updateShopper();
                }
                if (typeof (updateRecipes) != "undefined") {
                    updateRecipes();
                }
                if (typeof (updateCooking) != "undefined") {
                    updateCooking();
                }
                if (typeof (updateMain) != "undefined") {
                    updateMain();
                }
            });
        }
    }

    onSignIn = function (googleUser) {
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;

        currentUser = profile.getEmail();
        signedIn = true;
        if (typeof (updateShopper) != "undefined") {
            updateShopper();
        }
        if (typeof (updateRecipes) != "undefined") {
            updateRecipes();
        }
        if (typeof (updateCooking) != "undefined") {
            updateCooking();
        }
        if (typeof (updateMain) != "undefined") {
            updateMain();
        }
    };

    return service;
}]);