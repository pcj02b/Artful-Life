var recipeApp = angular.module("recipeApp");
recipeApp.controller("cookingCtrl", function ($scope, $http, AuthService) {
    $scope.showPrep = true;
    $scope.user = AuthService.getUser();
    console.log($scope.user);
    var logOut = document.getElementById("logOut");
    var logIn = document.getElementById("logIn");
    var logOutClass = document.createAttribute("class");
    var logInClass = document.createAttribute("class");
    logOutClass.value = "noDisplay";
    logInClass.value = "noDisplay";
    logOut.setAttributeNode(logOutClass);
    logIn.setAttributeNode(logInClass);
    if ($scope.user === undefined) {
        logInClass.value = "yesDisplay";
        logOutClass.value = "noDisplay";

    }
    else {
        logOutClass.value = "yesDisplay";
        logInClass.value = "noDisplay";
    }
    $scope.recipes = [];
    $scope.ingredients = [];
    $scope.stores = [];
    $scope.storeIsClicked = [];
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
    })
    updateCooking = function () {
        $scope.user = AuthService.getUser();
        if ($scope.user === undefined) {
            logInClass.value = "yesDisplay";
            logOutClass.value = "noDisplay";

        }
        else {
            logOutClass.value = "yesDisplay";
            logInClass.value = "noDisplay";
        }
        $scope.recipes = [];
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
        })
    };
})