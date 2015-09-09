﻿function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    sessionStorage.setItem("user", profile.getEmail());
    updateRecipes();
    updateStores();
}

$(document).ready(function () {
    var user = sessionStorage.getItem("user");
    if (typeof user === "string") {
        $("#logOut").show();
        $("#logIn").hide();
    }
    else {
        $("#logOut").hide();
        $("#logIn").show();
    }
    $("#logIn").click(function () {
        $(this).hide();
        $("#logOut").show();
    })
    $("#logOut").click(function () {
        $(this).hide();
        $("#logIn").show();
    })
});


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        sessionStorage.removeItem("user");
        updateRecipes();
        updateStores();
    });
}