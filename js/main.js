const greetings = ["Hello!", "Hi!", "Hey there!", "Hey!", "Welcome!", "Yo!"]

const app = angular.module('TouhouApp', []);

app.directive('closeModal', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            function closeModal(event) {
                if (scope.isModalVisible !== true) {
                    return
                }

                if (event instanceof KeyboardEvent && event.key == "Escape") {
                    scope.$apply(() => scope.isModalVisible = false);
                    return
                }

                let modalContent = element[0].firstElementChild
                let isClickInside = modalContent.contains(event.target);

                if (event instanceof PointerEvent && !isClickInside) {
                    scope.$apply(() => scope.isModalVisible = false);
                }
            }

            $document.on('click', closeModal);
            $document.on('keydown', closeModal);

            scope.$on('$destroy', function () {
                $document.off('keydown', closeModal);
            });
        }
    };
});


app.controller('TouhouController', function ($scope, $http) {
    $scope.greeting = greetings[Math.floor(Math.random() * greetings.length)];
    $scope.isModalVisible = false;
    $scope.gameNumbers = []

    $scope.displayModal = function (gameName) {
        $http.get(`json/${gameName}.json`)
            .then(function (json) {
                $scope.characters = json.data["characters"];
                $scope.isModalVisible = true;
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
});