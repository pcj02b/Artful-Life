recipeApp.controller("storeCtrl", ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.recipes = [];
    var originalRecipes = [];
    $scope.ingredients = [];
    $scope.stores = [];
    $scope.defaultStoreIndex = -1;
    $scope.user = authService.getUser();

    updateShopper = function () {
        if (authService.isSignedIn()) {
            $scope.user = authService.getUser();
            var d1 = $.Deferred();
            var d2 = $.Deferred();
            var d3 = $.Deferred();

            $.when(d1, d2, d3).done(function () {
                $scope.updateStoreIngredientList();
            });

            $http.get("/api/Recipe?user=".concat($scope.user)).success(function (allRecipes) {
                $scope.recipes = allRecipes;
                originalRecipes = angular.copy($scope.recipes);
                d1.resolve();
            });
            $http.get("/api/Ingredients?user=".concat($scope.user)).success(function (data) {
                $scope.ingredients = data.ingredients;
                d2.resolve();
            });

            $http.get("/api/Store/?user=".concat($scope.user)).success(function (data) {
                $scope.stores = data.stores;
                d3.resolve();
            });
        }
        else {
            $scope.recipes = [];
            originalRecipes = [];
            $scope.ingredients = [];
            $scope.stores = [];
            $scope.updateStoreIngredientList();
        }
    };

    $scope.addStore = function () {
        var newStoreName = prompt("Enter the store name");
        var isDefault = confirm("Will " + newStoreName + " be your primary store?\nYes:OK No:Cancel");
        if (isDefault) {
            for (var i = 0; i < $scope.stores.length; i++) {
                $scope.stores[i].defaultStore = false;
            }
        }
        $scope.stores.push({ name: newStoreName, defaultStore: isDefault });
        $http.put("/api/Store?user=".concat($scope.user), { _id: $scope.user, store: $scope.stores });
        $scope.updateStoreIngredientList();
    };
    $scope.deleteStore = function (index) {
        var wasDefault = $scope.stores[index].defaultStore;
        var newStores = new Array;
        var ingredientIndex = 0;
        if (confirm("This will permanently remove " + $scope.stores[index].name + ".")) {
            if (wasDefault) {
                $scope.defaultStoreIndex = -1;
                confirm("You've deleted your default store. Please set a new default store.");
            }
            //assign ingredients to default store
            for (var i = 0; i < $scope.storeIngredientList[index].ingredients.length; i++) {
                for (var n = 0; n < $scope.ingredients.length; n++) {
                    if ($scope.ingredients[n].name === $scope.storeIngredientList[index].ingredients[i].name) {
                        ingredientIndex = n;
                    }
                }
                $scope.ingredients[ingredientIndex].store = -1;
                $http.put("/api/Ingredients", $scope.ingredients[ingredientIndex]);
            }

            //decrement the store index of any ingredients in stores greater than store being deleted
            for (i = 0; i < $scope.ingredients.length; i++) {
                if ($scope.ingredients[i].store > index) {
                    $scope.ingredients[i].store--;
                    $http.put("/api/Ingredients", $scope.ingredients[i]);
                }
            }
            //create new store list
            for (i = 0; i < $scope.stores.length; i++) {
                if (i !== index) {
                    newStores.push($scope.stores[i]);
                }
            }
            //delete store in mongo
            $http.put("/api/Store", { _id: $scope.user, store: newStores }).success(function (status) {
            })
            .error(function (status) {
                window.alert(status);
                console.log("something went wrong while deleting a store.");
            });
            //update local store list 
            $scope.stores = newStores;
            $scope.updateStoreIngredientList();
        }
    };

    $scope.setDefaultStore = function (index) {
        for (var i = 0; i < $scope.stores.length; i++) {
            $scope.stores[i].defaultStore = false;
        }
        $scope.stores[index].defaultStore = true;
        $scope.updateStoreIngredientList();
    };

    var isInStores = function (inputIngredient) {
        var matchedIngredient = _.find($scope.ingredients, function (ingredient) {
            return ingredient.name === inputIngredient.name;
        });
        var storeIndex = matchedIngredient && matchedIngredient.store !== -1 ? matchedIngredient.store : $scope.defaultStoreIndex;
        var ingredientIndex = _.findIndex($scope.storeIngredientList[storeIndex].ingredients, function (ingredient) {
            return ingredient.name === inputIngredient.name && ingredient.unit === inputIngredient.unit;
        });
        return { storeIndex: storeIndex, ingredientIndex: ingredientIndex };
    };

    $scope.updateStoreIngredientList = function () {
        $scope.storeIngredientList = new Array;
        $scope.defaultStoreIndex = _.findIndex($scope.stores, function (store) {
            return store.defaultStore;
        });
        angular.forEach($scope.stores, function (store) {
            store.ingredients = [];
            $scope.storeIngredientList.push(store);
        });
        angular.forEach($scope.recipes, function (recipe) {
            if (recipe.included) {
                angular.forEach(recipe.ingredients, function (ingredient) {
                    var isInStore = isInStores(ingredient);
                    if (isInStore.ingredientIndex !== -1) {
                        $scope.storeIngredientList[isInStore.storeIndex].ingredients[isInStore.ingredientIndex].count[0] +=
                            recipe.ingredient.count[0] * recipe.multiplier;
                        $scope.storeIngredientList[isInStore.storeIndex].ingredients[isInStore.ingredientIndex].count[1] +=
                            recipe.ingredient.count[1] * recipe.multiplier;
                    }
                    else {
                        $scope.storeIngredientList[isInStore.storeIndex].ingredients.push({
                            count: [ingredient.count[0] * recipe.multiplier,
                                    ingredient.count[1] * recipe.multiplier,
                                    ingredient.count[2]],
                            unit: ingredient.unit,
                            name: ingredient.name
                        });
                    }
                });
            }
        });
    };

    $scope.incrementRecipe = function (recipeID) {
        var recipe = _.find($scope.recipes, function (recipe) {
            return recipe._id === recipeID;
        });
        recipe.multiplier++;
        $scope.updateStoreIngredientList();
    };

    $scope.decrementRecipe = function (recipeID) {
        var recipe = _.find($scope.recipes, function (recipe) {
            return recipe._id === recipeID;
        });
        recipe.multiplier--;
        $scope.updateStoreIngredientList();
    };

    $scope.saveRecipes = function () {
        angular.forEach($scope.recipes, function (recipe, index) {
            if (!angular.equals(recipe, originalRecipes[index])) {
                $http.put("/api/Recipe", recipe);
            }
        });
    };

    $scope.updateIngredientStore = function (ingredientIndex, storeIndex) {
        $scope.ingredients[ingredientIndex].store = storeIndex;
        $http.put("/api/Ingredients", $scope.ingredients[ingredientIndex]).success(function () {
        });
        $scope.updateStoreIngredientList();
    };
}]);
