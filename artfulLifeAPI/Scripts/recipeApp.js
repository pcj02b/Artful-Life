var recipeApp = angular.module('recipeApp', []);

recipeApp.factory("recipeService", function ($http, $q) {
    var service = {};
    var recipes = "";
    service.showLength = function () {
        window.alert(recipes.length);
    }
    service.get = function () {
        return recipes;
    }
    service.set = function (value) {
        recipes = value;
    }
    return service;
});