var bewareApp = angular.module('bewareApp', ['ngRoute']);

// configure our routes
bewareApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'login/login.html'
        })
        .when('/login', {
            templateUrl: 'login/login.html'
        })
        .when('/landing', {
            templateUrl: 'landing/landing.html'
        })
        .when('/wsq1', {
            templateUrl: 'wordscape/question1.html'
        })
        .when('/wsq2', {
            templateUrl: 'wordscape/question2.html'
        })
        .when('/wsq3', {
            templateUrl: 'wordscape/question3.html'
        })
        .when('/wsq4', {
            templateUrl: 'wordscape/question4.html'
        })
        .when('/wsq5', {
            templateUrl: 'wordscape/question5.html'
        })
        .when('/wsq6', {
            templateUrl: 'wordscape/question6.html'
        })
        .when('/wsq7', {
            templateUrl: 'wordscape/question7.html'
        })
        .when('/wsq8', {
            templateUrl: 'wordscape/question8.html'
        })
        .when('/wsq9', {
            templateUrl: 'wordscape/question9.html'
        })
        .when('/wsq10', {
            templateUrl: 'wordscape/question10.html'
        })
        .when('/baq1', {
            templateUrl: 'beaware/question1.html'
        })
        .when('/baq2', {
            templateUrl: 'beaware/question2.html'
        })
        .when('/baq3', {
            templateUrl: 'beaware/question3.html'
        })
        .when('/baq4', {
            templateUrl: 'beaware/question4.html'
        })
        .when('/baq5', {
            templateUrl: 'beaware/question5.html'
        })
        .when('/baq6', {
            templateUrl: 'beaware/question6.html'
        })
        .when('/baq7', {
            templateUrl: 'beaware/question7.html'
        })
        .when('/reports', {
            templateUrl: 'reports/reports.html'
        })
         .when('/monitor', {
            templateUrl: 'monitor/monitor.html'
        })
});


bewareApp.factory("userService",['$http' , function ($http) {
    return {
        currentUser: function () {
            return this.user;
        },
        user: {
            totalScore: 0,
            totalTime: 0
        },
        pauseResumeText: "Pause Game",
        isGamePage: false,
        gamesPlayed: [],
        getGamesPlayed: function () {
            return this.gamesPlayed;
        },
        gameStrength: [],
        getGameStrength: function () {
            return this.gameStrength;
        },
        saveScore: function(request, callBack){
        	$http.post('../../games/gamesCtrl/save', request).then(callBack);
        },
        getReport: function(location, callBack){
        	$http.get('../../games/gamesCtrl/getScores?location='+location,{responseType:'blob'}).success(function (response) {
                var file = new Blob([response], {type: 'application/csv'});

                var isChrome = !!window.chrome && !!window.chrome.webstore;
                var isIE = /* @cc_on!@ */false || !!document.documentMode;
                var isEdge = !isIE && !!window.StyleMedia;


                if (isChrome){
                    var url = window.URL || window.webkitURL;

                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',url.createObjectURL(file));
                    downloadLink.attr('target','_self');
                    downloadLink.attr('download', 'report.csv');
                    downloadLink[0].click();
                }
                else if(isEdge || isIE){
                    window.navigator.msSaveOrOpenBlob(file,'report.csv');

                }
                else {
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }

            })
        },
        login: function(empId, empEmail,callBack){
        	$http.get('../../games/gamesCtrl/login?empId='+empId+'&empEmail='+empEmail).then(callBack);
        },
        testServer: function(callBack){
        	$http.get('../../games/gamesCtrl/test').success(function (data, status){callBack(data, status)}).error(function (data,status){callBack(data,status)});
        }
    }
}]);

bewareApp.controller('loginController', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    $scope.data = {};
    $scope.enterGame = function (form) {
        if (form.$valid) {
            userService.user = $scope.data;
            userService.user.totalScore = 0;
            userService.user.totalTime = 0;
            userService.user.empId = $scope.zeroPad($scope.data.empID,9);
            $scope.validateUser();
        }
        else{
        	$("#emailAlert").modal('show');
        }
    };
    
    $scope.validateUser = function(){
    	var empId = $scope.zeroPad($scope.data.empID,9);
    	var empEmail = $scope.data.email;
        var callback = function(data){
    		if(data.data){
    			$("#loginAlert").modal('show');
    		}
    		else{
    			$location.path("/landing");
    		}
    	};
        userService.login(empId,empEmail,callback);
    }
    
    $scope.loginSuccess = function(){
    	$location.path("/landing");
    }
    
    $scope.zeroPad = function(num, places) {
		  var zero = places - num.toString().length + 1;
		  return Array(+(zero > 0 && zero)).join("0") + num;
		}
}]);

bewareApp.controller('landingController', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    $scope.launchWordscape = function () {
        $location.path("/wsq1");
    };
    $scope.launchBeaware = function () {
        $location.path("/baq1");
    };
    $scope.gamesPlayed = userService.getGamesPlayed();

    $scope.setButtonStates = function () {
        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.disableWordscapeBtn = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.disableBeawareBtn = true;
            }
        }
    }

    $scope.setButtonStates();
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
}]);

bewareApp.controller('wordscapeQ1Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 30;
    $scope.stopped;
    // === Reset the time and the score for the first game ============//
    userService.user.totalScore = 0;
    userService.user.totalTime = 0;

    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
                $("#logOutModal1").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("PMSA");
    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "SPAM") {
            $("#successModal").modal('show');
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
            $scope.chosenLetters = [];
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal1").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq2');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
    $scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('wordscapeQ2Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;

    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal2").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("RVSIU");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "VIRUS") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal2").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq3');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    

    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
    $scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('wordscapeQ3Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal3").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("CIPLOY");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "POLICY") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal3").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq4');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }

    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }
}]);

bewareApp.controller('wordscapeQ4Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal4").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("HHGIIPNS");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "PHISHING") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal4").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq5');
    }
    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }

    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }
}]);


bewareApp.controller('wordscapeQ5Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal5").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("GGATLINATI");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "TAILGATING") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal5").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq6');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }

    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('wordscapeQ6Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });

    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal6").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("RCDA-RTSAM");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "SMART-CARD") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal6").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }
    $scope.proceedNext = function () {
        $location.path('/wsq7');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }

    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('wordscapeQ7Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal7").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("WNSMROAREA");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "RANSOMWARE") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal7").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq8');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }

    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('wordscapeQ8Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal8").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("TTPECEROD-AADT");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "PROTECTED-DATA") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal8").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq9');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }


}]);

bewareApp.controller('wordscapeQ9Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal9").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("SEPLKHDE");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "HELPDESK") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal9").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/wsq10');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }

    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
    
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('wordscapeQ10Ctrl', ['$scope', '$timeout', '$location', 'userService', function ($scope, $timeout, $location, userService) {
    $scope.counter = 30;
    $scope.stopped;
    userService.gamesPlayed.push({
        gameId: 1,
        gameName: "Wordscape"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal10").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();

    var makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.letters = makeLetters("YSUIECRT-TDICINEN");

    $scope.chosenLetters = [];

    $scope.moveLetters = function (letter) {
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = true;
            }
        });
        $scope.chosenLetters.push(letter);
    };

    $scope.undoMoveLetters = function (letter, index) {
        var rmIndex = $scope.chosenLetters.indexOf(letter);
        if (rmIndex > -1)
            $scope.chosenLetters.splice(rmIndex, 1);
        $scope.letters.forEach(function (l) {
            if (letter.name === l.name && letter.id === l.id) {
                l.chosen = false;
            }
        });
    };

    $scope.submitAnswer = function () {
    	$scope.notSubmitted = false;
        $scope.stopCountDown();
        $scope.checkForSession();
        var word = "";
        for (var i = 0; i < $scope.chosenLetters.length; i++) {
            word += $scope.chosenLetters[i].name;
        }
        if (word === "SECURITY-INCIDENT") {
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
            $scope.totalScore = userService.user.totalScore;
            $scope.totalTime = userService.user.totalTime;
            $scope.name = userService.user.name;
            $scope.email = userService.user.email;
            $scope.location = userService.user.location;
        }
        else {
            $("#alertModal").modal('show');
            $scope.chosenLetters = [];
            $scope.letters.forEach(function (l) {
                l.chosen = false;
            });
        }
    }

    $scope.showHint = function () {
        $scope.stopCountDown();
        $("#hintModal10").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.finish = function () {
    	$scope.saveScores();
        $("#scoreModal").modal('show');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }

    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "Wordscape",
    			"gameId": 1,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
$scope.notSubmitted = true;
    
    $scope.reset = function(){
    	$scope.letters.forEach(function (l) {
            l.chosen = false;
        });
        $scope.chosenLetters = [];
    }

}]);

bewareApp.controller('beawareQ1Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = 0;
    $scope.win = false;
    // === Reset the time and the score for the second game ============//
    userService.user.totalScore = 0;
    userService.user.totalTime = 0;
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if ($scope.counter > 0) {
                if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                    && $scope.counter === 30
                    && !$scope.hintShown) {
                    $scope.showHint();
                }
                else {
                    $scope.counter--;
                    $scope.countdown();
                }
            }
            if ($scope.counter <= 0) {
                $("#logOutModal1").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };

    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz");
    $scope.secretWord = $scope.makeLetters("PHARMING");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");

    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();

    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal1").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $("#successModal").modal('show');
            $scope.enableNextLevel = true;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.hintShown = true;
        $scope.stopCountDown();
        $("#hintModal1").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/baq2');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }
}]);

bewareApp.controller('beawareQ2Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = userService.getGameStrength().length;
    $scope.win = false;
    userService.gamesPlayed.push({
        gameId: 2,
        gameName: "BeAware"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                && $scope.counter === 30
                && !$scope.hintShown) {
                $scope.showHint();
            }
            else {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal2").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };

    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz");
    $scope.secretWord = $scope.makeLetters("PRETEXTING");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");

    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();

    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal2").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $scope.enableNextLevel = true;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.hintShown = true;
        $scope.stopCountDown();
        $("#hintModal2").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/baq3');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

}]);

bewareApp.controller('beawareQ3Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = userService.getGameStrength().length;
    $scope.win = false;
    userService.gamesPlayed.push({
        gameId: 2,
        gameName: "BeAware"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                && $scope.counter === 30
                && !$scope.hintShown) {
                $scope.showHint();
            }
            else {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal3").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };
    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz");
    $scope.secretWord = $scope.makeLetters("CRYPTOLOGY");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");

    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();


    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal3").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $scope.enableNextLevel = true;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.hintShown = true;
        $scope.stopCountDown();
        $("#hintModal3").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/baq4');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

}]);

bewareApp.controller('beawareQ4Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = userService.getGameStrength().length;
    $scope.win = false;
    userService.gamesPlayed.push({
        gameId: 2,
        gameName: "BeAware"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                && $scope.counter === 30
                && !$scope.hintShown) {
                $scope.showHint();
            }
            else {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal4").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };

    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz");
    $scope.secretWord = $scope.makeLetters("AUTHENTICATION");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");

    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();


    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal4").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $scope.enableNextLevel = true;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.hintShown = true;
        $scope.stopCountDown();
        $("#hintModal4").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/baq5');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

}]);

bewareApp.controller('beawareQ5Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = userService.getGameStrength().length;
    $scope.win = false;
    userService.gamesPlayed.push({
        gameId: 2,
        gameName: "BeAware"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                && $scope.counter === 30
                && !$scope.hintShown) {
                $scope.showHint();
            }
            else {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal5").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };


    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };

    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz ");
    $scope.secretWord = $scope.makeLetters("CARD SKIMMER");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");

    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();


    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal5").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $scope.enableNextLevel = true;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.hintShown = true;
        $scope.stopCountDown();
        $("#hintModal5").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/baq6');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

}]);

bewareApp.controller('beawareQ6Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = userService.getGameStrength().length;
    $scope.win = false;
    userService.gamesPlayed.push({
        gameId: 2,
        gameName: "BeAware"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                && $scope.counter === 30
                && !$scope.hintShown) {
                $scope.showHint();
            }
            else {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	$scope.saveScores();
                $("#logOutModal6").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };



    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz ");
    $scope.secretWord = $scope.makeLetters("DENIAL OF SERVICE");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");


    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();


    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal6").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $scope.enableNextLevel = true;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.hintShown = true;
        $scope.stopCountDown();
        $("#hintModal6").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }

    $scope.proceedNext = function () {
        $location.path('/baq7');
    }

    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

}]);

bewareApp.controller('beawareQ7Ctrl', ['$scope', '$timeout', '$location', 'userService', '$rootScope', function ($scope, $timeout, $location, userService, $rootScope) {
    $scope.counter = 60;
    $scope.stopped;
    $scope.missesAllowed = 5;
    $scope.numMisses = userService.getGameStrength().length;
    $scope.win = false;
    userService.gamesPlayed.push({
        gameId: 2,
        gameName: "BeAware"
    });
    $scope.countdown = function () {
        $scope.stopped = $timeout(function () {
            if (!$scope.win && $scope.numMisses >= $scope.missesAllowed
                && $scope.counter === 30
                && !$scope.hintShown) {
                $scope.showHint();
            }
            else {
                $scope.counter--;
                $scope.countdown();
            }
            if ($scope.counter <= 0) {
            	 $scope.saveScores();
                $("#logOutModal7").modal('show');
                $scope.stopCountDown();
            }
        }, 1000);
    };

    $scope.stopCountDown = function () {
        $timeout.cancel($scope.stopped);
    };

    $scope.resumeCountDown = function () {
        $scope.countdown();
    };

    $scope.resumeCountDown();
    $scope.makeLetters = function (word) {
        return _.map(word.split(''), function (character) {
            return { name: character, chosen: false, id: Math.random().toString(36).substr(2, 9) };
        });
    };

    $scope.makeStrength = function (word) {
        return _.map(word.split(''), function (character, index) {
            return { name: character, chosen: false, id: index };
        });
    };

    $scope.letters = $scope.makeLetters("abcdefghijklmnopqrstuvwxyz ");
    $scope.secretWord = $scope.makeLetters("WIRELESS INTRUSION");
    $scope.beawareWord = $scope.makeStrength("BEAWARE");

    $scope.displayVowels = function () {
        for (var i = 0; i < $scope.secretWord.length; i++) {
            if ($scope.secretWord[i].name === "A" || $scope.secretWord[i].name === "E" || $scope.secretWord[i].name === "I" || $scope.secretWord[i].name === "O" || $scope.secretWord[i].name === "U") {
                $scope.secretWord[i].chosen = true;
            }
        }
        for (var j = 0; j < $scope.letters.length; j++) {
            if ($scope.letters[j].name === "a" || $scope.letters[j].name === "e" || $scope.letters[j].name === "i" || $scope.letters[j].name === "o" || $scope.letters[j].name === "u") {
                $scope.letters[j].chosen = true;
            }
        }
    };

    $scope.displayVowels();

    $scope.setGameStrength = function () {
        var strRemaining = userService.getGameStrength();
        if (strRemaining && strRemaining.length > 0) {
            for (var i = 0; i < strRemaining.length; i++) {
                for (var j = 0; j < $scope.beawareWord.length; j++) {
                    if ($scope.beawareWord[j].name === strRemaining[i].name
                        && $scope.beawareWord[j].id === strRemaining[i].id) {
                        $scope.beawareWord[j].chosen = true;
                        $scope.beawareWord[j].strike = true;
                    }
                }
            }
        }
    }

    $scope.setGameStrength();


    $scope.checkForEndOfGame = function () {
    	$scope.checkForSession();
        $scope.win = _.reduce($scope.secretWord, function (acc, letter) {
            return acc && letter.chosen;
        }, true);

        if (!$scope.win && $scope.numMisses === $scope.missesAllowed
            && !$scope.hintShown) {
            $scope.showHint();
        }
        else if (!$scope.win && $scope.numMisses === 8) {
        	$("#endMmodal7").modal('show');
       }
        else if (!$scope.win && $scope.numMisses === $scope.beawareWord.length) {
        	 $scope.beawareWord.push({ name: "!", chosen: false, id: 8 });
        }
        else if ($scope.win) {
            $scope.stopCountDown();
            userService.user.totalScore += 10;
            userService.user.totalTime += 60 - $scope.counter;
            $scope.enableNextLevel = true;
            userService.user.totalScore += 10;
            userService.user.totalTime += 30 - $scope.counter;
            $scope.totalScore = userService.user.totalScore;
            $scope.totalTime = userService.user.totalTime;
            $scope.name = userService.user.name;
            $scope.email = userService.user.email;
            $scope.location = userService.user.location;
        }
    }

    $scope.try = function (guess) {
        guess.chosen = true;
        var found = false;
        _.each($scope.secretWord,
            function (letter) {
                if (guess.name.toUpperCase() === letter.name.toUpperCase()) {
                    letter.chosen = true;
                    found = true;
                }
            });
        if (!found) {
            $scope.numMisses++;
            for (var i = 0; i < $scope.beawareWord.length; i++) {
                if (!$scope.beawareWord[i].strike) {
                    $scope.beawareWord[i].strike = true;
                    var strRemaining = userService.getGameStrength();
                    strRemaining.push($scope.beawareWord[i]);
                    break;
                }
            }
        }
        $scope.checkForEndOfGame();
    };


    $scope.showHint = function () {
        $scope.stopCountDown();
        $scope.hintShown = true;
        $("#hintModal7").modal('show');
    }

    $scope.logout = function () {
        $('.modal-backdrop').remove();
        $('.modal.in').modal('hide');
        $scope.gamesPlayed = userService.getGamesPlayed();

        for (var i = 0; i < $scope.gamesPlayed.length; i++) {
            if ($scope.gamesPlayed[i].gameName === "Wordscape") {
                $scope.wordScapePlayed = true;
            }
            else if ($scope.gamesPlayed[i].gameName === "BeAware") {
                $scope.beAwarePlayed = true;
            }
        }

        if ($scope.wordScapePlayed && $scope.beAwarePlayed) {
            $location.path('/login');
        }
        else {
            $location.path('/landing');
        }

    }


    $scope.pauseResumeText = "Pause Game";
    $scope.pauseResumeGame = function () {
        if ($scope.pauseResumeText === "Pause Game") {
            $scope.stopCountDown();
            $scope.pauseResumeText = "Resume Game";
            $("#overlay").show();
            $("#word").hide();
        }
        else {
            $scope.resumeCountDown();
            $scope.pauseResumeText = "Pause Game";
            $("#overlay").hide();
            $("#word").show();
        }

    }

    $scope.finish = function () {
    	 $scope.saveScores();
        $("#scoreModal").modal('show');
    }
    
    $scope.saveScores = function(){
    	$scope.checkForSession();
    	var req = {
    			"gameName": "BeAware",
    			"gameId": 2,
    			"score": userService.user.totalScore,
    			"time": userService.user.totalTime,
    			"empEmail": userService.user.email,
    			"empName": userService.user.name,
    			"empLocation": userService.user.location,
    			"empId": userService.user.empId
    		};
    		    	var callback = function(){
    		    		console.log("Scores Saved");
    		    	};
    		    	
    		    	userService.saveScore(req,callback);
    }
    
    $scope.checkForSession = function(){
    	if(!userService.user.name || userService.user.name === ""){
    		$("#sessionAlert").modal('show');
    	}
    };
    
    $scope.checkForSession();
    
    $scope.showLogin = function(){
    	 $location.path('/login');
    }

}]);

bewareApp.controller('reportController', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    $scope.data = {};
    $scope.getReport = function () {
            var location = $scope.data.location;
            var callback = function(data){
	    		console.log("Reports fetched!");
	    	};
            userService.getReport(location,callback);
    };
}]);

bewareApp.controller('monitorController', ['$scope', '$location', 'userService', '$timeout', function ($scope, $location, userService,$timeout) {
    $scope.data = [];
    $scope.testServer = function () {
    $scope.checkTest = $timeout(function () {
    		var startTime = new Date().toLocaleTimeString();
    		var endTime = new Date().toLocaleTimeString();
            var callback = function(data, status){
            	$scope.data.push({
            		"requestURL": "/games/gamesCtrl/test",
            		"httpStatus": status,
            		"requestStart": startTime,
            		"requestEnd": endTime
            	});
	    	};
            userService.testServer(callback);
            $scope.testServer();
    },300000);
    };
    
    $scope.testServer();
}]);

bewareApp.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});