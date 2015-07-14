var recipeApp = angular.module("recipeApp");

recipeApp.controller("storeCtrl", function ($scope, $http, recipeService) {
    $scope.recipes = "";
    $http.get("/api/Recipe").success(function (data) {
        $scope.recipes = data;
    });
    $scope.ingredients = "";
    $http.get("/api/Ingredients").success(function (data) {
        $scope.ingredients = data;
    });
    $scope.stores = "";
    $http.get("/api/Store").success(function (data) {
        $scope.stores = data;
    });

    $scope.showStuff = function () {
        $scope.setStoreIngredientList();
    };
    $scope.seedData = function () {
        for (var i = 0; i < $scope.stores.length; i++) {
            $http.post("/api/Store", $scope.stores[i]);
        };
    };
    $scope.getFromJSON = function () {
        $http.get("/Data/stores.json")
            .success(function (data) {
                $scope.stores = data.stores;
            })
            .error(function (status) {
                window.alert(status);
            });
    }
    $scope.getFromMongo = function () {
        $http.get("/api/Store").success(function (data) {
            $scope.stores = data;
        });
    }

    $scope.addStore = function () {
        var newRecipeName = prompt("Enter the store name");
        var isDefault = confirm("Will "+newRecipeName+" be your primary store?\nYes:OK No:Cancel")
        if (isDefault) {
            for (var i = 0; i < $scope.stores.length; i++) {
                $scope.stores[i].defaultStore = false;
            }
        }
        $scope.stores.push({ name: newRecipeName, defaultStore: isDefault });
        $http.post("/api/Store", { name: newRecipeName, defaultStore: isDefault });
        $scope.updateStoreIngredientList();
    };

    $scope.deleteStore = function (index) {
        if (confirm("This will permanently remove this store.")) {
            var newStores = new Array;
            console.log($scope.stores.length);
            console.log(index);
            wasDefault = $scope.stores[index].defaultStore;
            for (var i = 0; i < $scope.stores.length; i++) {
                if (i != index) {
                    newStores.push($scope.stores[i]);
                }
            }
            $http.delete("/api/Store", $scope.stores[index].name);
            $scope.stores = newStores;
            if (wasDefault) {
                $scope.stores[0].defaultStore = true;
            }
            $scope.updateStoreIngredientList();
        }
    }

 
    function isInStores(ingredientObject) {
        var ingredientIndex = 0;
        var isThere = false;
        var storeIndex = 0;
        for (var i = 0; i < $scope.ingredients.length; i++) {
            if ($scope.ingredients[i].name == ingredientObject.name) {
                storeIndex = $scope.ingredients[i].store;
            }
        }
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
        $scope.storeIngredientList = new Array;

        for (var i = 0; i < $scope.stores.length; i++) {
            $scope.storeIngredientList.push($scope.stores[i]);
        }
        var ingredientIndex = 0;
        var ingredientName = "";
        for (var i = 0; i < $scope.ingredients.length; i++) {
            storeIndex = $scope.ingredients[i].store;
            $scope.storeIngredientList[storeIndex].ingredients = [];
        }
        var isInStore = {};
        for (var i = 0; i < $scope.recipes.length; i++) {
            if ($scope.recipes[i].included) {
                for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                    isInStore = isInStores($scope.recipes[i].ingredients[n]);
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
    $scope.saveRecipes = function () {

    };
    $scope.saveIngredients = function () {

    };
    angular.element(document).ready($scope.updateStoreIngredientList());
});
