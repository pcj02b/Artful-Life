﻿var recipeApp = angular.module("recipeApp");

recipeApp.controller('recipeCtrl', function ($scope, $http) {
    $scope.recipes = [];
    var allRecipes = [];
    var tempRecipe = {};
    var user = localStorage.getItem("user");
    $http.get("/api/Recipe").success(function (data) {
        allRecipes = data;
        for (var i = 0 ; i < allRecipes.length ; i++) {
            if (allRecipes[i].owner === user) {
                console.log("owner of " + allRecipes[i].name);
                tempRecipe = { recipe: allRecipes[i] };
                $scope.recipes.push(tempRecipe.recipe);
                $scope.recipes[$scope.recipes.length - 1].ownership = "owner";
            }
            for (var n = 0 ; n < allRecipes[i].editors.length ; n++) {
                if (allRecipes[i].editors[n] === user) {
                    console.log("editor of " + allRecipes[i].name);
                    tempRecipe = { recipe: allRecipes[i] };
                    $scope.recipes.push(tempRecipe.recipe);
                    $scope.recipes[$scope.recipes.length - 1].ownership = "editor";
                }
            }
            for (var n = 0 ; n < allRecipes[i].viewers.length ; n++) {
                if (allRecipes[i].viewers[n] === user) {
                    console.log("viewer of " + allRecipes[i].name);
                    tempRecipe = { recipe: allRecipes[i] };
                    $scope.recipes.push(tempRecipe.recipe);
                    $scope.recipes[$scope.recipes.length - 1].ownership = "viewer";
                }
            }
        }
    });
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
        $http.get("/api/Recipe").success(function (data, status) {
            $scope.recipes = data;
        });
    }
    $scope.seedData = function () {
        for (var i = 0; i < $scope.recipes.length; i++) {
            $http.post("/api/Recipe", $scope.recipes[i]);
        };
    };

    $scope.showDisplayTable = false;
    $scope.showEditingTable = false;
    $scope.showShareLink = false;
    $scope.showSharePage = false;

    $scope.selectedRecipe = {};
    selectedRecipeIndex = 0;

    $scope.editingRecipe = { name: "", ingredients: [], prep: [], cook: [], included: false, multiplier: 1 };

    $scope.newIngredientCount = [0,0,2];
    $scope.newIngredientUnit = "";
    $scope.newIngredientName = "";
    $scope.newPrepStep = {};
    $scope.newCookStep = {};

    $scope.editingIngredientIndex = 0;
    $scope.editingPrepIndex = 0;
    $scope.editingCookIndex = 0;
    $scope.editingIngredient = false;
    $scope.editingPrep = false;
    $scope.editingCook = false;
    $scope.textIngredients = "";
    $scope.textPrep = "";
    $scope.textCook = "";

    updateRecipes = function () {
        $scope.$apply(function(){
        console.log("updating recipes");
        user = localStorage.getItem("user");
        $scope.recipes = [];
        for (var i = 0 ; i < allRecipes.length ; i++) {
            if (allRecipes[i].owner === user) {
                console.log("owner of " + allRecipes[i].name);
                tempRecipe = { recipe: allRecipes[i] };
                $scope.recipes.push(tempRecipe.recipe);
                $scope.recipes[$scope.recipes.length - 1].ownership = "owner";
            }
            for (var n = 0 ; n < allRecipes[i].editors.length ; n++) {
                if (allRecipes[i].editors[n] === user) {
                    console.log("editor of " + allRecipes[i].name);
                    tempRecipe = { recipe: allRecipes[i] };
                    $scope.recipes.push(tempRecipe.recipe);
                    $scope.recipes[$scope.recipes.length - 1].ownership = "editor";
                }
            }
            for (var n = 0 ; n < allRecipes[i].viewers.length ; n++) {
                if (allRecipes[i].viewers[n] === user) {
                    console.log("viewer of " + allRecipes[i].name);
                    tempRecipe = { recipe: allRecipes[i] };
                    $scope.recipes.push(tempRecipe.recipe);
                    $scope.recipes[$scope.recipes.length - 1].ownership = "viewer";
                }
            }
        }
        console.log("scope recipe length: " + $scope.recipes.length);
        })
    }

    $scope.selectRecipe = function (index) {
        $scope.showDisplayTable = true;
        $scope.showEditingTable = false;
        $scope.showShareLink = true;
        $scope.showSharePage = false;
        $scope.selectedRecipe = $scope.recipes[index];
        selectedRecipeIndex = index;
    }
    $scope.shareRecipe = function () {
        $scope.showDisplayTable = false;
        $scope.showEditingTable = false;
        $scope.showSharePage = true;
    }
    $scope.addIngredient = function () {
        var newIngredient = { count: [$scope.newIngredientCount[0],$scope.newIngredientCount[1],$scope.newIngredientCount[2]], unit: $scope.newIngredientUnit, name: $scope.newIngredientName };
        $scope.editingRecipe.ingredients.push(newIngredient);
        $scope.newIngredientCount = [0,0,2];
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
                if (fractionTest.test($scope.ingredientArray[i])) {
                    console.log("found number");
                    if ($scope.numberArray[i].length == 2) {
                        console.log("found mixed fraction");
                        $scope.count[i][0] = $scope.numberArray[i][0];
                        $scope.count[i][1] = $scope.numberArray[i][1].match(/\d+/g)[0];
                        $scope.count[i][2] = $scope.numberArray[i][1].match(/\d+/g)[1];
                        $scope.ingredientArray[i] = $scope.ingredientArray[i].replace("/", "");
                    }
                    if ($scope.numberArray[i].length == 1 && $scope.numberArray[i][0].match(/[/]/) != null) {
                        console.log("found simple fraction");
                        $scope.count[i][0] = 0;
                        $scope.count[i][1] = $scope.numberArray[i][0].match(/\d+/g)[0];
                        $scope.count[i][2] = $scope.numberArray[i][0].match(/\d+/g)[1];
                        $scope.ingredientArray[i] = $scope.ingredientArray[i].replace("/", "");
                    }
                    if ($scope.numberArray[i].length == 1 && $scope.numberArray[i][0].match(/[/]/) == null) {
                        console.log("found whole number or decimal");
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
                    console.log("no number found")
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
        $scope.editingRecipe.prep.push({ step: $scope.newPrepStep });
        $scope.newPrepStep = "";
    }
    $scope.addCookStep = function () {
        $scope.editingRecipe.cook.push({ step: $scope.newCookStep });
        $scope.newCookStep = "";
    }
    $scope.saveRecipe = function () {
        var savingRecipe = jQuery.extend({},$scope.editingRecipe);
        var isInIngredients = false;
        var newIngredient = {};
        for (var i = 0 ; i < savingRecipe.ingredients.length ; i++) {
            for (var n = 0 ; n < $scope.ingredients.length ; n++){
                if (savingRecipe.ingredients[i].name == $scope.ingredients[n].name) {
                    isInIngredients = true;
                }
            }
            if (!isInIngredients) {
                console.log("there was something to add")
                newIngredient = { name: savingRecipe.ingredients[i].name, store: -1 };
                $scope.ingredients.push(newIngredient);
                $http.post("/api/Ingredients", newIngredient);
                isInIngredients = false;
            }
        }

        var alreadyThere = false;
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (angular.equals($scope.editingRecipe.name, $scope.recipes[i].name)) {
                alreadyThere = true;
            }
        }
        if (!alreadyThere && $scope.editingRecipe.name != "") {
            console.log ("pushing new recipe to $scope.recipes.")
            $http.post("/api/Recipe", $scope.editingRecipe).success(function (status) {
                $scope.recipes.push(savingRecipe);
                $scope.showDisplayTable = false;
            })
            .error(function (status) {
                console.log("something went wrong saving new recipe");
                $scope.recipes.push(savingRecipe);
                $scope.showDisplayTable = false;
            });
        }
        else {
            if (confirm("Save changes to " + $scope.recipes[selectedRecipeIndex].name)) {
                $http.put("/api/Recipe", $scope.editingRecipe).success(function (status) {
                    $scope.recipes[selectedRecipeIndex] = savingRecipe;
                    $scope.showEditingTable = false;
                })
                .error(function (status) {
                    console.log("something went wrong saving existing recipe");
                    $scope.recipes[selectedRecipeIndex] = savingRecipe;
                    $scope.showEditingTable = false;
                });
            }
        }
        $scope.editingRecipe = { name: "", ingredients: [], prep: [], cook: [], included: false, multiplier: 1 };
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
        $scope.newPrepStep = "";
        $scope.newCookStep = "";
        $scope.showDisplayTable = true;
        $scope.showEditingTable = false;
    }
    $scope.addRecipe = function () {
        $scope.editingRecipe = { name: "", ingredients: [], prep: [], cook: [], included: false, multiplier: 1 };
        $scope.newIngredientCount = [0, 0, 2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
        $scope.newPrepStep = "";
        $scope.newCookStep = "";
        $scope.showDisplayTable = false;
        $scope.showEditingTable = true;
    }
    $scope.editRecipe = function () {
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
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].count = $scope.newIngredientCount;
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].unit = $scope.newIngredientUnit;
        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name = $scope.newIngredientName;
        $scope.editingIngredient = false;
        $scope.newIngredientCount = [0,0,2];
        $scope.newIngredientUnit = "";
        $scope.newIngredientName = "";
    }
    $scope.removeIngredient = function () {
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
        for (var i = 0; i < $scope.recipes.length; i++) {
            if (i != selectedRecipeIndex) {
                newRecipes.push($scope.recipes[i]);
            }
        }
        if (confirm("This will permanently remove " + $scope.recipes[selectedRecipeIndex].name)) {
            var url = encodeURI("/api/Recipe/?name=" + $scope.recipes[selectedRecipeIndex].name);
            $http.delete(url).success(function (status) {
            })
            .error(function (status) {
                console.log("something went wrong deleting a recipe");
            });
            $scope.recipes = newRecipes;
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
    $scope.movePrepUp = function (index) {
        var lowPrep = $.extend({}, $scope.editingRecipe.prep[index - 1]);
        $scope.editingRecipe.prep[index - 1] = $scope.editingRecipe.prep[index];
        $scope.editingRecipe.prep[index] = lowPrep;
        $scope.selectEditingPrep($scope.editingPrepIndex - 1);
    }
    $scope.movePrepDown = function (index) {
        var highPrep = $.extend({}, $scope.editingRecipe.prep[index + 1]);
        $scope.editingRecipe.prep[index + 1] = $scope.editingRecipe.prep[index];
        $scope.editingRecipe.prep[index] = highPrep;
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
})