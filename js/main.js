const ScarletApp = angular.module('ScarletApp', []);

ScarletApp.controller('ScarletController', function ($scope, $http, $timeout) {
    $scope.pageTitle = "welcome to my website."
    $scope.shortPageTitle = "welcome."

    $scope.loadDataAndAnimate = async function () {
        await $scope.getQuoteData();

        await $timeout(async function () {
            var mainElementSelectors = ['.page-title', '.album-quote-showcase', '.footer', '.question'];

            for (var selector of mainElementSelectors) {
                var elements = document.querySelectorAll(selector);

                if (elements.length > 1) {
                    // If there are more than one element, load them concurrently
                    var fadeInPromises = Array.from(elements).map(async function (element) {
                        return fadeInElement(element, parseFloat(element.style.opacity) || 0);
                    });

                    await Promise.all(fadeInPromises);
                } else if (elements.length === 1) {
                    // If there is only one element, load it sequentially
                    await fadeInElement(elements[0], parseFloat(elements[0].style.opacity) || 0);
                }
            }
        });
    }

    $scope.setQuote = function (artist, album, track, quote) {
        $scope.currentArtist = artist
        $scope.currentAlbum = album
        $scope.currentTrack = track
        $scope.currentQuote = quote
    }

    $scope.selectFirstQuote = function () {
        const JerryCantrell = $scope.artists[0]
        const Brighten = JerryCantrell['albums'][0]
        const PrismOfDoubt = Brighten['tracks'][0]
        const FavoriteQuote = PrismOfDoubt['quotes'][0]

        $scope.setQuote(JerryCantrell, Brighten, PrismOfDoubt, FavoriteQuote)
    }

    $scope.getQuoteData = async function () {
        try {
            var response = await $http.get('json/quotes.json');
            $scope.data = response.data;
            $scope.artists = $scope.data['artists']

            $scope.selectFirstQuote()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    $scope.setRandomQuote = async function () {
        if ($scope.randomQuoteActive) {
            return;
        }

        $scope.randomQuoteActive = true;
        $scope.imageLoaded = false;

        $scope.albumQuoteShowcase = document.querySelector('.album-quote-showcase');
        $scope.albumImage = document.getElementById('albumImage');

        var randomArtist = getRandomElement($scope.artists)
        var randomAlbumFromArtist = getRandomElement(randomArtist['albums'])
        var randomTrackFromAlbum = getRandomElement(randomAlbumFromArtist['tracks'])
        var randomQuoteFromTrack = getRandomElement(randomTrackFromAlbum['quotes'])

        await $timeout(async function () {
            await fadeOutElement($scope.albumQuoteShowcase, $scope.albumQuoteShowcase.opacity);
        });

        $scope.setQuote(randomArtist, randomAlbumFromArtist, randomTrackFromAlbum, randomQuoteFromTrack)
        $scope.handleAlbumImageLoading(randomAlbumFromArtist)

        while (!$scope.imageLoaded) {
            await $timeout();
        }
    }

    $scope.handleAlbumImageLoading = async function (album) {
        var newImage = new Image();

        newImage.onload = function () {
            $scope.albumImage.src = newImage.src;
            $scope.imageLoaded = true;

            $timeout(async function () {
                await fadeInElement($scope.albumQuoteShowcase, $scope.albumQuoteShowcase.opacity);
                $scope.randomQuoteActive = false;
            });
        };

        newImage.src = album.image
    }

    $scope.whatIsThis = async function () {
        if ($scope.whatIsThisActive) {
            return;
        }

        $scope.whatIsThisActive = true;

        var pageTitleElements = document.querySelectorAll('.page-title, .short-page-title');

        await Promise.all(Array.from(pageTitleElements).map(async (pageTitle) => {
            await $timeout(async function () {
                await fadeOutElement(pageTitle, pageTitle.opacity);
            });
        }));

        $scope.pageTitle = "it's my website! :)";
        $scope.shortPageTitle = "my website! :)";

        await Promise.all(Array.from(pageTitleElements).map(async (pageTitle) => {
            await $timeout(async function () {
                await fadeInElement(pageTitle, pageTitle.opacity);
            });
        }));

        await $timeout(function () { }, 3000);

        await Promise.all(Array.from(pageTitleElements).map(async (pageTitle) => {
            await $timeout(async function () {
                await fadeOutElement(pageTitle, pageTitle.opacity);
            });
        }));

        $scope.pageTitle = "welcome to my website.";
        $scope.shortPageTitle = "welcome.";

        await Promise.all(Array.from(pageTitleElements).map(async (pageTitle) => {
            await $timeout(async function () {
                await fadeInElement(pageTitle, pageTitle.opacity);
            });
        }));

        $scope.whatIsThisActive = false;
    }

    $scope.setFooterQuote = async function () {
        if (!$scope.amountClicked) {
            $scope.amountClicked = 0;
        }

        if ($scope.amountClicked != 4) {
            $scope.amountClicked++;
            return;
        }

        if ($scope.specialFooterActive) {
            return;
        }

        $scope.specialFooter = false;
        $scope.specialFooterActive = true;

        var standardFooterElement = document.querySelector('.standard-footer');
        var specialFooterElements = document.querySelectorAll('.special-footer');

        await $timeout(async function () {
            await fadeOutElement(standardFooterElement, standardFooterElement.opacity);
        });

        $scope.specialFooter = true;

        await Promise.all(Array.from(specialFooterElements).map(async (specialFooterElement) => {
            await $timeout(async function () {
                await fadeInElement(specialFooterElement, specialFooterElement.opacity);
            });
        }));

        await $timeout(function () { }, 5000);

        await Promise.all(Array.from(specialFooterElements).map(async (specialFooterElement) => {
            await $timeout(async function () {
                await fadeOutElement(specialFooterElement, specialFooterElement.opacity);
            });
        }));

        $scope.specialFooter = false;

        await $timeout(async function () {
            await fadeInElement(standardFooterElement, standardFooterElement.opacity);
        })

        $scope.specialFooterActive = false;
        $scope.amountClicked = 0;
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
        element.classList.remove('fade-out');
        element.classList.add('fade-in');
        element.style.opacity = opacity;
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

async function fadeOutElement(element, opacity) {
    return new Promise(resolve => {
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
        element.style.opacity = opacity;
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

function getRandomElement(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
