const greetings = ["Hello!", "Hi!", "Hey there!", "Yo!", "Hey!", "Skill Issue"]

const app = angular.module('TouhouApp', []);

app.directive('closeModal', function() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.on('click', function(event) {
                if (scope.isModalVisible == false) {
                    return
                }
                
                let modalContent = document.querySelector('.game-modal-content');
                let isClickInside = modalContent.contains(event.target);

                if (!isClickInside) {
                    scope.$apply(function () {
                        scope.isModalVisible = false;
                    });
                }
                
            });
        }
    };
});

app.controller('TouhouController', function($scope, $http) {
    $scope.greeting = greetings[Math.floor(Math.random()*greetings.length)];
    $scope.isModalVisible = false;
    $scope.modalName;

    $scope.displayModal = function(gameName) {
        $http.get(`json/${gameName}.json`)
        .then(function(json) {
            $scope.characters = json.data["characters"];
            $scope.isModalVisible = true;
            $scope.gameName = gameName;
        })
        .catch(function() {
            alert("Kankerzooi!")
        });
    }
});