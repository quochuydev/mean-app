'use strict';

angular.module('promotions.admin').controller('TaskCreateController',
  ['$scope', '$state', 'ToastMessage', 'Task', 'CustomerGroup', 'Location',
    function ($scope, $state, ToastMessage, Task, CustomerGroup, Location) {
      $scope.appslug = appslug;
      $scope._CONST = _CONST;

      /**
       * PHASE 1:
       * $scope.elem.promotion = {
       *  condition_type_apply: null, // P1: 'product'
       *  promotion_type_apply: null, // P1: 'product'
       * }
       */

      $scope.elem = {
        promotion: {
          type: _CONST.PROMOTION.TYPE.BUYX_GETY,
          status: _CONST.PROMOTION.STATUS.ACTIVE,
          code: null,
          name: null,
          not_expired: false,
          start_date: new Date((new Date()).setHours(0, 0, 0, 0)),
          end_date: null,
          customer_groups: null,
          source_names: null,
          locations: null,
          condition_quantity: 0,
          condition_type_apply: 'product',
          condition_items: [],
          promotion_type_apply: 'product',
          promotion_items: []
        },

        action: {
          change: function (action, data) {
            switch (action) {
              case 'promotion_buy_type_apply':
                $scope.elem.promotion_buy.reset();
                break;
              case 'promotion_get_type_apply':
                $scope.elem.promotion.promotion_items = [];
                break;
            }
          },
          remove_line: function (type, item) {
            item = { ...item };
            if (type == 'buy_product') {
              $scope.elem.promotion.condition_items = $scope.elem.promotion.condition_items.filter(e => e.id != item.id)
            }
            if (type == 'buy_variant') {
              let index = $scope.elem.promotion.condition_items.findIndex(e => e.id == item.product_id);
              if (index > -1) {
                $scope.elem.promotion.condition_items[index].variants = $scope.elem.promotion.condition_items[index].variants.filter(e => e.id != item.id);
                if (!$scope.elem.promotion.condition_items[index].variants.length) {
                  $scope.elem.promotion.condition_items = $scope.elem.promotion.condition_items.filter(e => e.id != item.product_id);
                }
              }
            }
            if (type == 'get_product') {
              $scope.elem.promotion.promotion_items = $scope.elem.promotion.promotion_items.filter(e => e.id != item.id)
            }
            if (type == 'get_variant') {
              let index = $scope.elem.promotion.promotion_items.findIndex(e => e.id == item.product_id);
              if (index > -1) {
                $scope.elem.promotion.promotion_items[index].variants = $scope.elem.promotion.promotion_items[index].variants.filter(e => e.id != item.id);
                if (!$scope.elem.promotion.promotion_items[index].variants.length) {
                  $scope.elem.promotion.promotion_items = $scope.elem.promotion.promotion_items.filter(e => e.id != item.product_id);
                }
              }
            }
          },
          create: function (form) {
            console.log('Data create (chưa validate client): ', $scope.elem.promotion);
            form.$submitted = true;
            let promotion = $scope.elem.promotion;
            let errors = [];

            let { condition_quantity, code, name, condition_items, promotion_items } = promotion;
            if (condition_quantity == undefined) {
              form.promotion_buy_quantity.$invalid = true;
              errors.push(MSG('ME-00005'))
            }

            if (!(condition_quantity >= 1 && condition_quantity <= 999)) {
              form.promotion_buy_quantity.$invalid = true;
              errors.push(MSG('ME-00003', { abc: 'Số lượng sản phẩm mua' }))
            }

            if (!(condition_items.length)) {
              errors.push(MSG('ME-00005'));
            }

            if (!(promotion_items.length)) {
              errors.push(MSG('ME-00008'));
            }

            if (_is.emptyData(code)) {
              form.promotion_code.$invalid = true;
              errors.push(MSG('ME-00005'));
            }

            if (!(code && code.length <= 20)) {
              form.promotion_code.$invalid = true;
              errors.push(MSG('ME-00003', { abc: 'Mã CTKM' }));
            }

            if (_is.emptyData(name)) {
              form.promotion_name.$invalid = true;
              errors.push(MSG('ME-00005'));
            }

            if (!(name && name.length <= 50)) {
              form.promotion_name.$invalid = true;
              errors.push(MSG('ME-00003', { abc: 'Tên CTKM' }));
            }

            if (promotion.start_date == null) {
              errors.push(MSG('ME-00005'));
            }

            if (!promotion.not_expired && promotion.end_date == null) {
              errors.push(MSG('ME-00005'));
            }

            if (!promotion.not_expired && promotion.start_date >= promotion.end_date) {
              errors.push(MSG('ME-00004'));
            }

            for (let i = 0; i < promotion.promotion_items.length; i++) {
              const item = promotion.promotion_items[i];
              for (let j = 0; j < item.variants.length; j++) {
                const variant = item.variants[j];
                if (variant.quantity_apply == undefined) {
                  form[`get_quantity_apply[${variant.id}]`].$invalid = true;
                  errors.push(MSG('ME-00005'));
                }
                if (!(variant.quantity_apply > 0 && variant.quantity_apply <= 999)) {
                  form[`get_quantity_apply[${variant.id}]`].$invalid = true;
                  errors.push(MSG('ME-00003', { abc: 'SL khuyến mãi' }));
                }

                if (variant.promotion_type == _CONST.PROMOTION.DISCOUNT_TYPE.PERCENT && !(variant.promotion_value > 0 && variant.promotion_value <= 100)) {
                  form[`get_promotion_value[${variant.id}]`].$invalid = true;
                  errors.push(MSG('ME-00003', { abc: 'Giá trị giảm (%)' }))
                }
                if (variant.promotion_type == _CONST.PROMOTION.DISCOUNT_TYPE.MONEY && !(variant.promotion_value > 0 && variant.promotion_value <= 999999999)) {
                  form[`get_promotion_value[${variant.id}]`].$invalid = true;
                  errors.push(MSG('ME-00003', { abc: 'Giá trị giảm (đ)' }))
                }
              }
            }

            let isValid = form.$valid;
            if (!isValid) { $scope.$broadcast('show-errors-check-validity', 'createForm'); }
            if (errors.length) { return ToastMessage.error(errors[0]); }

            promotion = TaskUtil.mappingServer(promotion);
            Task.create(promotion, function () {
              ToastMessage.info(MSG('ME-00002'));
              return $state.go('admin.promotions');
            }, function (error) {
              let message = error.data && error.data.message ? error.data.message : MSG('ME-00006');
              return ToastMessage.error(message);
            })
          }
        },

        promotion_buy: {
          product_selected: null,
          reset: function () {
            $scope.elem.promotion_buy.product_selected = null;
            $scope.elem.promotion.condition_items = [];
          },
          config: function () {
            $scope.$watch('elem.promotion_buy.product_selected', function (value) {
              if (value && value.id) {
                $scope.elem.promotion.condition_items = [{ ...value }];
                $scope.searchBoxParams.session_id = Date.now();
              }
            }, true);
          }
        },

        promotion_get: {
          product_selected: null,
          config: function () {
            $scope.$watch('elem.promotion_get.product_selected', function (value) {
              if (value && value.id) {
                let item = $scope.elem.promotion.promotion_items.find(e => e.id == value.id);
                let product = { ...value };
                product.variants = product.variants.map(variant => {
                  let image = product.images.find(e => e.id == variant.image_id);
                  variant.image = image && image.src ? image.src : null;
                  variant.promotion_type = _CONST.PROMOTION.DISCOUNT_TYPE.PERCENT;
                  return variant;
                });
                if (!item) {
                  $scope.elem.promotion.promotion_items.push(product);
                } else {
                  if (!item.variants.map(e => e.id).includes(value.variants[0].id)) {
                    item.variants = item.variants.concat(value.variants);
                  }
                }
                $scope.searchBoxParams.session_id = Date.now();
              }
            }, true);
          }
        },

        product_groups: {
          group_selected: null,
          reset: function () {
            $scope.group_products = [];
          },
          init: function () {
            $scope.selected_group = {
              type: null,
              in: []
            };
          },
          config: function () {
            $scope.$watch('elem.product_groups.group_selected', function (value) {
              if (value && value.id) {
                $scope.group_products = []
                console.log($scope.group_products);
              }
            }, true);
          },
          valid_check: function (id) {
            if ($scope.selected_group.in.map(e => e.id).includes(id)) { return true; }
            return false;
          },
          valid_check_all: function () {
            if ($scope.selected_group.in.length == $scope.group_products.length) { return true; }
            return false;
          },
          checked: function (type, product) {
            if (type == 'add') {
              $scope.selected_group.in.push(product)
            }
            if (type == 'remove') {
              $scope.selected_group.in = $scope.selected_group.in.filter(e => e.id != product.id);
            }
          },
          checked_all: function () {
            if ($scope.selected_group.in.length == $scope.group_products.length) {
              $scope.selected_group.in = [];
            } else {
              $scope.selected_group.in = $scope.group_products;
            }
          },
          apply_products: function () { // buy/get
            if ($scope.selected_group.type == 'buy') {
              $scope.elem.promotion.condition_items = [...$scope.selected_group.in].map(item => {
                item.promotion_type = _CONST.PROMOTION.DISCOUNT_TYPE.PERCENT;
                return item;
              });
            }
            if ($scope.selected_group.type == 'get') {
              $scope.elem.promotion.promotion_items = [...$scope.selected_group.in].map(item => {
                item.promotion_type = _CONST.PROMOTION.DISCOUNT_TYPE.PERCENT;
                return item;
              });
            }
            $scope.elem.modal.close();
          }
        },

        load_data: {
          init: function () {
            $scope.source_names = _CONST.SOURCE_NAMES;
            $scope.customer_groups = [];
            CustomerGroup.query(function (data) {
              $scope.customer_groups = data.customer_groups || [];
            })
            $scope.locations = [];
            Location.query(function (data) {
              $scope.locations = data.locations || [];
            })
            $scope.promotion_types = [
              { value: _CONST.PROMOTION.DISCOUNT_TYPE.PERCENT, name: '% Giảm' },
              { value: _CONST.PROMOTION.DISCOUNT_TYPE.GIFT, name: 'Tặng' },
              { value: _CONST.PROMOTION.DISCOUNT_TYPE.MONEY, name: 'VNĐ' }
            ]
          },
          config: function () {
            $scope.$watch('promotion_customer_groups', function (items) {
              if (items) {
                if (!items.length) { return $scope.elem.promotion.customer_groups = null; }
                let _items = items.map(e => {
                  return $scope.customer_groups.find(customer_group => customer_group.id == e.id);
                });
                $scope.elem.promotion.customer_groups = _items;
              }
            });
            $scope.$watch('promotion_source_names', function (items) {
              if (items) {
                if (!items.length) { return $scope.elem.promotion.source_names = null; }
                let _items = items.map(e => {
                  return $scope.source_names.find(source_name => source_name.code == e.code);
                });
                $scope.elem.promotion.source_names = _items;
              }
            });
            $scope.$watch('promotion_locations', function (items) {
              if (items) {
                if (!items.length) { return $scope.elem.promotion.locations = null; }
                let _items = items.map(e => {
                  return $scope.locations.find(location => location.id == e.id);
                });
                $scope.elem.promotion.locations = _items;
              }
            });
            $scope.changeVariantTaskType = function (variant) {
              if (variant && variant.promotion_type == _CONST.PROMOTION.DISCOUNT_TYPE.GIFT) {
                variant.promotion_value = null;
              }
            }
            $scope.changeIsExpired = function () {
              $scope.elem.promotion.end_date = null;
            }
          }
        },

        modal: {
          init: function () {
            $scope.isShowProductGroup = false;
          },
          show: function (modal) {
            $scope[modal] = true;
          },
          close: function () {
            $scope.isShowProductGroup = false;
          }
        },

        product: {
          config: function () {
            $scope.searchBoxParams = { limit: 10, reload: true };
          }
        }
      }

      common.mcm.invoke($scope.elem, 'reset');
      common.mcm.invoke($scope.elem, 'init');
      common.mcm.invoke($scope.elem, 'config');
    }])