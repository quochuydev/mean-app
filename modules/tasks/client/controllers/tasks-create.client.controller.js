'use strict';

angular.module('tasks.admin').controller('TaskCreateController',
  ['$scope', '$state', 'ToastMessage', 'Task', 'CustomerGroup', 'Location',
    function ($scope, $state, ToastMessage, Task, CustomerGroup, Location) {
      $scope.appslug = appslug;
      $scope._CONST = _CONST;

      $scope.elem = {
        task: {
          title: '',
          description: ''
        },

        action: {
          create: function (form) {
            if (!form.$valid) { return $scope.$broadcast('show-errors-check-validity', 'createForm'); }
            Task.create($scope.elem.task, function (response) {
              console.log(response);
              ToastMessage.info('Tạo thành công');
            })
          }
        }
      }

      common.mcm.invoke($scope.elem, 'reset');
      common.mcm.invoke($scope.elem, 'init');
      common.mcm.invoke($scope.elem, 'config');
    }])