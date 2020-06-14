'use strict';

angular.module('promotions.admin').controller('TaskController',
  ['$scope', 'Location', '$timeout', '$filter', 'Task', 'ToastMessage', 'User', 'CustomerGroup', 'Loading',
    async function ($scope, Location, $timeout, $filter, Task, ToastMessage, User, CustomerGroup, Loading) {
      $scope._do = _do;
      $scope.MSG = MSG;

      $scope.elem = {
        page: {
          reset: function () {
            $scope.currentPage = 1;
          },
          query: {
            set: function (it, query) {
              query.page = $scope.currentPage;
            }
          }
        },
        limit: {
          reset: function () {
            $scope.itemsPerPage = 20;
          },
          query: {
            set: function (it, query) {
              query.limit = Number($scope.itemsPerPage);
            }
          }
        },
        product: {
          init: function () {
          },
          config: function () {
            $scope.searchBoxParams = { limit: 10, reload: true };
          }
        },
        filter: {
          doing: false,
          caseFilter: null, // ['status', 'product', 'group_customer', 'channel', 'store', 'user_created']
          items: [],
          prop_name: 'name',
          prop_value: 'value',
          prop_sub_name: '',
          selected: null,
          query: {
            set: function (it, query) {
              if ($scope.codeSearch != undefined) {
                query.code = $scope.codeSearch;
              }
            }
          },
          reset: function () {
            $scope.elem.filter.prop_value = 'value';
            $scope.elem.filter.prop_name = 'name';
            $scope.elem.filter.prop_sub_name = '';
            $scope.elem.filter.selected = null;
            $scope.elem.filter.items = [];
          },
          init: function () {
            $scope.elem.filter.caseFilter = 'status';

            $scope.setQuery = function () {
              const query = {};
              common.mcm.invoke($scope.elem, 'query.set', query);
              return $filter('cleanObject')(query, [null, '', []]);
            }
          },
          config: function () {
            $scope.search = function (query) {
              if (!query) {
                query = $scope.query = $scope.setQuery();
              }
              // console.log('Query filter: ', query);
              Loading.show(true);
              $scope.loadingTable = true;
              Task.search(query, function (result) {
                $scope.totalItems = result.total;
                $scope.promotions = result.items;
                for (let i = 0; i < $scope.promotions.length; i++) {
                  const promotion = $scope.promotions[i];
                  if (promotion && promotion.customer_groups) {
                    promotion._customer_groups = promotion.customer_groups.map(e => e.name).join(', ');
                  }
                  if (promotion && promotion.source_names) {
                    promotion._source_names = promotion.source_names.map(e => e.name).join(', ');
                  }
                  if (promotion && promotion.locations) {
                    promotion._locations = promotion.locations.map(e => e.name).join(', ');
                  }
                  let promotion_client = TaskUtil.renderClient(promotion);
                  let objData = TaskUtil.makeDataDescription(promotion_client);
                  TaskUtil.parseDescription(promotion, objData);
                }
                $scope.loadingTable = false;
                Loading.show(false);
                // console.log('$scope.promotions', $scope.promotions)
              })
            }

            $scope.filters = [];
            $scope.addFilter = function () {
              $scope.elem.filter.doing = false;
              if ($scope.elem.filter.selected) {
                let filter = new Filter($scope.elem.filter);
                let objectFilter = filter.setObjectFilter();
                if (objectFilter && !$scope.filters.find(e => e.key == objectFilter.key)) {
                  $scope.filters.push(objectFilter);
                }
                $scope.elem.filter.doing = true;
              }
              $scope.searchFilter();
            }
            $scope.removeFilter = function (key) {
              $scope.filters = $scope.filters.filter(e => e.key != key);
              $scope.searchFilter();
            }

            $scope.searchFilter = function () {
              let query = $scope.setQuery();

              for (let filter of $scope.filters) {
                query[filter.name] = filter.value;
                $scope.query = query;
              }
              $scope.search(query);
            }

            $scope.changePage = function () {
              if ($scope.elem.filter.doing) {
                $scope.searchFilter();
              } else {
                $scope.search();
              }
            }

            $scope.$watch('elem.filter.items', function (value) {
              if (value && value[0]) {
                $scope.elem.filter.selected = $scope.elem.filter.items[0];
              }
            })

            $scope.debounceSearchFilter = _.debounce($scope.searchFilter, 500, { trailing: true });

            $scope.changeCodeSearch = function () {
              $scope.debounceSearchFilter();
            }

            $scope.searchFilter()
          },
          change: function () {
            $scope.elem.filter.reset();
            let filter_case = $scope.elem.filter.caseFilter;
            if (filter_case == 'status') {
              $scope.elem.filter.items = [
                { value: 'in_time', name: 'Đang khuyến mãi' },
                { value: 'active', name: 'Đã kích hoạt' },
                { value: 'inactive', name: 'Chưa kích hoạt' },
                // { value: 'not_yet', name: 'Chưa khuyến mãi' },
                // { value: 'stopped', name: 'Ngừng khuyến mãi' },
              ]
            }
            if (filter_case == 'customer_groups.id') {
              CustomerGroup.query(function (data) {
                $scope.elem.filter.items = [{ id: null, name: 'Tất cả' }, ...data.customer_groups];
                $scope.elem.filter.prop_name = 'name';
                $scope.elem.filter.prop_value = 'id';
              })
            }

            if (filter_case == 'source_names.code') {
              $scope.elem.filter.items = [
                { value: null, name: 'Tất cả' },
                { value: 'hararetail', name: 'HaraRetail' },
                { value: 'website', name: 'Website' }
              ];
            }

            if (filter_case == 'locations.id') {
              Location.query(function (data) {
                $scope.elem.filter.items = [{ id: null, name: 'Tất cả' }, ...data.locations];
                $scope.elem.filter.prop_value = 'id';
              })
            }

            if (filter_case == 'user_created') {
              User.query(function (data) {
                $scope.elem.filter.items = [{ id: null, first_name: 'Tất cả' }, ...data.users];
                $scope.elem.filter.prop_name = 'first_name';
                $scope.elem.filter.prop_sub_name = 'last_name';
                $scope.elem.filter.prop_value = 'id';
              })
            }

          }
        },
        tooltip: {
          init: function () {
            $scope.promotionId = null;
            $scope.tooltipFilter = false;
            $scope.elem.filter.change();
          },
          filter: {
            cancel: function () {
              $scope.tooltipFilter = false;
              $scope.elem.filter.doing = false;
            },
            toggle: function () {
              $scope.tooltipFilter = !$scope.tooltipFilter;
            }
          },
          config: function () {
            //
          }
        },
        action: {
          showDelete: function (id) {
            $scope.elem.modal.show('isShowDeleteTask');
            $scope.promotionId = id;
          },
          delete: function (id) {
            Task.delete({ promotionId: id }, function (data) {
              $scope.searchFilter();
              $scope.elem.modal.close();
              return ToastMessage.info(MSG('ME-00014'));
            }, function (error) {
              $scope.searchFilter();
              $scope.elem.modal.close();
              return ToastMessage.error(error.data.message || 'Đã có lỗi xảy ra');
            });
          },
          inactive: function (id) {
            Task.changeStatus({ promotionId: id, status: 2 }, function () {
              ToastMessage.info(MSG('ME-00013'));
              $scope.searchFilter();
            })
          },
          active: function (id) {
            Task.changeStatus({ promotionId: id, status: 1 }, function () {
              ToastMessage.info(MSG('ME-00013'));
              $scope.searchFilter();
            })
          }
        },
        modal: {
          init: function () {
            $scope.isShowDeleteTask = false;
          },
          show: function (modal) {
            $scope[modal] = true;
          },
          close: function () {
            $scope.isShowDeleteTask = false;
          }
        }
      }

      common.mcm.invoke($scope.elem, 'reset');
      common.mcm.invoke($scope.elem, 'init');
      common.mcm.invoke($scope.elem, 'config');

      $(document).on('click', function (e) {
        if (!$(e.target).parents('.filter-box').length) {
          $scope.$apply(function () {
            $scope.tooltipFilter = false;
          });
        }
      });
    }])