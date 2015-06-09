function onLoadCallback() {
    gapi.client.setApiKey('AIzaSyDIpHiHvSuv9IZyPGoSba5PgoiGN-qroGI');
    gapi.client.load('plus', 'v1', function () {

    });
}
(function(){

 var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client.js?onload=onLoadCallback';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    
     
    
  var oAuthLogin = function($rootScope, $cookies, $window, sAuth) {
    $rootScope.user = {};



    $window.fbAsyncInit = function() {
        FB.init({ 
            appId:'1400258100297949',
            channelUrl: 'app/channel.html', 
            status: true, 
            cookie: true, 
            xfbml: true 
        });

            FB.Event.subscribe('auth.login', function(){
                window.location.href = 'index.html';
        });

        sAuth.watchLoginChange();

    };

    (function(d){
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
  
  var authenticationServiceFactory = function($rootScope, $cookies) {
    
      authenticationServiceFactory.fbLogin =function() {
        console.error($cookies['userName']);
          if ($cookies['userName']) {
              window.location.href = 'index.html';
          } else {
              FB.login();
          }
     }
      
    authenticationServiceFactory.shareAWord = function() {
        FB.ui(
       { 
         method: 'stream.publish',
         message: 'Try this cool tool to track all your expenses and savings.',
         attachment: {
           name: 'Dhruv',
           caption: 'The Expense Tracker.',
           description: (
             'The simplest way to track your expense and savings.'
           ),
           href: 'http://localhost:8181/'
         },
         action_links: [
           { text: 'Dhruv - The Expense Tracker', href: 'http://localhost:8181/dhruv-theExpenseTracker/login.html' }
         ],
         user_prompt_message: 'The simplest way to track your expense and savings'
       },
       function(response) {
         if (response && response.post_id) {
           //alert('Post was published.');
         } else {
           //alert('Post was not published.');
         }
       }
     );  
    }
      
    authenticationServiceFactory.fbLogout = function() {
        FB.logout(); 
    }
    
     authenticationServiceFactory.watchLoginChange = function() {
         FB.Event.subscribe('auth.authResponseChange', function(res) {
                
                if (res.status === 'connected') {
                    FB.api('/me', function(res) {

                        $rootScope.$apply(function() { 
                            $rootScope.user = res; 
                            $rootScope.profilePic = "http://graph.facebook.com/"+$rootScope.user.id+"/picture?type=normal";
                            $cookies['userName'] = $rootScope.user.name;
                            $cookies['profilePic'] = $rootScope.profilePic;
                            $cookies['login'] = 'facebook';
                        });

                    });

                    
                } else {
                    $rootScope.$apply(function() { 
                        window.location.href = 'login.html';
                    });
                     
                }

        });
     }
          
    
    authenticationServiceFactory.gPlusLogin = function() {
        var myParams = {
            // Replace client id with yours
            'clientid': '61002307358-5n52s27tq5dhd1tpou3mu33tqiab400s.apps.googleusercontent.com',
            'cookiepolicy': 'single_host_origin',
            'callback': loginCallback,
            'approvalprompt': 'force',
            'scope': 'https://www.googleapis.com/auth/plus.login'
        };
        gapi.auth.signIn(myParams);

        function loginCallback(result) {
            if (result['status']['signed_in']) {

                var request = gapi.client.plus.people.get({'userId': 'me'});
                request.execute(function (resp) {
                    $rootScope.$apply(function() { 
                        console.log('Google+ Login RESPONSE: ' + angular.toJson(resp));
                        var userEmail;
                        if (resp['emails']) {
                            for (var i = 0; i < resp['emails'].length; i++) {
                                if (resp['emails'][i]['type'] == 'account') {
                                    userEmail = resp['emails'][i]['value'];
                                }
                            }
                        }
                        $rootScope.user.name = resp.displayName;
                        $rootScope.user.email = userEmail;
                        if(resp.gender) {
                            resp.gender.toString().toLowerCase() === 'male' ? $rootScope.user.gender = 'M' : $rootScope.user.gender = 'F';
                        } else {
                            $rootScope.user.gender = '';
                        }
                        $rootScope.profilePic = resp.image.url;
                        $cookies['userName'] = $rootScope.user.name;
                        $cookies['profilePic'] = $rootScope.profilePic;
                        $cookies['login'] = 'google';
                        window.location.href = 'index.html';
                    });
                   
                });
            }
        }

    }
    
    authenticationServiceFactory.gPlusLogout = function() {
         window.location.href = 'login.html';
    }
    
    return authenticationServiceFactory;
  }
    
    var mainController = function ($scope, $modal, $timeout, $rootScope, $http, $cookies, sAuth) {
        $timeout(function() {
                $scope.logOutFromApp = function() {
                    if ($cookies['login'] === 'facebook') {
                        sAuth.fbLogout();
                    } else {
                        sAuth.gPlusLogout();
                    }
                    delete $cookies['login'];
                    delete $cookies['userName'];
                    delete $cookies['profilePic'];
                }
                
                $scope.fbLogin = function() {
                    sAuth.fbLogin();
                }
                
                $scope.gplusLogin = function () {
                    sAuth.gPlusLogin();
                };
            
            $scope.shareAWord = function() {
                sAuth.shareAWord();
                $scope.estimateClass = "";
                    $scope.actualsClass = "";
                    $scope.dashboardClass = "";
                    $scope.spreadAWordClass = "active";   
            }
                
            $scope.catagories = [];
            
                $scope.catagoryFilter = {cat:''};
                $scope.showInformationStatistics = false;
                $scope.showEstimates = true;
                $scope.showAddExpense = true;
                $scope.showAct = false;
                $scope.estimatesChartObject = {type:'PieChart'};
                $scope.actualsChartObject = {type:'PieChart'};
                $scope.estimatesDashboardChartObject = {type:'PieChart'};

                function init() {
                     $rootScope.user.name = $cookies['userName'];
                    $rootScope.profilePic = $cookies['profilePic'];
                    $scope.availableDurations = ['', 'Daily', 'Monthly', 'Quarterly', 'Halfyearly', 'Annually'];
                    $scope.estimatedDuration = '';
                    $scope.estimatedChecking = null;
                    $scope.estimatedSaving = null;
                    $scope.estimateClass = "active";
                    $scope.actualsClass = "";
                    $scope.dashboardClass = "";
                    $scope.spreadAWordClass = "";
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
                    $scope.estimateClass = "";
                    $scope.actualsClass = "";
                    $scope.dashboardClass = "active";
                    $scope.spreadAWordClass = "";
                }

                $scope.showEstimate = function() {
                    $scope.showInformationStatistics = false;
                    $scope.estimateClass = "active";
                    $scope.actualsClass = "";
                    $scope.dashboardClass = "";
                    $scope.spreadAWordClass = "";
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
                    $scope.estimateClass = "";
                    $scope.actualsClass = "active";
                    $scope.dashboardClass = "";
                    $scope.spreadAWordClass = "";                    
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
                    if ($scope.catagories.indexOf($scope.expense.catagory) === -1) {
                        $scope.catagories.push($scope.expense.catagory);
                    }
                    
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
                    
                     $http({
                            method : 'POST',
                            data :estimate,
                            url : 'http://localhost:8181/dhruv/ExpenseTrackingService/saveEstimate',
                            headers : {
                                'Content-Type' : 'application/json'
                            }
                    }).success(function(response){
                        console.log(response)
                    });

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
    angular.module('dhruv', ['googlechart', 'ui.bootstrap', 'ngCookies']);
    angular.module('dhruv').factory('sAuth', authenticationServiceFactory);
    angular.module('dhruv').run(oAuthLogin);
    
    angular.module('dhruv').controller('mainController', mainController);
    
}());