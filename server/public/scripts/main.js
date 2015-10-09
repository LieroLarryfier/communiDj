var communiDjApp = angular.module('communiDj', []);

communiDjApp.controller('SongVoteCtrl', function ($scope, $http) {
	
	$http.get("music/songs.json").success(function (data) {
		$scope.songs = data;
	}).error(function () {
		alert("something terrible happened");
	});
	
	$scope.upvote = function () {
		console.log("upvote: " + $scope.songVote);
		$http.post("/post", {songVote : $scope.songVote}).success(function (data, status, header) {
			alert("SERVER SAYS: " + data);
		});
	}
	
});

	
