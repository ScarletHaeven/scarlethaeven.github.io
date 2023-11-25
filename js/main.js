const ScarletApp = angular.module('ScarletApp', []);

ScarletApp.controller('ScarletController', function ($scope, $http, $timeout) {
    $scope.pageTitle = "welcome to my website."
    $scope.currentQuoteIndex = 0;
    $scope.randomQuoteActive = false;
    $scope.whatIsThisActive = false;
    $scope.quotes = [];
    $scope.movedQuotes = [];

    $scope.loadDataAndAnimate = async function () {
        await $scope.getQuoteData();

        await $timeout(async function () {
            var mainElementSelectors = ['.page-title', '.album-quote-showcase', '.footer', '.question'];

            for (var selector of mainElementSelectors) {
                var element = document.querySelector(selector);
                await fadeInElement(element, element.opacity);
            }
        });
    }

    $scope.getQuoteData = async function () {
        try {
            var response = await $http.get('json/quotes.json');
            $scope.quotes = response.data;
            $scope.currentQuote = $scope.quotes[0];
            $scope.quotes.splice(0, 1)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    $scope.setRandomQuote = async function () {
        if ($scope.randomQuoteActive) {
            return;
        }

        $scope.randomQuoteActive = true;

        var albumQuoteShowcase = document.querySelector('.album-quote-showcase');
        var albumImage = document.getElementById('albumImage');

        var removedQuote = $scope.quotes.splice($scope.currentQuoteIndex, 1)[0];
        $scope.movedQuotes.push(removedQuote);

        if ($scope.quotes.length == 0) {
            $scope.quotes = $scope.quotes.concat($scope.movedQuotes);
            $scope.movedQuotes = [];
        }

        $scope.currentQuoteIndex = Math.floor(Math.random() * $scope.quotes.length)

        await $timeout(async function () {
            await fadeOutElement(albumQuoteShowcase, albumQuoteShowcase.opacity);
        });

        var newImage = new Image();

        newImage.onload = function () {
            $scope.currentQuote = $scope.quotes[$scope.currentQuoteIndex];
            albumImage.src = newImage.src;

            $timeout(async function () {
                await fadeInElement(albumQuoteShowcase, albumQuoteShowcase.opacity);
            });

            $scope.randomQuoteActive = false;
        };

        newImage.src = $scope.quotes[$scope.currentQuoteIndex].image;
    }

    $scope.whatIsThis = async function () {
        if ($scope.whatIsThisActive) {
            return;
        }

        $scope.whatIsThisActive = true;

        var pageTitle = document.querySelector('.page-title')

        await $timeout(async function () {
            await fadeOutElement(pageTitle, pageTitle.opacity);
        });

        $scope.pageTitle = "it's my website! :)"

        await $timeout(async function () {
            await fadeInElement(pageTitle, pageTitle.opacity);
        })

        await $timeout(function () { }, 3000);

        await $timeout(async function () {
            await fadeOutElement(pageTitle, pageTitle.opacity);
        })

        $scope.pageTitle = "welcome to my website."

        await $timeout(async function () {
            await fadeInElement(pageTitle, pageTitle.opacity);
        })

        $scope.whatIsThisActive = false;
    }

    $scope.setStandardView = function () {
        $scope.simplifiedView = false;
    }

    $scope.setSimplifiedView = function () {
        $scope.simplifiedView = true;
    }

    $scope.setStandardView();
    $scope.loadDataAndAnimate();

});

async function fadeInElement(element, opacity) {
    return new Promise(resolve => {
        element.classList.remove('fade-out')
        element.classList.add('fade-in');
        element.style.opacity = opacity;
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

async function fadeOutElement(element, opacity) {
    return new Promise(resolve => {
        element.classList.remove('fade-in')
        element.classList.add('fade-out');
        element.style.opacity = opacity;
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}
