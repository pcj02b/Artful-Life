var ingredientApp = angular.module("ingredientApp", []);
ingredientApp.controller("ingredientCtrl", function ($scope, $http) {
    $scope.recipes = [];
    $http.get("http://localhost:60864/Data/recipes.json").success(function (response) {
        $scope.recipes = response.recipes;
    });
    $scope.masterIngredientList = [];

    compileIngredients = function () {
        var alreadyThere = false;
        for (var i = 0; i < $scope.recipes.length; i++) {
            for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                for (var m = 0; m <$scope.masterIngredientList.length;m++){
                    if ($scope.recipes[i].ingredients[n].ingredient == $scope.masterIngredientList[m].name) {
                        alreadyThere = true;
                    }
                }
                if (!alreadyThere) {
                    $scope.masterIngredientList += $scope.recipes[i].ingredients[n].ingredient
                }
            }
        }
    };

    compileIngredients();

});
