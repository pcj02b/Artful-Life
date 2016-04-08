recipeApp.controller('mainCtrl', ['$scope', 'authService', function ($scope, authService) {
    $scope.user = authService.getUser();
    updateMain = function () {
        $scope.$apply(function () {
            $scope.user = authService.getUser();
        })
    };
}]);