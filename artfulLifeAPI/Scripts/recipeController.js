var recipeApp = angular.module("recipeApp");

recipeApp.controller('recipeCtrl', function ($scope, $http, recipeService) {
    $scope.recipes = "";
    $http.get("/api/Recipe").success(function (data) {
        $scope.recipes = data;
    });
    $scope.getFromJSON = function () {
        $http.get("/Data/recipes.json")
            .success(function (data) {
                $scope.recipes = data.recipes;
            })
            .error(function (status) {
                window.alert(status);
            });    }
    $scope.getFromMongo = function () {
        $http.get("/api/Recipe").success(function (data, status) {
            $scope.recipes = data;
        });
    }
    $scope.seedData = function () {
        for (var i = 0; i < $scope.recipes.length; i++) {
            $http.post("/api/Recipe", $scope.recipes[i]);
        };
    };
    $scope.showStuff = function () {
        recipeService.set($scope.recipes);
        recipeService.showLength();
    }

    $scope.showDisplayTable = false;
    $scope.showCreationTable = false;
    $scope.showEditingTable = false;

    $scope.newRecipe = {};
    $scope.newRecipe.ingredients = [];
    $scope.newIngredientCount = 1;
    $scope.newIngredientUnit = "";
    $scope.newIngredientName = "";
    $scope.newRecipe.prep = [];
    $scope.newPrepStep = "";
    $scope.newRecipe.cook = [];
    $scope.newCookStep = "";

    $scope.selectedRecipe = "";
    selectedRecipeIndex = 0;

    $scope.editingRecipe = []

    $scope.selectRecipe = function (index) {
        $scope.showDisplayTable = true;
        $scope.showCreationTable = false;
        $scope.showEditingTable = false;
        $scope.selectedRecipe = $scope.recipes[index];
        selectedRecipeIndex = index;
        $scope.showTable = true;
    }
    $scope.addIngredient = function () {
        newIngredient = { "count": $scope.newIngredientCount, "unit": $scope.newIngredientUnit, "name": $scope.newIngredientName, "store": 0 };
        $scope.newRecipe.ingredients.push(newIngredient);
        $scope.newIngredientCount = 1;
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.addPrepStep = function () {
        $scope.newRecipe.prep.push({ step: $scope.newPrepStep });
        $scope.newPrepStep = "";
    }
    $scope.addCookStep = function () {
        $scope.newRecipe.cook.push({ step: $scope.newCookStep });
        $scope.newCookStep = "";
    }
    $scope.saveNewRecipe = function () {
        var alreadyThere = false;
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (angular.equals($scope.newRecipe.name, $scope.recipes[i].name)) {
                alreadyThere = true;
            }
        }
        if (!alreadyThere) {
            $http.post("/api/Recipe", $scope.newRecipe).success(function (status) {
                $scope.recipes.push($scope.newRecipe);
            })
            .error(function (status) {
                console.log("something went wrong");
            });
        }
        else { window.alert("A recipe by that name already exists."); }
        $scope.showTable = true;
        $scope.newRecipe = {};
        $scope.newRecipe.ingredients = [];
        $scope.newRecipe.prep = [];
        $scope.newRecipe.cook = [];
    }
    $scope.addRecipe = function () {
        $scope.newRecipe = {};
        $scope.newRecipe.ingredients = [];
        $scope.newRecipe.prep = [];
        $scope.newRecipe.cook = [];

        $scope.showDisplayTable = false;
        $scope.showCreationTable = true;
        $scope.showEditingTable = false;
    }
    $scope.editRecipe = function () {
        $scope.editingRecipe = $scope.recipes[selectedRecipeIndex];
        $scope.showDisplayTable = false;
        $scope.showCreationTable = false;
        $scope.showEditingTable = true;
    }
    $scope.addToEditingIngredients = function () {
        $scope.editingRecipe.ingredients.push({ count: $scope.newIngredientCount, unit: $scope.newIngredientUnit, name: $scope.newIngredientName, included: false, store: -1 });
        $scope.newIngredient = [];
        $scope.newIngredientCount = 1;
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.addToEditingPrep = function () {
        $scope.editingRecipe.prep.push({ step: $scope.newPrepStep });
        $scope.newPrepStep = "";
    };
    $scope.addToEditingCook = function () {
        $scope.editingRecipe.cook.push({ step: $scope.newCookStep });
        $scope.newCookStep = "";
    };
    $scope.saveEditedRecipe = function () {
        if (confirm("Save changes to " + $scope.recipes[selectedRecipeIndex].name)) {
            $http.put("/api/Recipe", $scope.editingRecipe).success(function (status) {
                $scope.recipes[selectedRecipeIndex] = $scope.editingRecipe;
            })
            .error(function (status) {
                console.log("something went wrong");
            });
        }
        $scope.showDisplayTable = true;
        $scope.showCreationTable = false;
        $scope.showEditingTable = false;
    }
    $scope.removeIngredient = function (index) {
        var editingIngredients = []; //local temp list
        for (var i = 0; i < $scope.editingRecipe.ingredients.length; i++) {
            if (i != index) {
                editingIngredients.push($scope.editingRecipe.ingredients[i]);
            }
        }
        $scope.editingRecipe.ingredients = editingIngredients;
    }
    $scope.removePrep = function (index) {
        var editingPrep = []; //local temp list
        for (var i = 0; i < $scope.editingRecipe.prep.length; i++) {
            if (i != index) {
                editingPrep.push($scope.editingRecipe.prep[i]);
            }
        }
        $scope.editingRecipe.prep = editingPrep;
    };
    $scope.removeCook = function (index) {
        var editingCook = []; //local temp list
        for (var i = 0; i < $scope.editingRecipe.cook.length; i++) {
            if (i != index) {
                editingCook.push($scope.editingRecipe.cook[i]);
            }
        }
        $scope.editingRecipe.cook = editingCook;
    };
    $scope.removeRecipe = function () {
        var newRecipes = []; //local temp list
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (i != selectedRecipeIndex) {
                newRecipes.push($scope.recipes[i]);
            }
        }
        if (confirm("This will permanently remove " + $scope.recipes[selectedRecipeIndex].name)) {
            var url = "/api/Recipe/" + $scope.recipes[selectedRecipeIndex].name;
            $http.delete(url).success(function (status) {
            })
            .error(function (status) {
                console.log("something went wrong");
            });
            $scope.recipes = newRecipes;
        }
    }
});