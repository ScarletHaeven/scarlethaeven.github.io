const ScarletApp = angular.module('ScarletApp', []);

ScarletApp.controller('ScarletController', function ($scope, $http, $timeout) {

    $scope.simplifiedView = true;

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

    $scope.getQuoteData = function () {
        $http.get('json/quotes.json')
            .then(function (response) {
                $scope.data = response.data;
                $scope.artists = $scope.data['artists'];
                $scope.selectFirstQuote();
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    };

    $scope.setRandomQuote = function () {
        if ($scope.randomQuoteActive) {
            return;
        }

        $scope.randomQuoteActive = true;

        let randomArtist = getRandomElement($scope.artists)
        let randomAlbumFromArtist = getRandomElement(randomArtist['albums'])
        let randomTrackFromAlbum = getRandomElement(randomAlbumFromArtist['tracks'])
        let randomQuoteFromTrack = getRandomElement(randomTrackFromAlbum['quotes'])

        $scope.setQuote(randomArtist, randomAlbumFromArtist, randomTrackFromAlbum, randomQuoteFromTrack)

        $scope.randomQuoteActive = false;
    }

    function getRandomElement(array) {
        let randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    $scope.getQuoteData();

});
