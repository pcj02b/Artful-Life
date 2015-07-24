var recipeApp = angular.module("recipeApp");

recipeApp.controller("storeCtrl", ["$scope", "$rootScope", "$http", function ($scope, $rootScope, $http) {
    $scope.recipes = "";
    var ogRecipes = "";
    $http.get("/api/Recipe")
        .success(function (data) {
            $scope.recipes = data;
            console.log("finished getting recipes");
            ogRecipes = JSON.parse(JSON.stringify($scope.recipes));
            $scope.updateStoreIngredientList();
        });
    $scope.ingredients = "";
    $scope.storeIsClicked = [];
    $http.get("/api/Ingredients")
        .success(function (data) {
            $scope.ingredients = data;
            console.log("finished getting ingredients");
            $scope.updateStoreIngredientList();
            setStoreIsClicked();
        });
    $scope.stores = "";
    $http.get("/api/Store")
        .success(function (data) {
            $scope.stores = data;
            console.log("finished getting stores");
            $scope.updateStoreIngredientList();
        })

    function setStoreIsClicked() {
        for (var i = 0; i < $scope.ingredients.length; i++) {
            $scope.storeIsClicked[i] = false;
        }
    }
    $scope.showStuff = function () {
        $scope.setStoreIngredientList();
    }
    $scope.seedData = function () {
        for (var i = 0; i < $scope.stores.length; i++) {
            $http.post("/api/Store", $scope.stores[i]);
        };
    }
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
    }
    $scope.deleteStore = function (index) {
        if (confirm("This will permanently remove " + $scope.stores[index].name + ".")) {
            //find out if it was the default store
            var wasDefault = $scope.stores[index].defaultStore;
            //if deleting default store assign default to store 0
            //don't delete store 0
            var defaultStoreIndex = 0;
            if (wasDefault) {
                $scope.stores[0].defaultStore = true;
                defaultStoreIndex = index;
            }
            //find default store
            else {
                defaultStoreIndex = 0;
                for (var i = 0; i < $scope.stores.length; i++) {
                    if ($scope.stores[i].defaultStore == true) {
                        defaultStoreIndex = i;
                    }
                }
            }
            //assign ingredients to default store
            var ingredientIndex = 0; 
            for (var i = 0; i < $scope.storeIngredientList[index].ingredients.length; i++) {
                for (var n = 0; n < $scope.ingredients.length; n++) {
                    if ($scope.ingredients[n].name == $scope.storeIngredientList[index].ingredients[i].name) {
                        ingredientIndex = n;
                    }
                }
                $scope.ingredients[ingredientIndex].store = defaultStoreIndex;
                $http.put("/api/Ingredients", $scope.ingredients[ingredientIndex]);
            }
            //decrement the store index of any ingredients in stores greater than store being deleted
            for (var i = 0; i < $scope.ingredients.length; i++) {
                if ($scope.ingredients[i].store >= index) {
                    $scope.ingredients[i].store--;
                    $http.put("/api/Ingredients", $scope.ingredients[i]);
                }
            }
            //create new store list
            var newStores = new Array;
            for (var i = 0; i < $scope.stores.length; i++) {
                if (i != index) {
                    newStores.push($scope.stores[i]);
                }
            }
            //delete store in mongo
            var uri = encodeURI("/api/Store/?name=" + $scope.stores[index].name);
            $http.delete(uri).success(function (status) {
            })
            .error(function (status) {
                console.log("something went wrong while deleting a store.");
            });
            //update local store list 
            $scope.stores = newStores;
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
    }
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
        $http.put("/api/Ingredients", $scope.ingredients[ingredientIndex]).success(function(){
        });
        $scope.updateStoreIngredientList();
    }
    $scope.toggleStoreIsClicked = function(index){
        if ($scope.storeIsClicked[index] == true) {
            $scope.storeIsClicked[index] = false;
        }
        else {
            $scope.storeIsClicked[index] = true;
        }
        console.log("storeIsClicked[" + index + "] is now " + $scope.storeIsClicked[index] + ".");
    }
}]);
