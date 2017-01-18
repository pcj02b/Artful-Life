recipeApp.controller('navCtrl', ['$scope', 'authService', function ($scope, authService) {
    $scope.getUser = authService.getUser();
    $scope.signedIn = authService.isSignedIn;
    $scope.signOut = function () {
        authService.signOut();
        console.log("signed out");
    };
}]);