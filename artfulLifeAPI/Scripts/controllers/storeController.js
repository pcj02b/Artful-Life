recipeApp.controller("storeCtrl", ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.recipes = [];
    var ogRecipes = [];
    $scope.ingredients = [];
    $scope.stores = [];
    $scope.storeIsClicked = [];
    $scope.defaultStoreIndex = -1;
    var allRecipes = [];
    var tempRecipe = {};

    $scope.user = authService.getUser();

    $scope.seedData = function () {
        for (var i = 0; i < $scope.stores.length; i++) {
            $http.post("/api/Store", $scope.stores[i]);
        };
        for (var i = 0; i < $scope.ingredients.length; i++) {
            $http.post("/api/Ingredients", $scope.ingredients[i]);
        }
    }
    $scope.getFromJSON = function () {
        $http.get("/Data/stores.json")
            .success(function (data) {
                $scope.stores = data.stores;
            })
            .error(function (status) {
                window.alert(status);
            });
        $http.get("/Data/ingredients.json")
        .success(function (data) {
            $scope.ingredients = data.ingredients;
        });
    }
    $scope.getFromMongo = function () {
        $http.get("/api/Store").success(function (data) {
            $scope.stores = data;
        });
    }
    updateShopper = function () {
        $scope.$apply(function () {
            console.log("updating shopper");
            $scope.user = authService.getUser();
            console.log("updating shopper for " + $scope.user);
            $scope.recipes = [];
            $scope.ingredients = [];
            $scope.stores = [];
            $scope.storeIsClicked = [];
            allRecipes = [];
            tempRecipe = {};
            $http.get("/api/Recipe?user=".concat($scope.user)).success(function (data) {
                allRecipes = data;
                for (var i = 0 ; i < allRecipes.length ; i++) {
                    if (allRecipes[i].owner === $scope.user) {
                        console.log("owner of " + allRecipes[i].name);
                        tempRecipe = { recipe: allRecipes[i] };
                        $scope.recipes.push(tempRecipe.recipe);
                        $scope.recipes[$scope.recipes.length - 1].ownership = "owner";
                    }
                    for (var n = 0 ; n < allRecipes[i].editors.length ; n++) {
                        if (allRecipes[i].editors[n] === $scope.user) {
                            console.log("editor of " + allRecipes[i].name);
                            tempRecipe = { recipe: allRecipes[i] };
                            $scope.recipes.push(tempRecipe.recipe);
                            $scope.recipes[$scope.recipes.length - 1].ownership = "editor";
                        }
                    }
                    for (var n = 0 ; n < allRecipes[i].viewers.length ; n++) {
                        if (allRecipes[i].viewers[n] === $scope.user) {
                            console.log("viewer of " + allRecipes[i].name);
                            tempRecipe = { recipe: allRecipes[i] };
                            $scope.recipes.push(tempRecipe.recipe);
                            $scope.recipes[$scope.recipes.length - 1].ownership = "viewer";
                        }
                    }
                }
                console.log("finished getting recipes");
                $scope.updateStoreIngredientList();
            });
            ogRecipes = JSON.parse(JSON.stringify($scope.recipes));
            $http.get("/api/Ingredients?user=".concat($scope.user))
                .success(function (data) {
                    $scope.ingredients = data;
                    console.log("we have " + $scope.ingredients.length + " ingredients for " + $scope.user);
                    console.log("finished getting ingredients");
                    $scope.updateStoreIngredientList();
                    setStoreIsClicked();
                });

            $http.get("/api/Store/?user=".concat($scope.user))
                .success(function (data) {
                    $scope.stores = data[0].store;
                    console.log("finished getting stores");
                    $scope.updateStoreIngredientList();
                });
        });
    }
    var setStoreIsClicked = function () {
        for (var i = 0; i < $scope.ingredients.length; i++) {
            $scope.storeIsClicked[i] = false;
        }
    }
    $scope.addStore = function () {
        var newStoreName = prompt("Enter the store name");
        var isDefault = confirm("Will " + newStoreName + " be your primary store?\nYes:OK No:Cancel")
        var output = {};
        if (isDefault) {
            for (var i = 0; i < $scope.stores.length; i++) {
                $scope.stores[i].defaultStore = false;
            }
        }
        $scope.stores.push({ name: newStoreName, defaultStore: isDefault });
        output = { _id: $scope.user, store: $scope.stores };
        $http.put("/api/Store?user=".concat($scope.user), output);
        $scope.updateStoreIngredientList();
    }
    $scope.deleteStore = function (index) {
        var wasDefault = $scope.stores[index].defaultStore;
        var newStores = new Array;
        var ingredientIndex = 0;
        if (confirm("This will permanently remove " + $scope.stores[index].name + ".")) {
            if (wasDefault) {
                $scope.defaultStoreIndex = -1;
                confirm("You've deleted your default store. Please set a new default store.")
            }
            //assign ingredients to default store
            for (var i = 0; i < $scope.storeIngredientList[index].ingredients.length; i++) {
                for (var n = 0; n < $scope.ingredients.length; n++) {
                    if ($scope.ingredients[n].name == $scope.storeIngredientList[index].ingredients[i].name) {
                        ingredientIndex = n;
                    }
                }
                $scope.ingredients[ingredientIndex].store = -1;
                $http.put("/api/Ingredients", $scope.ingredients[ingredientIndex]);
            }

            //decrement the store index of any ingredients in stores greater than store being deleted
            for (var i = 0; i < $scope.ingredients.length; i++) {
                if ($scope.ingredients[i].store > index) {
                    $scope.ingredients[i].store--;
                    $http.put("/api/Ingredients", $scope.ingredients[i]);
                }
            }
            //create new store list
            for (var i = 0; i < $scope.stores.length; i++) {
                if (i != index) {
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
    }
    $scope.setDefaultStore = function (index) {
        for (var i = 0; i < $scope.stores.length; i++) {
            $scope.stores[i].defaultStore = false;
        }
        $scope.stores[index].defaultStore = true;
        $scope.updateStoreIngredientList();
    }
    var isInStores = function (ingredientObject) {
        var ingredientIndex = 0;
        var isThere = false;
        var storeIndex = 0;
        var name = ingredientObject.name;
        var unit = ingredientObject.unit;
        var output = {};
        for (var i = 0; i < $scope.ingredients.length; i++) {
            if ($scope.ingredients[i].name == ingredientObject.name) {
                storeIndex = $scope.ingredients[i].store;
            }
        }
        if (storeIndex === -1) {
            storeIndex = $scope.defaultStoreIndex;
        }
        console.log("store index: " + storeIndex);
        for (var i = 0; i < $scope.storeIngredientList[storeIndex].ingredients.length; i++) {
            if ($scope.storeIngredientList[storeIndex].ingredients[i].name === name &&
                $scope.storeIngredientList[storeIndex].ingredients[i].unit === unit) {
                isThere = true;
                ingredientIndex = i;
                break;
            };
        };
        output = { isThere: isThere, storeIndex: storeIndex, ingredientIndex: ingredientIndex }
        return output;
    }
    $scope.updateStoreIngredientList = function () {
        console.log("updating store ingredient list");
        var storeIndex = 0;
        var isInStore = [];
        $scope.storeIngredientList = new Array;
        var ingredientIndex = 0;
        var ingredientName = "";
        //find default store
        for (var i = 0; i < $scope.stores.length; i++) {
            if ($scope.stores[i].defaultStore === true) {
                $scope.defaultStoreIndex = i;
            }
        }
        for (var i = 0; i < $scope.stores.length; i++) {
            $scope.storeIngredientList.push($scope.stores[i]);
            $scope.storeIngredientList[i].ingredients = [];
        }
        for (var i = 0; i < $scope.recipes.length; i++) {
            if ($scope.recipes[i].included) {
                for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                    isInStore = isInStores($scope.recipes[i].ingredients[n]);
                    if (isInStore.isThere) {
                        $scope.storeIngredientList[isInStore.storeIndex].ingredients[isInStore.ingredientIndex].count[0] +=
                            ($scope.recipes[i].ingredients[n].count[0] * $scope.recipes[i].multiplier);
                        $scope.storeIngredientList[isInStore.storeIndex].ingredients[isInStore.ingredientIndex].count[1] +=
                            ($scope.recipes[i].ingredients[n].count[1] * $scope.recipes[i].multiplier);
                    }
                    else {
                        $scope.storeIngredientList[isInStore.storeIndex].ingredients.push({
                            count: [($scope.recipes[i].ingredients[n].count[0] * $scope.recipes[i].multiplier),
                                    ($scope.recipes[i].ingredients[n].count[1] * $scope.recipes[i].multiplier),
                                     $scope.recipes[i].ingredients[n].count[2]],
                            unit: $scope.recipes[i].ingredients[n].unit,
                            name: $scope.recipes[i].ingredients[n].name
                        });
                    };
                };
            };
        };
    }
    $scope.incrementRecipe = function (recipeNumber) {
        $scope.recipes[recipeNumber].multiplier++;
        $scope.updateStoreIngredientList();
    }
    $scope.decrementRecipe = function (recipeNumber) {
        if ($scope.recipes[recipeNumber].multiplier > 1) {
            $scope.recipes[recipeNumber].multiplier--;
            $scope.updateStoreIngredientList();
        }
    }
    $scope.saveRecipes = function () {
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (angular.equals($scope.recipes[i], ogRecipes[i])) {
                console.log("nothing has changed in " + ogRecipes[i].name);
            }
            else {
                $http.put("/api/Recipe", $scope.recipes[i]);
            }
        }
    }
    $scope.saveIngredients = function () {

    }
    $scope.updateIngredientStore = function (ingredientIndex, storeIndex) {
        $scope.storeIsClicked[ingredientIndex] = false;
        $scope.ingredients[ingredientIndex].store = storeIndex;
        $http.put("/api/Ingredients", $scope.ingredients[ingredientIndex]).success(function () {
        });
        $scope.updateStoreIngredientList();
    }
    $scope.toggleStoreIsClicked = function (index) {
        for (var i = 0 ; i < $scope.storeIsClicked.length ; i++) {
            if (i != index) {
                $scope.storeIsClicked[i] = false;
            }
        }
        if ($scope.storeIsClicked[index] == true) {
            $scope.storeIsClicked[index] = false;
        }
        else {
            $scope.storeIsClicked[index] = true;
        }
    }
}]);
