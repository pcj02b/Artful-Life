var recipeApp = angular.module("recipeApp");

recipeApp.controller('homeCtrl', function ($scope, AuthService) {
    $scope.user = AuthService.getUser();
    console.log($scope.user);
    var logOut = document.getElementById("logOut");
    var logIn = document.getElementById("logIn");
    var logOutClass = document.createAttribute("class");
    var logInClass = document.createAttribute("class");
    logOut.setAttributeNode(logOutClass);
    logIn.setAttributeNode(logInClass);
    if ($scope.user === undefined) {
        logInClass.value = "yesDisplay";
        logOutClass.value = "noDisplay";

    }
    else {
        logOutClass.value = "yesDisplay";
        logInClass.value = "noDisplay";
    }
    updateHome = function () {
        $scope.user = AuthService.getUser();
        if ($scope.user === undefined) {
            logInClass.value = "yesDisplay";
            logOutClass.value = "noDisplay";

        }
        else {
            logOutClass.value = "yesDisplay";
            logInClass.value = "noDisplay";
        }
    };
});