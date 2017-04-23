var myApp = angular.module('myApp', ["ngRoute"]);

myApp.controller('FbAuth', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	console.log("Login controller");
	$scope.hideLoginButton = false;
	$scope.showProfileButton = false;

	function statusChangeCallback(response) {
	    console.log('statusChangeCallback');
	    console.log(response);
	    
	    if (response.status === 'connected') {
	      testAPI();
	    } else {
	      // document.getElementById('status1').innerHTML = 'Please log ' +
	        // 'into this app.';
	    }
    }

	function checkLoginState() {
		
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '375840159476560',
			cookie     : true,                        
			xfbml      : true, 
			version    : 'v2.9'
		});

		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	};

	(function(d, s, id) {   
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	function testAPI() {
		$scope.hideLoginButton = true;
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', {fields: 'name, picture'}, function(response) {
			$scope.showProfileButton = true;
			console.log(response);
			$scope.dp_url = response.picture.data.url;
			$scope.username = response.name;
			$rootScope.fb_id = response.id;

			var params = {
				'profile_pic': $rootScope.dp_url, 
				'username': $rootScope.username,
				'fb_id': $rootScope.fb_id
			};

		    $http.post('/login', params).then(function(response) {
				$rootScope.userId = response.data.user_id;
				console.log(response);
			});
	    });
  	}

	$scope.logout = function() {
		// params = {'user_id'}
		$http.post('/logout').then(function(response) {
			$scope.details = response.data;
			console.log($scope.details);
		})
	}

}]);


myApp.controller('profile', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
	console.log('profile controller');

}]);







