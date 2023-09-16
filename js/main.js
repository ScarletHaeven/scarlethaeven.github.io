const greetings = ["Hello!", "Hi!", "Hey there!", "Hey!", "Welcome!", "Yo!"]
const TouhouApp = angular.module('TouhouApp', []);

TouhouApp.directive('closeModal', function ($document) {
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

TouhouApp.controller('TouhouController', function ($scope, $http, $window, $timeout) {
    $scope.greeting = greetings[Math.floor(Math.random() * greetings.length)];

    $scope.isModalVisible = false;
    $scope.isCompletionModalVisible = false;
    $scope.isSocialMediaModalVisible = false;

    $scope.activePage = "completion-grid"
    $window.document.title = "Ramzy's Touhou Site - Completion Grid"

    $scope.getCompletionModalDataAndOpenCompletionModal = function (gameName) {
        $http.get(`json/${gameName}.json`)
            .then(function (json) {
                $scope.characters = json.data["characters"];
                $scope.gameName = json.data["title_short"];
                $scope.modalBackgroundStyling = {
                    "background": `rgba(0, 0, 0, 0.9) url('../media/game-images/${gameName}.jpg')`,
                    "background-blend-mode": "darken",
                    "background-position": "50% 25%",
                    "background-size": "cover",
                    "backdrop-filter": "blur(8px)",
                }

                $scope.isModalVisible = true;
                $scope.isCompletionModalVisible = true;
            })
            .catch(function () {
                alert("Game not added yet!")
            })
    }

    $scope.displaySocialMediaModal = function () {
        $timeout(function() {
            $scope.isModalVisible = true;
            $scope.isSocialMediaModalVisible = true;
            $scope.changePageTitle("Where To Find Me")
        });
    }

    $scope.closeModal = function () {
        $scope.isCompletionModalVisible = false;
        $scope.isSocialMediaModalVisible = false;
        $scope.isModalVisible = false;
    }

    $scope.changePage = function (pageName, pageTitle) {
        $scope.activePage = pageName;
        $scope.changePageTitle(pageTitle);
    }

    $scope.changePageTitle = function (pageTitle) {
        $window.document.title = `Ramzy's Touhou Site - ${pageTitle}`
    }
});