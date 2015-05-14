(function(){
    
    var mainController = function ($scope, $timeout) {
        $timeout(function() {
            parseLocation();
            if (!$scope.userName) {
                    BootstrapDialog.show({
                    title: 'Login',
                    message: $('<div></div>').load('app/login/login.html')
                });
            } else {
                $scope.catagories = ['Grocery','Game', 'Goose', 'Ghost', 'Dress', 'Car'];
                $scope.catagoryFilter = {cat:''};
                $scope.showInformationStatistics = false;
                $scope.showEstimates = true;
                $scope.showHello = true;
                $scope.estimatesChartObject = {type:'PieChart'};
                $scope.actualsChartObject = {type:'PieChart'};
                $scope.estimatesDashboardChartObject = {type:'PieChart'};

                function init() {
                    $scope.availableDurations = ['', 'Daily', 'Monthly', 'Quarterly', 'Halfyearly', 'Annually'];
                    $scope.estimatedDuration = '';
                    $scope.estimatedChecking = null;
                    $scope.estimatedSaving = null;

                    $scope.estimatedSavings = [
                        {v: "Savings"},
                        {v: 0},
                    ];
                    $scope.estimatedCheckings = [
                        {v: "checking"},
                        {v: 0},
                    ]; 
                    $scope.estimatedSpending = [
                        {v: "spending"},
                        {v: 0},
                    ];
                    $scope.estimatesChartObject.data = {"cols": [
                        {id: "t", label: "fundType", type: "string"},
                        {id: "s", label: "fundVal", type: "number"}
                    ], "rows": [
                        {c: $scope.estimatedCheckings},
                        {c: $scope.estimatedSpending},
                        {c: $scope.estimatedSavings}
                    ]};
                    // $routeParams.chartType == BarChart or PieChart or ColumnChart or LineChart or ...
                    $scope.estimatesChartObject.type = 'PieChart';
                    $scope.estimatesChartObject.options = {
                        'is3D':'true'
                    }        
                }

                $scope.$watch('estimatedSaving', function() {
                    $scope.estimatedSavings[1].v= $scope.estimatedSaving;
                    $scope.estimatedCheckings[1].v= $scope.estimatedChecking - $scope.estimatedSaving;

                });

                $scope.showDashBoard = function() {
                    $scope.showInformationStatistics = true;
                    $scope.showEstimates = false;
                }

                $scope.showEstimate = function() {
                    $scope.showHello = false;
                    $scope.showInformationStatistics = false;
                    $scope.showEstimates = true;
                }

                $scope.showActuals = function() {
                    $scope.showInformationStatistics = false;
                    $scope.showEstimates = false;
                }


                $scope.resetEstimates = function() {
                    init();
                }

                $scope.submitEstimates = function() {
                    var estimate = {
                        checking: $scope.estimatedCheckings[1].v,
                        saving: $scope.estimatedSavings[1].v,
                        spending: 0,
                        duration: $scope.estimatedDuration
                    }

                    $scope.showInformationStatistics = true;
                    $scope.showEstimates = false;
                    console.log(estimate);

                    $scope.actualsChecking = [
                        {v: "checking"},
                        {v: estimate.checking},
                    ];
                    $scope.actualsSpending = [
                        {v: "Spending"},
                        {v: estimate.spending},
                    ];
                    $scope.actualsSavings = [
                        {v: "Savings"},
                        {v: estimate.saving},
                    ];

                    $scope.actualsChartObject.data = {"cols": [
                        {id: "t", label: "fundType", type: "string"},
                        {id: "s", label: "fundVal", type: "number"}
                    ], "rows": [
                        {c: $scope.actualsChecking},
                        {c: $scope.actualsSpending},
                        {c: $scope.actualsSavings}
                    ]};
                    // $routeParams.chartType == BarChart or PieChart or ColumnChart or LineChart or ...
                    $scope.actualsChartObject.type = 'PieChart';
                    $scope.actualsChartObject.options = {
                        'is3D':'true'
                    }

                    $scope.estimatedDashboardSavings = [
                        {v: "Savings"},
                        {v: $scope.estimatedSavings[1].v},
                    ];
                    $scope.estimatedDashboardCheckings = [
                        {v: "checking"},
                        {v: $scope.estimatedCheckings[1].v},
                    ]; 
                    $scope.estimatedDashboardSpending = [
                        {v: "spending"},
                        {v: 0},
                    ];
                    $scope.estimatesDashboardChartObject.data = {"cols": [
                        {id: "t", label: "fundType", type: "string"},
                        {id: "s", label: "fundVal", type: "number"}
                    ], "rows": [
                        {c: $scope.estimatedDashboardCheckings},
                        {c: $scope.estimatedDashboardSpending},
                        {c: $scope.estimatedDashboardSavings}
                    ]};
                    // $routeParams.chartType == BarChart or PieChart or ColumnChart or LineChart or ...
                    $scope.estimatesDashboardChartObject.type = 'PieChart';
                    $scope.estimatesDashboardChartObject.options = {
                        'is3D':'true'
                    } 
                }

                init();
            }
        }, 500);
        
        

      $scope.openCalander = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 2);
      $scope.events =
        [
          {
            date: tomorrow,
            status: 'full'
          },
          {
            date: afterTomorrow,
            status: 'partially'
          }
        ];

      $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i=0;i<$scope.events.length;i++){
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      };
                
        function parseLocation(val) {
            var result = "Not found",
                tmp = [];
            var items = location.search.substr(1).split("&");
            
            for (var index = 0; index < items.length; index++) {
               tmp = items[index].split("=")[1];
                decodeURI(tmp);
                //if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
            }
            $scope.userName=tmp;
        }
        
        
    };
    angular.module('dhruv', ['googlechart', 'ui.bootstrap']);
    angular.module('dhruv').controller('mainController', mainController);
    
}());