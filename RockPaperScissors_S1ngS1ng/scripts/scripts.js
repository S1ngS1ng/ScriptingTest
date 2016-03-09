/**
 * Created by Xing on 3/6/16.
 */
angular.module('mainApp', [])
    .controller('mainCtrl', function ($scope) {
        $scope.buttonsValue = {
            0: "石头",
            1: "剪子",
            2: "布"
        };
        var tryCounter = 0;
        var correctCounter = 0;
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
        var computerRandom = function () {
            return Math.floor(Math.random() * 3);
        };
        var checkResult = function (usr, comp) {

            if (usr == comp) $scope.result = '平手';
            else $scope.result = resultPattern[usr][comp] ? '胜利' : '失败';
        };
        $scope.showResult = function (userChoice) {
            var currentChoice = userChoice;
            console.log(currentChoice);
            var computerChoice = computerRandom();
            $scope.computerChoice = $scope.buttonsValue[computerChoice];
            checkResult(currentChoice, computerChoice);
            tryCounter += 1;
            $scope.tryCounter = tryCounter;
            if (resultPattern[currentChoice][computerChoice] == true) correctCounter += 1;
            $scope.correctCounter = correctCounter;
            $scope.winRate = (correctCounter/tryCounter).toFixed(2) * 100 + '%';
        };

    });