﻿var recipeApp = angular.module('recipeApp', []);
recipeApp.controller('recipeCtrl', function ($scope, $http) {
    $scope.recipes = "";
    $scope.getFromJSON = function () {
        $http.get("/Data/recipes.json")
            .success(function (data) {
                $scope.recipes = data.recipes;
            })
            .error(function (status) {
                window.alert(status);
            });
    }
    $scope.getFromMongo = function () {
        $http.get("/api/Recipe").success(function (response, status) {
            $scope.recipes = response;
        });
    }
    $scope.seedData = function () {
        for (var i = 0; i < $scope.recipes.length; i++) {
            $http.post("/api/Recipe", $scope.recipes[i]);
        };
    };
    $scope.showStuff = function () {
        window.alert($scope.recipes.length);
    }
    $scope.showDisplayTable = false;
    $scope.showCreationTable = false;
    $scope.showEditingTable = false;

    $scope.newName = "";
    $scope.newIngredients = [];
    $scope.newIngredient = [];
    $scope.newIngredientCount = 1;
    $scope.newIngredientUnit = "";
    $scope.newIngredientName = "";
    $scope.newPrep = [];
    $scope.newPrepStep = "";
    $scope.newCook = [];
    $scope.newCookStep = "";

    $scope.editingRecipe = []

    $scope.selectRecipe = function (index) {
        $scope.showDisplayTable = true;
        $scope.showCreationTable = false;
        $scope.showEditingTable = false;
        $scope.selectedRecipe = $scope.recipes[index];
        $scope.showTable = true;
    }
    $scope.addIngredient = function () {
        $scope.newIngredients.push({ count: $scope.newIngredientCount, unit: $scope.newIngredientUnit, name: $scope.newIngredientName, included: false, store: -1 });
        $scope.newIngredient = [];
        $scope.newIngredientCount = 1;
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.addPrepStep = function () {
        $scope.newPrep.push({ step: $scope.newPrepStep });
        $scope.newPrepStep = "";
    }
    $scope.addCookStep = function () {
        $scope.newCook.push({ step: $scope.newCookStep });
        $scope.newCookStep = "";
    }
    $scope.saveNewRecipe = function () {
        var alreadyThere = false;
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (angular.equals($scope.newName, $scope.recipes[i].name)) {
                alreadyThere = true;
            }
        }
        if (!alreadyThere) {
            $scope.recipes.push({ name: $scope.newName, ingredients: $scope.newIngredients, prep: $scope.newPrep, cook: $scope.newCook });
            $http.post("http://localhost:60864/Data/recipes.json", $scope.recipes).success(function (data, status) {
                window.alert("good stuff");
            })
            .error(function (data, status) {
                window.alert(status);
            });
            window.alert("data saved");
        }
        else { window.alert("already there"); }
        $scope.showTable = true;

    }
    $scope.addRecipe = function () {
        $scope.showDisplayTable = false;
        $scope.showCreationTable = true;
        $scope.showEditingTable = false;
        $scope.selectedName = "";
        $scope.selectedIngredients = [];
        $scope.selectedPrep = "";
        $scope.selectedCook = "";
    }
    $scope.editRecipe = function () {
        $scope.showDisplayTable = false;
        $scope.showCreationTable = false;
        $scope.showEditingTable = true;
        $scope.editingRecipe = $scope.recipes[selectedRecipeIndex];
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
            $scope.recipes[selectedRecipeIndex] = $scope.editingRecipe;
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
            $scope.recipes = newRecipes;
        }
    }
});