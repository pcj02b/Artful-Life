var recipeApp = angular.module("recipeApp");

recipeApp.controller('headerCtrl', function ($scope, $http) {

    $scope.idToken = localStorage.getItem("idToken");
});
