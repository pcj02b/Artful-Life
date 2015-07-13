var recipeApp = angular.module("recipeApp");

recipeApp.controller("storeCtrl", function ($scope, $http, recipeService) {
    $scope.recipes = "";
    $http.get("/api/Recipe").success(function (data) {
        $scope.recipes = data;
    });
    $scope.stores = "";
    var stores = "";
    $http.get("/api/Store").success(function (data) {
        stores = data;
        $scope.stores = data;
    });

    $scope.showStuff = function () {
    };
    $scope.seedData = function () {
        for (var i = 0; i < $scope.stores.length; i++) {
            $http.post("/api/Store", $scope.stores[i]);
        };
    };
    $scope.getFromMongo = function () {
        $http.get("/api/Store").success(function (data) {
            stores = data;
        });
    }
    $scope.getFromJSON = function () {
        $http.get("http://localhost:60864/Data/stores.json").success(function (data) {
            stores = data.stores;
        });
        $scope.updateStoreIngredientList();
    };
    function isInStores(ingredientObject, i, n) {
        var ingredientIndex = 0;
        var isThere = false;
        var storeIndex = ingredientObject.store;
        var name = ingredientObject.name;
        var unit = ingredientObject.unit;
        for (var i = 0; i < $scope.stores[storeIndex].ingredients.length; i++) {
            if ($scope.stores[storeIndex].ingredients[i].name == name &&
                $scope.stores[storeIndex].ingredients[i].unit == unit) {
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
        $scope.stores = JSON.parse(JSON.stringify(stores));
        for (var i = 0; i < $scope.recipes.length; i++) {
            if ($scope.recipes[i].included) {
                for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                    isInStore = isInStores($scope.recipes[i].ingredients[n],i,n);
                    if (isInStore.isThere) {
                        $scope.stores[isInStore.storeIndex].ingredients[isInStore.ingredientIndex].count +=
                            ($scope.recipes[i].ingredients[n].count * $scope.recipes[i].multiplier);
                    }
                    else {
                        $scope.stores[isInStore.storeIndex].ingredients.push({
                            count: ($scope.recipes[i].ingredients[n].count * $scope.recipes[i].multiplier),
                            unit: $scope.recipes[i].ingredients[n].unit,
                            name: $scope.recipes[i].ingredients[n].name
                        });
                    };
                };
            };
        };
    };
    $scope.decrementRecipe = function (recipeNumber) {
        if ($scope.recipes[recipeNumber].multiplier > 1) {
            $scope.recipes[recipeNumber].multiplier--;
            $scope.updateStoreIngredientList();
        }
    };
    $scope.save = function () {
        var stores = $scope.stores;
        $http.post("http://localhost:60864/Data/stores.json", stores).success(function (data, status) {
            window.alert("good stuff");
        })
            .error(function (data, status) {
                window.alert(status);
            });
        window.alert("data saved");
    };
});
