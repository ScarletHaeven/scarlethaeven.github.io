const greetings = ["Hello!", "Hi!", "Hey there!", "Hey!", "Welcome!", "Yo!"]

const app = angular.module('TouhouApp', []);

app.directive('closeModal', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            function closeModalOnEvent(condition) {
                if (scope.isModalVisible !== true) {
                    return
                }

                if (condition) {
                    scope.$apply(() => scope.closeModal());
                }
            }

            $document.on('click', function (event) {
                let modalContent = element[0].firstElementChild
                let isClickInside = modalContent.contains(event.target);

                closeModalOnEvent(!isClickInside)
            });

            $document.on('keydown', function (event) {
                closeModalOnEvent(event.key == "Escape")
            });
        }
    };
});

app.controller('TouhouController', function ($scope, $http) {
    $scope.greeting = greetings[Math.floor(Math.random() * greetings.length)];
    $scope.isModalVisible = false;
    $scope.activePage = "completion-grid"

    $scope.displayModal = function (gameName) {

        $http.get(`json/${gameName}.json`)
            .then(function (json) {
                $scope.isModalVisible = true;
                $scope.characters = json.data["characters"];
                $scope.gameName = json.data["title_short"];
                $scope.modalBackgroundStyling = {
                    "background": `rgba(0, 0, 0, 0.9) url('../images/game-images/${gameName}.jpg')`,
                    "background-blend-mode": "darken",
                    "background-position": "50% 25%"
                }
            })
            .catch(function () {
                alert("Game not added yet!")
            })
    }

    $scope.closeModal = function () {
        $scope.isModalVisible = false;
    }
});