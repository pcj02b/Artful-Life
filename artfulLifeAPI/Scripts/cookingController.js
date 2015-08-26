var recipeApp = angular.module("recipeApp");

recipeApp.controller('cookingCtrl', function ($scope, $http) {
    $scope.recipes = "";
    $http.get("/api/Recipe").success(function (data) {
        $scope.recipes = data;
    });
    $scope.showPrep = true;
})
