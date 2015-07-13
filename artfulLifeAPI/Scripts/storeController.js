var recipeApp = angular.module("recipeApp");

recipeApp.controller("storeCtrl", function ($scope, $http, recipeService) {
    $scope.recipes = "";
    $http.get("/api/Recipe").success(function (data, status) {
        $scope.recipes = data;
    });

    $scope.showStuff = function () {
        recipeService.showLength();
    };

    $scope.getFromRootScope = function () {
        $scope.recipes = recipeService.get();
    };
    $scope.getFromMongo = function () {
        $http.get("/api/Recipe").success(function (data, status) {
            $scope.recipes = data;
        });
    }
    $scope.getFromJSON = function () {
        $scope.recipes = {};
        $http.get("/Data/recipes.json")
            .success(function (data) {
                $scope.recipes = data.recipes;
            })
            .error(function (status) {
                window.alert(status);
            });
    };

    var storeIngredients = [];
    $http.get("http://localhost:60864/Data/storeIngredients.json").success(function (response) {
        storeIngredients = response.stores;
    });

    function isInStoreIngredients(ingredientObject) {
        var ingredientIndex = 0;
        var isThere = false;

        var storeIndex = ingredientObject.store;
        var ingredient = ingredientObject.ingredient;
        var unit = ingredientObject.unit;
        for (var i = 0; i < $scope.newStoreIngredients[storeIndex].ingredients.length; i++) {
            if ($scope.newStoreIngredients[storeIndex].ingredients[i].ingredient == ingredient &&
                $scope.newStoreIngredients[storeIndex].ingredients[i].unit == unit) {
                isThere = true;
                ingredientIndex = i;
                break;
            };
        };
        var output = { isThere: isThere, storeIndex: storeIndex, ingredientIndex: ingredientIndex }
        return output;
    };

    $scope.updateStoreIngredientList = function () {
        var isInStore = {};
        $scope.newStoreIngredients = JSON.parse(JSON.stringify(storeIngredients));
        for (var i = 0; i < $scope.recipes.length; i++) {
            if ($scope.recipes[i].included) {
                for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                    isInStore = isInStoreIngredients($scope.recipes[i].ingredients[n]);
                    if (isInStore.isThere) {
                        $scope.newStoreIngredients[isInStore.storeIndex].ingredients[isInStore.ingredientIndex].count +=
                            ($scope.recipes[i].ingredients[n].count * $scope.recipes[i].multiplier);
                    }
                    else {
                        $scope.newStoreIngredients[isInStore.storeIndex].ingredients.push({
                            count: ($scope.recipes[i].ingredients[n].count * $scope.recipes[i].multiplier),
                            unit: $scope.recipes[i].ingredients[n].unit,
                            ingredient: $scope.recipes[i].ingredients[n].ingredient
                        });
                    };
                };
            };
        };
    };
    $scope.updateStoreIngredientList();

    $scope.decrementRecipe = function (recipeNumber) {
        if ($scope.recipes[recipeNumber].multiplier > 1) {
            $scope.recipes[recipeNumber].multiplier--;
            $scope.updateStoreIngredientList();
        }
    };

    $scope.save = function () {
        storeIngredients = $scope.newStoreIngredients;
        $http.post("http://localhost:60864/Data/storeIngredients.json", storeIngredients).success(function (data, status) {
            window.alert("good stuff");
        })
            .error(function (data, status) {
                window.alert(status);
            });
        window.alert("data saved");
    };
});
