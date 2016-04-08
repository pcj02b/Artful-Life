﻿recipeApp.controller('recipeCtrl', ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.recipes = [];
    var allRecipes = [];
    var tempRecipe = {};
    $scope.user = authService.getUser();

    $http.get("/api/Units").success(function (data) {
        $scope.units = data;
    })
    $scope.getFromJSON = function () {
        $http.get("/Data/ingredients.json")
            .success(function (data) {
                $scope.ingredients = data.ingredients;
            })
            .error(function (status) {
                window.alert(status);
            });
    }
    $scope.seedData = function () {
        for (var i = 0; i < $scope.ingredients.length; i++) {
            $http.post("/api/Ingredients", $scope.user, $scope.ingredients[i]);
        };
    };

    $scope.showDisplayTable = false;
    $scope.showEditingTable = false;
    $scope.showShareLink = false;
    $scope.showSharePage = false;

    $scope.selectedRecipe = {};
    $scope.editingRecipe = {};
    selectedRecipeIndex = 0;

    $scope.newIngredientCount = [0, 0, 2];
    $scope.newIngredientUnit = "";
    $scope.newIngredientName = "";
    $scope.newPrepStep = "";
    $scope.newCookStep = "";

    $scope.editingIngredientIndex = -1;
    $scope.editingPrepIndex = -1;
    $scope.editingCookIndex = -1;
    $scope.editingIngredient = false;
    $scope.editingPrep = false;
    $scope.editingCook = false;
    $scope.textIngredients = "";
    $scope.textPrep = "";
    $scope.textCook = "";

    $scope.showSharePage = false;
    $scope.showShareLink = false;
    $scope.shareEmail = "";
    $scope.shareCanEdit = false;
    $scope.showShareEdit = false;

    $scope.deleteIngredientList = [];

    updateRecipes = function () {
        $scope.$apply(function () {
            $scope.user = authService.getUser();
            console.log("updating recipes for " + $scope.user);
            $scope.recipes = [];
            console.log($scope.recipes.length);
            $http.get("/api/Recipe?user=".concat($scope.user)).success(function (data) {
                allRecipes = data;
                for (var i = 0 ; i < allRecipes.length ; i++) {
                    if (allRecipes[i].owner === $scope.user) {
                        console.log("owner of " + allRecipes[i].name);
                        tempRecipe = { recipe: allRecipes[i] };
                        $scope.recipes.push(tempRecipe.recipe);
                        $scope.recipes[$scope.recipes.length - 1].ownership = "owner";
                    }
                    else {
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
                }
                console.log("finished getting recipes");
                $http.get("/api/Ingredients?user=".concat($scope.user)).success(function (data) {
                    $scope.ingredients = data;
                    console.log("we have " + $scope.ingredients.length + " ingredients for " + $scope.user);
                    console.log("finished getting ingredients");
                });
            });
        })
    }
    $scope.selectRecipe = function (index) {
        $scope.showDisplayTable = true;
        $scope.showEditingTable = false;
        $scope.showShareLink = true;
        $scope.showSharePage = false;
        $scope.selectedRecipe = $scope.recipes[index];
        selectedRecipeIndex = index;
        $scope.deleteIngredientList = [];
    }
    $scope.showShareRecipe = function () {
        $scope.showDisplayTable = false;
        $scope.showEditingTable = false;
        $scope.showSharePage = true;
        if ($scope.recipes[selectedRecipeIndex].ownership === "owner") {
            $scope.showShareEdit = true;
        }
        $scope.showShareLink = false;
    }
    $scope.shareRecipe = function () {
        if ($scope.shareCanEdit) {
            if ($scope.recipes[selectedRecipeIndex].ownership === "owner") {
                $scope.recipes[selectedRecipeIndex].editors.push($scope.shareEmail);
            }
            else {
                window.alert("only the owner can share the ability to edit.");
                return;
            };
        }
        else {
            $scope.recipes[selectedRecipeIndex].viewers.push($scope.shareEmail);
        };
        $http.put("/api/Recipe", $scope.recipes[selectedRecipeIndex]);
        window.alert($scope.recipes[selectedRecipeIndex].name + " shared with " + $scope.shareEmail);
        $scope.showSharePage = false;
        $scope.showShareLink = true;
        $scope.showShareEdit = false;
    }
    $scope.addIngredient = function () {
        var newIngredient = { count: [$scope.newIngredientCount[0], $scope.newIngredientCount[1], $scope.newIngredientCount[2]], unit: $scope.newIngredientUnit, name: $scope.newIngredientName };
        $scope.editingRecipe.ingredients.push(newIngredient);
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.addTextIngredients = function () {
        $scope.ingredientArray = $scope.textIngredients.split(/\n/);
        $scope.numberArray = [];
        $scope.marker = 0;
        $scope.count = [];
        $scope.unit = [];
        for (var i = 0 ; i < $scope.ingredientArray.length ; i++) {
            if ($scope.ingredientArray[i] != "") {
                var fractionTest = new RegExp(/\d+([\/.]\d+)?/g);
                $scope.count[i] = [];
                $scope.numberArray[i] = $scope.ingredientArray[i].match(fractionTest);
                if ($scope.ingredientArray[i].search(/\d \d/i) === -1) {
                    if (fractionTest.test($scope.ingredientArray[i])) {
                        if ($scope.numberArray[i].length == 2) {
                            $scope.count[i][0] = $scope.numberArray[i][0];
                            $scope.count[i][1] = $scope.numberArray[i][1].match(/\d+/g)[0];
                            $scope.count[i][2] = $scope.numberArray[i][1].match(/\d+/g)[1];
                            $scope.ingredientArray[i] = $scope.ingredientArray[i].replace("/", "");
                        }
                        if ($scope.numberArray[i].length == 1 && $scope.numberArray[i][0].match(/[/]/) != null) {
                            $scope.count[i][0] = 0;
                            $scope.count[i][1] = $scope.numberArray[i][0].match(/\d+/g)[0];
                            $scope.count[i][2] = $scope.numberArray[i][0].match(/\d+/g)[1];
                            $scope.ingredientArray[i] = $scope.ingredientArray[i].replace("/", "");
                        }
                        if ($scope.numberArray[i].length == 1 && $scope.numberArray[i][0].match(/[/]/) == null) {
                            $scope.count[i][0] = $scope.numberArray[i][0];
                            $scope.count[i][1] = 0;
                            $scope.count[i][2] = 2;
                            $scope.ingredientArray[i] = $scope.ingredientArray[i].replace("/", "");
                        }
                        for (var n = 0; n < 3; n++) {
                            $scope.ingredientArray[i] = $scope.ingredientArray[i].replace($scope.count[i][n], "");
                        }
                    }
                    else {
                        $scope.count[i] = [0, 0, 2];
                    }
                    for (var n = 0 ; n < $scope.units.length ; n++) {
                        for (var r = 0; r < $scope.units[n].name.length ; r++) {
                            $scope.marker = $scope.ingredientArray[i].search(" " + $scope.units[n].name[r] + " ");
                            if ($scope.marker != -1) {
                                $scope.unit[i] = $scope.units[n].unit;
                                $scope.ingredientArray[i] = $scope.ingredientArray[i].replace($scope.units[n].name[r], "");
                            }
                            if (r == $scope.units[n].name.length - 1 && $scope.unit[i] == undefined) {
                                $scope.unit[i] = "";
                            }
                        }
                    }
                }
                else {
                    $scope.count[i][0] = $scope.ingredientArray[i].charAt($scope.ingredientArray[i].search(/\d \d/i));
                    $scope.ingredientArray[i] = $scope.ingredientArray[i].replace(/\d /i, "");
                    $scope.count[i][1] = 0;
                    $scope.count[i][2] = 2;
                    $scope.unit[i] = "";

                }
                $scope.ingredientArray[i] = $scope.ingredientArray[i].trim();
                $scope.count[i][0] = Number($scope.count[i][0]);
                $scope.count[i][1] = Number($scope.count[i][1]);
                $scope.count[i][2] = Number($scope.count[i][2]);
                $scope.editingRecipe.ingredients.push({ count: $scope.count[i], unit: $scope.unit[i], name: $scope.ingredientArray[i], "store": 0 });
            }
        }
        $scope.textIngredients = "";
    }
    $scope.addPrepStep = function () {
        var stepArray = $scope.newPrepStep.split(/\n/);
        for (var i = 0; i < stepArray.length; i++) {
            $scope.editingRecipe.prep.push({ step: stepArray[i] });
        }
        $scope.newPrepStep = "";
    }
    $scope.addCookStep = function () {
        var stepArray = $scope.newCookStep.split(/\n/);
        for (var i = 0; i < stepArray.length; i++) {
            $scope.editingRecipe.cook.push({
                step: stepArray[i]
            });
        }
        $scope.newCookStep = "";
    }
    $scope.saveRecipe = function () {
        var isInIngredients = false;
        var newIngredient = {};
        var alreadyThere = true;
        //for each ingredient in editing recipe check to see if it's already in the ingredient list
        for (var i = 0 ; i < $scope.editingRecipe.ingredients.length ; i++) {
            for (var n = 0 ; n < $scope.ingredients.length ; n++) {
                if ($scope.editingRecipe.ingredients[i].name === $scope.ingredients[n].name) {
                    console.log($scope.editingRecipe.ingredients[i].name + " already there");
                    isInIngredients = true;
                }
            }
            if (!isInIngredients) {
                console.log("there was a new ingredient to add")
                console.log("namely, " + $scope.editingRecipe.ingredients[i].name);
                newIngredient = { user: $scope.user, name: $scope.editingRecipe.ingredients[i].name, store: -1 };
                $scope.ingredients.push(newIngredient);
                $http.post("/api/Ingredients", newIngredient);
            }
            isInIngredients = false;
        }
        //delete any ingredients from deleteIngredients array
        for (var i = 0; i < $scope.deleteIngredientList.length; i++) {
            $http.delete("/api/Ingredients?name=".concat($scope.deleteIngredientList[i], "&user=", $scope.user));
        }

        //check to see if recipe is already there
        if (angular.equals($scope.editingRecipe._id, undefined)) {
            alreadyThere = false;
        }
        if (!alreadyThere) {
            console.log("creating new recipe");
            var success = $http.post("/api/Recipe", $scope.editingRecipe)
                .success(function (status) {
                })
                .error(function (status) {
                    console.log("something went wrong saving new recipe");
                });
            if (success) {
                $scope.recipes.push($scope.editingRecipe);
                $scope.showDisplayTable = false;
                selectedRecipeIndex = $scope.recipes.length;
            }
        }
        else {
            if (confirm("Save changes to " + $scope.editingRecipe.name)) {
                var success = $http.put("/api/Recipe", $scope.editingRecipe)
                    .success(function (status) {
                        console.log(status);
                    })
                    .error(function (status) {
                        console.log("something went wrong saving existing recipe");
                    });
                if (success) {
                    $scope.recipes[selectedRecipeIndex] = $scope.editingRecipe;
                    $scope.showEditingTable = false;
                }
            }
        }
        $scope.editingRecipe = { name: "", ingredients: [], prep: [], cook: [], included: false, multiplier: 1, owner: $scope.user, editors: [], viewers: [] };
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
        $scope.newPrepStep = "";
        $scope.newCookStep = "";
        $scope.showDisplayTable = true;
        $scope.showEditingTable = false;
        //updateRecipes();
    }
    $scope.addRecipe = function () {
        $scope.editingRecipe = { name: "", ingredients: [], prep: [], cook: [], included: false, multiplier: 1, owner: $scope.user, editors: [], viewers: [] };
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
        $scope.newPrepStep = "";
        $scope.newCookStep = "";
        $scope.showDisplayTable = false;
        $scope.showEditingTable = true;
        $scope.showShareLink = false;
    }
    $scope.editRecipe = function () {
        $scope.showShareLink = false;
        $scope.editingRecipe = $scope.recipes[selectedRecipeIndex];
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
        $scope.newPrepStep = "";
        $scope.newCookStep = "";
        if ($scope.recipes[selectedRecipeIndex].ownership != "viewer") {
            $scope.editingRecipe = $scope.recipes[selectedRecipeIndex];
            $scope.showDisplayTable = false;
            $scope.showEditingTable = true;
        }
        else {
            window.alert("You may only view this recipe.");
        }
    }
    $scope.selectEditingIngredient = function (index) {
        $scope.editingIngredient = true;
        $scope.newIngredientCount = $scope.editingRecipe.ingredients[index].count;
        $scope.newIngredientUnit = $scope.editingRecipe.ingredients[index].unit;
        $scope.newIngredientName = $scope.editingRecipe.ingredients[index].name;
        $scope.editingIngredientIndex = index;
    }
    $scope.selectEditingPrep = function (index) {
        $scope.editingPrep = true;
        $scope.newPrepStep = $scope.editingRecipe.prep[index].step;
        $scope.editingPrepIndex = index;
    }
    $scope.selectEditingCook = function (index) {
        $scope.editingCook = true;
        $scope.newCookStep = $scope.editingRecipe.cook[index].step;
        $scope.editingCookIndex = index;
    }
    $scope.saveIngredient = function () {
        var wasInIngredients = false;
        var wasInOtherRecipe = false;
        for (var i = 0; i < $scope.ingredients.length; i++) {
            if ($scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name === $scope.ingredients[i].name) {
                wasInIngredients = true;
            }
        }
        for (var i = 0; i < $scope.recipes.length; i++) {
            for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                if ($scope.recipes[i].ingredients[n].name === $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name && i != selectedRecipeIndex) {
                    wasInOtherRecipe = true;
                }
            }
        }
        if (!wasInOtherRecipe && wasInIngredients) {
            $scope.deleteIngredientList.push($scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name);
            console.log("will to delete " + $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name + " upon saving recipe");
        }

        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].count = $scope.newIngredientCount;
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].unit = $scope.newIngredientUnit;
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name = $scope.newIngredientName;
        $scope.editingIngredient = false;
        $scope.editingIngredientIndex = -1;
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.unsaveIngredient = function () {
        $scope.editingIngredient = false;
        $scope.editingIngredientIndex = -1;
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.savePrepStep = function () {
        $scope.editingRecipe.prep[$scope.editingPrepIndex].step = $scope.newPrepStep;
        $scope.editingPrep = false;
        $scope.newPrepStep = "";
    }
    $scope.unsavePrepStep = function () {
        $scope.editingPrep = false;
        $scope.editingPrepIndex = -1;
        $scope.newPrepStep = "";
    }
    $scope.saveCookStep = function () {
        $scope.editingRecipe.cook[$scope.editingCookIndex].step = $scope.newCookStep;
        $scope.editingCook = false;
        $scope.editingCookIndex = -1;
        $scope.editingPrepIndex = -1;
        $scope.newCookStep = "";
    }
    $scope.unsaveCookStep = function () {
        $scope.editingCook = false;
        $scope.editingCookIndex = -1;
        $scope.newCookStep = "";
    }
    $scope.removeIngredient = function () {

        var wasInIngredients = false;
        var wasInOtherRecipe = false;
        for (var i = 0; i < $scope.ingredients.length; i++) {
            if ($scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name === $scope.ingredients[i].name) {
                wasInIngredients = true;
            }
        }
        for (var i = 0; i < $scope.recipes.length; i++) {
            for (var n = 0; n < $scope.recipes[i].ingredients.length; n++) {
                if ($scope.recipes[i].ingredients[n].name === $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name && i != selectedRecipeIndex) {
                    wasInOtherRecipe = true;
                }
            }
        }
        if (!wasInOtherRecipe && wasInIngredients) {
            $scope.deleteIngredientList.push($scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name);
            console.log("will to delete " + $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name + " upon saving recipe");
        }
        var editingIngredients = []; //local temp list
        for (var i = 0; i < $scope.editingRecipe.ingredients.length; i++) {
            if (i != $scope.editingIngredientIndex) {
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
        var isInAnotherRecipe = false;
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (i != selectedRecipeIndex) {
                newRecipes.push($scope.recipes[i]);
            }
        }
        if (confirm("This will permanently remove " + $scope.recipes[selectedRecipeIndex].name)) {
            for (var i = 0; i < $scope.recipes[selectedRecipeIndex].ingredients.length; i++) {
                for (var n = 0; n < newRecipes.length; n++) {
                    for (var m = 0; m < newRecipes[n].ingredients.length; m++) {
                        if (newRecipes[n].ingredients[m].name === $scope.recipes[selectedRecipeIndex].ingredients[i].name) {
                            isInAnotherRecipe = true;
                        }
                    }
                }
                console.log($scope.recipes[selectedRecipeIndex].ingredients[i].name);
                console.log(isInAnotherRecipe);
                if (!isInAnotherRecipe) {
                    console.log("deleting ingredient: " + $scope.recipes[selectedRecipeIndex].ingredients[i].name);
                    var deleteURI = encodeURI("/api/Ingredients?name=".concat($scope.recipes[selectedRecipeIndex].ingredients[i].name, "&user=", $scope.user));
                    $http.delete(deleteURI);
                }
            }
            $http.delete("/api/Recipe?_id=".concat($scope.recipes[selectedRecipeIndex]._id)).success(function (status) {
            })
            .error(function (status) {
                console.log("something went wrong deleting a recipe");
            });
            $scope.recipes = newRecipes;
            selectedRecipeIndex = 0;
            $scope.showDisplayTable = false;
            $scope.showEditingTable = false;
        }
    }
    $scope.moveIngredientUp = function () {
        var lowIngredient = {}, prop;
        for (prop in $scope.editingRecipe.ingredients[$scope.editingIngredientIndex - 1]) {
            lowIngredient[prop] = $scope.editingRecipe.ingredients[$scope.editingIngredientIndex - 1][prop];
        }
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex - 1] = $scope.editingRecipe.ingredients[$scope.editingIngredientIndex];
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex] = lowIngredient;
        $scope.selectEditingIngredient($scope.editingIngredientIndex - 1);
    }
    $scope.moveIngredientDown = function () {
        var highIngredient = {}, prop;
        for (prop in $scope.editingRecipe.ingredients[$scope.editingIngredientIndex + 1]) {
            highIngredient[prop] = $scope.editingRecipe.ingredients[$scope.editingIngredientIndex + 1][prop];
        }
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex + 1] = $scope.editingRecipe.ingredients[$scope.editingIngredientIndex];
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex] = highIngredient;
        $scope.selectEditingIngredient($scope.editingIngredientIndex + 1);
    }
    $scope.movePrepUp = function () {
        var lowPrep = {}, prop;
        for (prop in $scope.editingRecipe.prep[$scope.editingPrepIndex - 1]) {
            lowPrep[prop] = $scope.editingRecipe.prep[$scope.editingPrepIndex - 1][prop];
        }
        $scope.editingRecipe.prep[$scope.editingPrepIndex - 1] = $scope.editingRecipe.prep[$scope.editingPrepIndex];
        $scope.editingRecipe.prep[$scope.editingPrepIndex] = lowPrep;
        $scope.selectEditingPrep($scope.editingPrepIndex - 1);
    }
    $scope.movePrepDown = function () {
        var highPrep = {}, prop;
        for (prop in $scope.editingRecipe.prep[$scope.editingPrepIndex + 1]) {
            highPrep[prop] = $scope.editingRecipe.prep[$scope.editingPrepIndex + 1][prop];
        }
        $scope.editingRecipe.prep[$scope.editingPrepIndex + 1] = $scope.editingRecipe.prep[$scope.editingPrepIndex];
        $scope.editingRecipe.prep[$scope.editingPrepIndex] = highPrep;
        $scope.selectEditingPrep($scope.editingPrepIndex + 1);
    }
    $scope.moveCookUp = function (index) {
        var lowCook = $.extend({}, $scope.editingRecipe.cook[index - 1]);
        $scope.editingRecipe.cook[index - 1] = $scope.editingRecipe.cook[index];
        $scope.editingRecipe.cook[index] = lowCook;
        $scope.selectEditingCook($scope.editingCookIndex - 1);
    }
    $scope.moveCookDown = function (index) {
        var highCook = $.extend({}, $scope.editingRecipe.cook[index + 1]);
        $scope.editingRecipe.cook[index + 1] = $scope.editingRecipe.cook[index];
        $scope.editingRecipe.cook[index] = highCook;
        $scope.selectEditingCook($scope.editingCookIndex + 1);

    }
}]);