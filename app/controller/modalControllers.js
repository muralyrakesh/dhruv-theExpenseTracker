(function(){


    var deleteModelController = function ($scope, $modalInstance, item) {

      $scope.selectedItem = item;
     
      $scope.ok = function () {
        $modalInstance.close($scope.selectedItem);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
    
   angular.module('dhruv').controller('deleteModelController', deleteModelController); 

}());