/**
 * Created by Xing on 3/6/16.
 */
angular.module('mainApp', [])
    .controller('mainCtrl', function ($scope) {
        // Initialize data pattern
        $scope.buttonsValue = {
            0: "石头",
            1: "剪子",
            2: "布"
        };

        // Initialize counter
        var tryCounter = $scope.tryCounter = 0;
        var correctCounter = $scope.correctCounter = 0;
        $scope.winRate = '0 %';

        // Initialize result pattern
        var resultPattern = {
            0: {
                1: true,
                2: false
            },
            1: {
                0: false,
                2: true
            },
            2: {
                0: true,
                1: false
            }
        };

        // Function of computer random choice
        // Integer in range [0, 3)
        var computerRandom = function () {
            return Math.floor(Math.random() * 3);
        };

        // Function of checking result, return $scope.result for UI
        var checkResult = function (usr, comp) {

            if (usr === comp) $scope.result = '平手';
            else $scope.result = resultPattern[usr][comp] ? '胜利' : '失败';
            return $scope.result;
        };

        // Invoked when clicking option buttons
        $scope.showResult = function (userChoice) {
            var currentChoice = userChoice;
            var computerChoice = computerRandom();
            // Get output data with data pattern
            $scope.computerChoice = $scope.buttonsValue[computerChoice];
            checkResult(currentChoice, computerChoice);
            tryCounter += 1;
            // Calculate for implementation
            $scope.tryCounter = tryCounter;
            if (resultPattern[currentChoice][computerChoice] == true) correctCounter += 1;
            $scope.correctCounter = correctCounter;
            $scope.winRate = (correctCounter/tryCounter*100).toString().split('.')[0] + '%';
        };

        // Invoked when click 'clear' button
        $scope.clear = function () {
            $scope.tryCounter = 0;
            $scope.correctCounter = 0;
            $scope.winRate = '0 %';
        }

    });