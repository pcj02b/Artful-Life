var recipeApp = angular.module("recipeApp");

recipeApp.controller('cookingCtrl', function ($scope, $http) {
    $scope.user = sessionStorage.getItem("user");
    $scope.showPrep = true;
    $scope.recipes = [];
    var getRecipeURI = "/api/Recipe?user=".concat($scope.user);
    $http.get(getRecipeURI).success(function (data) {
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
    });
})
