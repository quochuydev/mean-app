'use strict';

angular.module('promotions.admin').controller('PromotionController',
  ['$scope', 'Location', '$timeout', '$filter', 'Promotion', 'ToastMessage', 'User', 'CustomerGroup', 'Loading',
    async function ($scope, Location, $timeout, $filter, Promotion, ToastMessage, User, CustomerGroup, Loading) {
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
              Promotion.search(query, function (result) {
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
                  let promotion_client = PromotionUtil.renderClient(promotion);
                  let objData = PromotionUtil.makeDataDescription(promotion_client);
                  PromotionUtil.parseDescription(promotion, objData);
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
            $scope.elem.modal.show('isShowDeletePromotion');
            $scope.promotionId = id;
          },
          delete: function (id) {
            Promotion.delete({ promotionId: id }, function (data) {
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
            Promotion.changeStatus({ promotionId: id, status: 2 }, function () {
              ToastMessage.info(MSG('ME-00013'));
              $scope.searchFilter();
            })
          },
          active: function (id) {
            Promotion.changeStatus({ promotionId: id, status: 1 }, function () {
              ToastMessage.info(MSG('ME-00013'));
              $scope.searchFilter();
            })
          }
        },
        modal: {
          init: function () {
            $scope.isShowDeletePromotion = false;
          },
          show: function (modal) {
            $scope[modal] = true;
          },
          close: function () {
            $scope.isShowDeletePromotion = false;
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

class Filter {
  constructor({ caseFilter, selected }) {
    this.caseFilter = caseFilter;
    this.selected = selected;
    this.values = Array.isArray(selected) ? selected : [selected];
  }

  get CONST_FILTERS() {
    return {
      'locations.id': { filter_value: 'id', filter_name: 'name', text_none_value: 'Tất cả cửa hàng', text: `Cửa hàng: {name}` },
      'customer_groups.id': { filter_value: 'id', filter_name: 'name', text_none_value: 'Tất cả nhóm khách hàng', text: `Nhóm khách hàng {name}` },
      'source_names.code': { filter_value: 'value', filter_name: 'name', text_none_value: 'Tất cả kênh áp dụng', text: `Kênh áp dụng: {name}` },
      'user_created': { filter_value: 'id', filter_name: 'name', text_none_value: 'Tất cả', text: `Người tạo là: {email}` }
    }
  }

  setObjectFilter() {
    let _this = this;
    let filters = {
      'product': () => _this.objectFilterByProduct(),
      'status': () => _this.objectFilterByStatus(),
    }
    let func = filters[this.caseFilter];
    if (func) { return func(); }
    return this.objectFilter();
  }

  objectFilter() {
    let name = `${this.caseFilter}`;
    let filter_value = this.CONST_FILTERS[this.caseFilter]['filter_value'];
    let value = this.selected[filter_value];
    let key = `${this.caseFilter}_${value}`;
    let text = this.objectFilterText(value);
    return { key, name, value, text };
  }

  objectFilterText(value) {
    if (!value) { return this.CONST_FILTERS[this.caseFilter]['text_none_value'] }
    return _do.compile(this.CONST_FILTERS[this.caseFilter]['text'], this.selected)
  }

  objectFilterByProduct() {
    let { selected } = this;
    let id = selected.variants[0].id;
    let key = _do.compile('variant_buy_id__{id}', { id });
    let name = _do.compile('variant_buy_id__{id}', { id });
    let text = `Sản phẩm mua ${_do.joinS([selected.title, selected.variants[0].title], ' || ')}`
    return { key, name, value: selected.id, text };
  }

  objectFilterByStatus() {
    let CONST_STATUS_FILTERS = {
      in_time: { key: 'status_in_time', name: 'status_in_time', value: true, text: 'Tình trạng: Đang khuyến mãi' },
      not_yet: { key: 'status_not_yet', name: 'status_not_yet', value: true, text: 'Tình trạng: Chưa khuyến mãi' },
      active: { key: 'status_active', name: 'status_active', value: true, text: 'Tình trạng: Đã kích hoạt' },
      inactive: { key: 'status_inactive', name: 'status_inactive', value: true, text: 'Tình trạng: Chưa kích hoạt' },
      stopped: { key: 'status_stopped', name: 'status_stopped', value: true, text: 'Tình trạng: Ngừng khuyến mãi' },
    }
    return CONST_STATUS_FILTERS[this.selected.value];

    //PHASE2:
    let items = []

    for (let i = 0; i < this.values.length; i++) {
      const value = this.values[i];
      items.push(CONST_STATUS_FILTERS[value])
    }

    console.log(items.map(e => e.text))
    let objectFilter = { key: 'status', name: 'status', value: items, text: items.map(e => e.text).join(',') }
    console.log(items);
    console.log(objectFilter);
    return;
  }
}