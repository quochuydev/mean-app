'use strict';

angular.module('tasks.admin').controller('TaskDetailController',
  ['$scope', 'Product', 'Task', '$state', 'Loading',
    async function ($scope, Product, Task, $state, Loading) {
      $scope._do = _do;
      $scope._CONST = _CONST;

      $scope.elem = {
        task: {
          reset: function () {

          },
          init: function () {
            Loading.show(true);
            Task.get({ taskId: $state.params.taskId }, function (data) {
              let task = data.item;
              $scope.task = task;
            }, function () {
              Loading.show(false);
            })
            Loading.show(false);
          },
          config: function () {

          }
        }
      }

      common.mcm.invoke($scope.elem, 'reset');
      common.mcm.invoke($scope.elem, 'init');
      common.mcm.invoke($scope.elem, 'config');
    }]);