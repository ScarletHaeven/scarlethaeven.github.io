const app = angular.module("ScarletApp", []);

app.controller("ScarletController", function ($scope) {

    $scope.currentPage = "about-me";

    $scope.togglePage = function (pageName) {
        $scope.currentPage = pageName; 
    }

})