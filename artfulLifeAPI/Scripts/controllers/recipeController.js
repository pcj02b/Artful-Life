recipeApp.controller('recipeCtrl', ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.recipes = [];
    var allRecipes = [];
    var tempRecipe = {};
    $scope.user = authService.getUser();

    $http.get("/api/Units").success(function (data) {
        $scope.units = data;
    })

    $scope.selectSortType = function (type) {
        switch (type) {
            case 'letter':
                $scope.byLetter = !$scope.byLetter;
                $scope.byMeal = false;
                $scope.byMeat = false;
                break;
            case 'meal':
                $scope.byMeal = !$scope.byMeal;
                $scope.byLetter = false;
                $scope.byMeat = false;
                break;
            case 'meat':
                $scope.byMeat = !$scope.byMeat;
                $scope.byLetter = false;
                $scope.byMeal = false;
                break;
            default:
                $scope.byMeat = false;
                $scope.byLetter = false;
                $scope.byMeal = false;
        }
    }

    $scope.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    $scope.selectedLetter = "";
    $scope.selecteMeal = "";
    $scope.selectLetter = function (letter) {
        if ($scope.selectedLetter === letter) {
            $scope.selectedLetter = null;
        }
        else {
            $scope.selectedLetter = letter;
        }
    }
    $scope.letterHasRecipes = function (letter) {
        return _.some($scope.recipes, function (recipe) {
            return $scope.recipeInLetter(recipe.name, letter);
        });
    };
    $scope.mealHasRecipes = function (meal) {
        return _.some($scope.recipes, function (recipe) {
            return recipe.stats.meal === meal;
        });
    };
    $scope.recipeInLetter = function (recipeName, letter) {
        return recipeName.toLowerCase().indexOf(letter.toLowerCase()) === 0;
    }

    $scope.meals = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
    $scope.mealHasRecipes = function (meal) {
        return _.some($scope.recipes, function (recipe) {
            return recipe.stats.meal === meal;
        });
    };
    $scope.selectMeal = function (meal) {
        if ($scope.selectedMeal === meal) {
            $scope.selectedMeal = null;
        }
        else {
            $scope.selectedMeal = meal;
        }
    }
    $scope.meats = ["Beef", "Chicken", "Seafood", "Vegetarian", "Other"];
    $scope.meatHasRecipes = function (meat) {
        return _.some($scope.recipes, function (recipe) {
            return recipe.stats.meat === meat;
        });
    };
    $scope.selectMeat = function (meat) {
        if ($scope.selectedMeat === meat) {
            $scope.selectedMeat = null;
        }
        else {
            $scope.selectedMeat = meat;
        }
    }

    $scope.showDisplayTable = false;
    $scope.showEditingTable = false;
    $scope.showShareLink = false;
    $scope.showSharePage = false;

    $scope.selectedRecipe = {};
    $scope.editingRecipe = {};
    $scope.selectedRecipeIndex = -1;

    $scope.newIngredient = {
        count: [0, 0, 2],
        unit: "",
        name: ""
    };
    $scope.newStep = "";

    $scope.editingIngredient = false;
    $scope.editingIngredientIndex = -1;
    $scope.editingStepIndex = -1;
    $scope.editingStep = false;
    $scope.textIngredients = "";

    $scope.shareEmail = "";
    $scope.shareCanEdit = false;
    $scope.showShareEdit = false;

    $scope.deleteIngredientList = [];

    $scope.loading = false;

    updateRecipes = function () {
        $scope.user = authService.getUser();
        $scope.loading = true;
        $scope.recipes = [];
        $http.get("/api/Recipe?user=".concat($scope.user))
            .success(function (allRecipes) {
                $scope.recipes = allRecipes;
                $scope.loading = false;
            });
        $http.get("/api/Ingredients/get?user=" + $scope.user)
            .success(function (data) {
                $scope.ingredients = data.ingredients;
            });
    }

    $scope.selectRecipe = function (recipeID) {
        if ($scope.selectedRecipe._id === recipeID) {
            $scope.showDisplayTable = false;
            $scope.showEditingTable = false;
            $scope.selectedRecipe = {};
        }
        else {
            $scope.showDisplayTable = true;
            $scope.showEditingTable = false;
            $scope.selectedRecipe = _.find($scope.recipes, function (recipe, index) {
                if (recipe._id === recipeID) {
                    return true;
                    $scope.selectedRecipeIndex = index;
                }
                return false;
            });
        }
    }
    $scope.showShareRecipe = function () {
        $scope.showDisplayTable = false;
        $scope.showEditingTable = false;
        $scope.showSharePage = true;
        if ($scope.recipes[$scope.selectedRecipeIndex].owner === $scope.user) {
            $scope.showShareEdit = true;
        }
        $scope.showShareLink = false;
    }
    $scope.shareRecipe = function () {
        if ($scope.shareCanEdit) {
            if ($scope.recipes[$scope.selectedRecipeIndex].owner === $scope.user) {
                $scope.recipes[$scope.selectedRecipeIndex].editors.push($scope.shareEmail);
            }
            else {
                window.alert("only the owner can share the ability to edit.");
            };
        }
        else {
            $scope.recipes[$scope.selectedRecipeIndex].viewers.push($scope.shareEmail);
        };
        $http.put("/api/Recipe", $scope.recipes[$scope.selectedRecipeIndex]);
        window.alert($scope.recipes[$scope.selectedRecipeIndex].name + " shared with " + $scope.shareEmail);
        $scope.showSharePage = false;
        $scope.showShareLink = true;
        $scope.showShareEdit = false;
    }
    $scope.addIngredient = function () {
        $scope.editingRecipe.ingredients.push($scope.newIngredient);
        $scope.newIngredient = {
            count: [0, 0, 2],
            unit: "",
            name: ""
        };
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

    $scope.addStep = function () {
        angular.forEach($scope.newStep.split(/\n/), function(newStep) {
            $scope.editingRecipe.steps.push(newStep);
        });
        $scope.newStep = "";
    }

    $scope.saveRecipe = function () {
        var isInIngredients = false;
        var newIngredients = [];
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
                newIngredients.push({ name: $scope.editingRecipe.ingredients[i].name, store: -1 });
            }
            isInIngredients = false;
        }
        //add any new ingredients
        if (newIngredients.length) $http.put("/api/Ingredients", { _id: $scope.user, ingredients: newIngredients });

        //delete any ingredients
        for (var i = 0; i < $scope.deleteIngredientList.length; i++) {
            $http.delete("/api/Ingredients?ingredientName=".concat($scope.deleteIngredientList[i].name, "&user=", $scope.user));
        }
        var totalTime = "".concat($scope.editingRecipe.stats.prepTime.hours + $scope.editingRecipe.stats.cookTime.hours, ":", $scope.editingRecipe.stats.prepTime.mins + $scope.editingRecipe.stats.cookTime.mins, ":00");
        $scope.editingRecipe.stats.totalTime = totalTime;
        $scope.editingRecipe.stats.prepTime = "".concat($scope.editingRecipe.stats.prepTime.hours, ":", $scope.editingRecipe.stats.prepTime.mins, ":00");
        $scope.editingRecipe.stats.cookTime = "".concat($scope.editingRecipe.stats.cookTime.hours, ":", $scope.editingRecipe.stats.cookTime.mins, ":00");

        //check to see if recipe is already there
        if (typeof($scope.editingRecipe._id) === "undefined") {
            console.log("creating new recipe");
            $http.post("/api/Recipe", $scope.editingRecipe)
                .success(function (status) {
                    $scope.showDisplayTable = false;
                    updateRecipes();
                    $scope.selectedRecipeIndex = $scope.recipes.length;
                })
                .error(function (status) {
                    console.log("something went wrong saving new recipe");
                });
        }
        else {
            if (confirm("Saving changes to " + $scope.editingRecipe.name)) {
                $http.put("/api/Recipe", $scope.editingRecipe)
                    .success(function (status) {
                        updateRecipes();
                        $scope.selectedRecipeIndex = $scope.recipes.length;
                    })
                    .error(function (status) {
                        console.log("something went wrong saving existing recipe");
                    });
            }
        }
        $scope.editingRecipe = { name: "", ingredients: [], stats: { prepTime: "00:00:00", cookTime: "00:00:00" }, steps: [], included: false, multiplier: 1, owner: $scope.user, editors: [], viewers: [] };
        $scope.newIngredient = {
            count: [0, 0, 2],
            unit: "",
            name: ""
        };
        $scope.newStep = "";
        $scope.showDisplayTable = true;
        $scope.showEditingTable = false;
    }
    $scope.addRecipe = function () {
        $scope.editingRecipe = { name: "", ingredients: [], stats: {}, steps: [], included: false, multiplier: 1, owner: $scope.user, editors: [], viewers: [] };
        $scope.editingRecipe.stats.prepTime = { hours: 0, mins: 0 };
        $scope.editingRecipe.stats.cookTime = { hours: 0, mins: 0 };
        $scope.newIngredient = {
            count: [0, 0, 2],
            unit: "",
            name: ""
        };
        $scope.newStep = "";
        $scope.showDisplayTable = false;
        $scope.showEditingTable = true;
        $scope.showShareLink = false;
        $scope.selectedRecipeIndex = -1;
    }
    $scope.editRecipe = function () {
        if ($scope.recipes[$scope.selectedRecipeIndex].viewers.indexOf($scope.user) === -1) {
            angular.copy($scope.recipes[$scope.selectedRecipeIndex], $scope.editingRecipe);
            $scope.editingRecipe.stats.prepTime = {
                hours: parseInt($scope.editingRecipe.stats.prepTime.slice(0, 2)),
                mins: parseInt($scope.editingRecipe.stats.prepTime.slice(3, 5))
            };
            $scope.editingRecipe.stats.cookTime = {
                hours: parseInt($scope.editingRecipe.stats.cookTime.slice(0, 2)),
                mins: parseInt($scope.editingRecipe.stats.cookTime.slice(3, 5))
            };

            $scope.newIngredient = {
                count: [0, 0, 2],
                unit: "",
                name: ""
            };
            $scope.newStep = "";
            $scope.showShareLink = false;
            $scope.showDisplayTable = false;
            $scope.showEditingTable = true;
        }
        else {
            window.alert("You may only view this recipe.");
        }
    }
    $scope.selectEditingIngredient = function (index) {
        if ($scope.editingIngredientIndex === index) {
            $scope.editingIngredient = false;
            $scope.newIngredient = {
                count: [0, 0, 2],
                unit: "",
                name: ""
            };
            $scope.editingIngredientIndex = -1;
        }
        else {
            $scope.editingIngredient = true;
            $scope.newIngredient = $scope.editingRecipe.ingredients[index];
            $scope.editingIngredientIndex = index;
        }
    }

    $scope.selectEditingStep = function (index) {
        if ($scope.editingStepIndex === index) {
            $scope.editingStep = false;
            $scope.newStep = "";
            $scope.editingStepIndex = -1;
        }
        else {
            $scope.editingStep = true;
            $scope.newStep = $scope.editingRecipe.steps[index];
            $scope.editingStepIndex = index;
        }
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
                if ($scope.recipes[i].ingredients[n].name === $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name && i != $scope.selectedRecipeIndex) {
                    wasInOtherRecipe = true;
                }
            }
        }
        if (!wasInOtherRecipe && wasInIngredients) {
            $scope.deleteIngredientList.push($scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name);
            console.log("will delete " + $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name + " upon saving recipe");
        }

        $scope.editingRecipe.ingredients[$scope.editingIngredientIndex] = $scope.newIngredient;
        $scope.editingIngredient = false;
        $scope.editingIngredientIndex = -1;
        $scope.newIngredient = {
            count: [0, 0, 2],
            unit: "",
            name: ""
        };
    }

    $scope.saveStep = function () {
        $scope.editingRecipe.steps[$scope.editingStepIndex] = $scope.newStep;
        $scope.editingStep = false;
        $scope.editingStepIndex = -1;
        $scope.newStep = "";
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
                if ($scope.recipes[i].ingredients[n].name === $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name && i != $scope.selectedRecipeIndex) {
                    wasInOtherRecipe = true;
                }
            }
        }
        if (!wasInOtherRecipe && wasInIngredients) {
            $scope.deleteIngredientList.push($scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name);
            console.log("will to delete " + $scope.editingRecipe.ingredients[$scope.editingIngredientIndex].name + " upon saving recipe");
        }
        $scope.editingRecipe.ingredients = [];
        for (var i = 0; i < $scope.editingRecipe.ingredients.length; i++) {
            if (i != $scope.editingIngredientIndex) {
                $scope.editingRecipe.ingredients.push($scope.editingRecipe.ingredients[i]);
            }
        }
    }
    $scope.removeStep = function (index) {
        var editingSteps = []; //local temp list
        for (var i = 0; i < $scope.editingRecipe.steps.length; i++) {
            if (i != index) {
                editingSteps.push($scope.editingRecipe.steps[i]);
            }
        }
        $scope.editingRecipe.steps = editingSteps;
    };

    $scope.removeRecipe = function () {
        var isInAnotherRecipe = false;
        _.remove($scope.recipes, function (recipe, index) {
            return index === $scope.selectedRecipeIndex;
        });
        if (confirm("This will permanently remove " + $scope.selectedRecipe.name)) {
            for (var i = 0; i < $scope.selectedRecipe.ingredients.length; i++) {
                for (var n = 0; n < $scope.recipes.length; n++) {
                    for (var m = 0; m < $scope.recipes[n].ingredients.length; m++) {
                        if ($scope.recipes[n].ingredients[m].name === $scope.selectedRecipe.ingredients[i].name) {
                            isInAnotherRecipe = true;
                        }
                    }
                }
                console.log($scope.selectedRecipe.ingredients[i].name);
                console.log(isInAnotherRecipe);
                if (!isInAnotherRecipe) {
                    console.log("deleting ingredient: " + $scope.selectedRecipe.ingredients[i].name);
                    var deleteURI = encodeURI("/api/Ingredients?name=".concat($scope.selectedRecipe.ingredients[i].name, "&user=", $scope.user));
                    $http.delete(deleteURI);
                }
            }
            $http.delete("/api/Recipe?_id=".concat($scope.selectedRecipe._id)).success(function (status) {
                updateRecipes();
                $scope.selectedRecipeIndex = 0;
                $scope.showDisplayTable = false;
                $scope.showEditingTable = false;
            })
            .error(function (status) {
                console.log("something went wrong deleting a recipe");
                console.log(status);
            });
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

    $scope.moveStepUp = function (index) {
        var lowStep = $.extend({}, $scope.editingRecipe.steps[index - 1]);
        $scope.editingRecipe.steps[index - 1] = $scope.editingRecipe.steps[index];
        $scope.editingRecipe.steps[index] = lowStep;
        $scope.selectEditingStep($scope.editingStepIndex - 1);
    }
    $scope.moveStepDown = function (index) {
        var highStep = $.extend({}, $scope.editingRecipe.steps[index + 1]);
        $scope.editingRecipe.steps[index + 1] = $scope.editingRecipe.steps[index];
        $scope.editingRecipe.steps[index] = highStep;
        $scope.selectEditingStep($scope.editingStepIndex + 1);

    }
}]);