(function(){
   
    
  var facebookLogin = function($rootScope, $window, sAuth) {

  $rootScope.user = {};

  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded

    FB.init({ 

      /* 
       The app id of the web app;
       To register a new app visit Facebook App Dashboard
       ( https://developers.facebook.com/apps/ ) 
      */

        appId:'1400258100297949',
      

      /* 
       Adding a Channel File improves the performance 
       of the javascript SDK, by addressing issues 
       with cross-domain communication in certain browsers. 
      */

      channelUrl: 'app/channel.html', 

      /* 
       Set if you want to check the authentication status
       at the start up of the app 
      */

      status: true, 

      /* 
       Enable cookies to allow the server to access 
       the session 
      */

      cookie: true, 

      /* Parse XFBML */

      xfbml: true 
    });
      
      FB.Event.subscribe('auth.login', function(){
            window.location.href = 'index.html';
        });
      FB.Event.subscribe('auth.logout', function(){
        window.location.href = 'login.html';
    });
    sAuth.watchLoginChange();

  };

  // Are you familiar to IIFE ( http://bit.ly/iifewdb ) ?

  (function(d){
    // load the Facebook javascript SDK

    var js, 
    id = 'facebook-jssdk', 
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script'); 
    js.id = id; 
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));

}
  
  var authenticationServiceFactory = function($rootScope) {
    
      authenticationServiceFactory.login =function() {
      
          FB.login(function(response) {
              console.log(response);
              if (response.status === 'connected') {
                  FB.api('/me', function(response) {

                    $rootScope.$apply(function() { 
                        $rootScope.user = response; 
                        $rootScope.profilePic = "http://graph.facebook.com/"+$rootScope.user.id+"/picture?type=normal";
                    });

               });
              } else {
                window.location.href = 'login.html';
              }
              
          });
      
      }
      
      authenticationServiceFactory.watchLoginChange = function() {
          FB.Event.subscribe('auth.authResponseChange', function(res) {
            if (res.status === 'connected') {
              /* 
               The user is already logged, 
               is possible retrieve his personal info
              */
              FB.api('/me', function(res) {

                    $rootScope.$apply(function() { 
                        $rootScope.user = res; 
                        $rootScope.profilePic = "http://graph.facebook.com/"+$rootScope.user.id+"/picture?type=normal";
                    });

               });

              /*
               This is also the point where you should create a 
               session for the current user.
               For this purpose you can use the data inside the 
               res.authResponse object.
              */

            } else {
              window.location.href = 'login.html';
            }

            });
      }
    
    
    authenticationServiceFactory.logout = function() {

        FB.logout(function(response) {

            $rootScope.$apply(function() { 

              $rootScope.user = {}; 
                window.location.href = 'login.html';

            }); 

        });

    }
    
    return authenticationServiceFactory;
  }
    
    var mainController = function ($scope, $modal, $timeout, $rootScope, sAuth) {
        $timeout(function() {
                
                $scope.logOutFromApp = function() {
                    sAuth.logout();
                
                }
                
                $scope.fbLogin = function() {
                    sAuth.login();
                }
                
                $scope.catagories = ['Grocery','Game', 'Goose', 'Ghost', 'Dress', 'Car'];
                $scope.catagoryFilter = {cat:''};
                $scope.showInformationStatistics = false;
                $scope.showEstimates = true;
                $scope.showAddExpense = true;
                $scope.showAct = false;
                $scope.estimatesChartObject = {type:'PieChart'};
                $scope.actualsChartObject = {type:'PieChart'};
                $scope.estimatesDashboardChartObject = {type:'PieChart'};

                function init() {
                    $scope.availableDurations = ['', 'Daily', 'Monthly', 'Quarterly', 'Halfyearly', 'Annually'];
                    $scope.estimatedDuration = '';
                    $scope.estimatedChecking = null;
                    $scope.estimatedSaving = null;
                    $scope.allExpenses = [];
                    $scope.peekExpenses = [];
                    $scope.expense = {};
                    $scope.expense.date = new Date();

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
                    $scope.showAddExpense = false;
                    $scope.showEstimates = false;
                    if ($scope.allExpenses != null && $scope.allExpenses.length > 0) {
                        $scope.showActualsList = true;
                        $scope.showActuals = false;
                    } else {
                        $scope.showActuals = true;
                        $scope.showActualsList = false;
                    }
                    $scope.showAllActuals = false;
                }

                $scope.showEstimate = function() {
                    $scope.showInformationStatistics = false;
                    $scope.showEstimates = true;
                    $scope.showActuals = false;
                    $scope.showAllActuals = false;
                    $scope.showActualsList = false;
                }

                $scope.showActual = function() {
                    $scope.showInformationStatistics = false;
                    $scope.showAllActuals = true;
                    $scope.showAddExpense = false;
                    $scope.showEstimates = false;
                    
                }
                
                $scope.deleteActual = function(exp, size) {
                    var modalInstance = $modal.open({
                      animation: true,
                      templateUrl: 'deleteModalContent.html',
                      controller: 'deleteModelController',
                      size: size,
                      resolve: {
                        item: function () {
                          return exp;
                        }
                      }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        $scope.actualsSpending[1].v = parseFloat($scope.actualsSpending[1].v) + parseFloat(selectedItem.ammount);
                        var peekIndex = $scope.peekExpenses.indexOf(selectedItem);
                        var allExpensesIndex = $scope.allExpenses.indexOf(selectedItem);
                        $scope.peekExpenses.splice(peekIndex, 1);
                        $scope.allExpenses.splice(allExpensesIndex, 1);
                    }, function () {
                      console.log('Modal dismissed at: ' + new Date());
                    });
                    
                }
                
                
                
                $scope.editActual = function(exp) {
                    console.log(exp);
                    $scope.showActuals = true;
                    $scope.expense = exp;
                }
                
                $scope.editAct = function(exp) {
                    console.log(exp);
                    $scope.showAct = true;
                    $scope.expense = exp;
                }
                
                $scope.viewActual = function(exp, size) {
                    console.log(exp);
                }
                
                $scope.saveExpense = function() {
                    $scope.actualsChecking[1].v = parseFloat($scope.actualsChecking[1].v) - parseFloat($scope.expense.ammount);
                    $scope.actualsSpending[1].v = parseFloat($scope.actualsSpending[1].v) + parseFloat($scope.expense.ammount);
                    if ($scope.allExpenses != null && $scope.allExpenses.indexOf($scope.expense) === -1) {
                        $scope.allExpenses.push($scope.expense);
                       
                    }
                    
                    if ($scope.peekExpenses != null && $scope.peekExpenses.indexOf($scope.expense) === -1) {
                       if ($scope.peekExpenses != null && $scope.peekExpenses.length === 4) {
                           $scope.peekExpenses.splice(0, 1);
                        }
                        $scope.peekExpenses.push($scope.expense);
                       
                    }
                    if ($scope.showAct) {
                        $scope.showAct = false;
                    } else {
                        $scope.showActualsList = true;
                        $scope.showEstimates = false;
                        $scope.showActuals = false;
                        $scope.showInformationStatistics = true;
                        $scope.showAddExpense = false;
                    }
                     $scope.resetExpense();
                    
                }
                
                $scope.addExpense = function() {
                    $scope.showInformationStatistics = true;
                    $scope.showActuals = true;
                    $scope.showActualsList = false;
                    $scope.showAddExpense = false;
                }

                $scope.resetEstimates = function() {
                    init();
                }
                
                $scope.resetExpense = function() {
                    $scope.expense = {date:new Date()};
                     $scope.showActuals = false;
                    $scope.showAct = false;
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
                        {v: "Spent"},
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
    angular.module('dhruv').factory('sAuth', authenticationServiceFactory);
    angular.module('dhruv').run(facebookLogin);
    angular.module('dhruv').controller('mainController', mainController);
    
}());