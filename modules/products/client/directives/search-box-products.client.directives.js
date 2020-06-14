'use strict';

angular.module('core').directive('searchBoxProducts', searchBoxProducts);

searchBoxProducts.$inject = ['Product', 'debounce'];

function searchBoxProducts(Product, debounce) {
  let template = `
  <div class="box-search-advance">
    <div>
      <input class="form-control placeholder-black border-none-radius" placeholder="Tìm sản phẩm" ng-model="searchText"  ng-keypress="searchDebounce($event)" ng-click="suggestionBoxToggle()"/>
    </div>
    <div class="panel panel-default suggestion-box" ng-class="{ 'active' : showSuggestionBox }">
      <div class="panel-body" style="width: 100%">
        <div class="list-search-data">
          <div class="search-loading" ng-class="{ 'hidden' : !searchLoading }">Đang tìm kiếm...</div>
          <ul class="clearfix">
            <li ng-if="products.length == 0 && !searchLoading && !firstLoad" class="row text-center">
              <label class="inline_block">Vui lòng nhập thông tin để tìm kiếm</label>
            </li>
            <li ng-if="products.length == 0 && !searchLoading && firstLoad" class="row text-center">
              <label class="inline_block">Chưa có dữ liệu</label>
            </li>
            <li class="row title-product" ng-repeat="item in products" ng-click="itemSelected(item)">
              <div ng-if="item.images && item.images.length" class="frame-img-32 vertical-align-m inline_block"><img class="format-img-32" ng-src="{{ item.images[0].src }}" /></div>
              <div ng-if="!item.images || (item.images && !item.images.length)" class="img-empty img-empty-bg fa-empty-images vertical-align-m inline_block"> </div> 
              <label class="inline_block ml10">{{ item.title }}</label>
              <div class="clear"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="panel-footer">
        <div class="btn-group pull-right">
          <button type="button" class="btn btn-default" ng-class="{ 'disable': page == 1 }" ng-disabled="page == 1" ng-click="previousPage()">
            <i class="fa fa-chevron-left"></i>
          </button>
          <button type="button" class="btn btn-default" ng-class="{ 'disable': (page >= totalPage) }" ng-disabled="page >= totalPage" ng-click="nextPage()">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>`;

  return {
    template: template,
    restrict: 'E',
    replace: true,
    scope: {
      selectedItem: '=',
      params: '='
    },
    link: function (scope, elem, attrs) {
      var query = function () {
        var params = {
          searchq: scope.searchText,
          page: scope.page,
          limit: scope.params.limit,
          type: 'search'
        };

        _.merge(params, scope.params);

        scope.searchLoading = true;

        Product.getSellerProducts(params, function (data) {
          scope.firstLoad = true;
          scope.searchLoading = false;

          if (!scope.query_at) {
            scope.query_at = data.query_at;
          }
          var isPass = false;
          if (data.query_at && scope.query_at && new Date(scope.query_at).getTime() <= new Date(data.query_at).getTime()) {
            scope.query_at = data.query_at;
            isPass = true;
          }

          if (data && data.total && isPass) {
            scope.totalPage = Math.ceil(data.total / scope.params.limit);
          }

          if (data && data.products && data.products.length && isPass) {
            scope.products = data.products || [];
          }
        }, function (errorResponse) {
          scope.firstLoad = true;
          scope.searchLoading = false;
          console.error(errorResponse);
        });
      };

      scope.searchText = '';
      scope.showSuggestionBox = false;
      scope.searchLoading = false;
      scope.products = [];
      scope.totalPage = 1;
      scope.page = 1;
      scope.firstLoad = false;
      scope.query_at = null;

      scope.searchDebounce = debounce(500, function ($event) {
        scope.search($event);
      }, true);


      scope.search = function ($event) {
        if ($event && $event.keyCode && $event.keyCode != 13) { return false; }
        if ($event && $event.keyCode == 13) { scope.showSuggestionBox = true; }
        scope.page = 1;
        scope.totalPage = 1;
        scope.products = [];
        query();
      };

      scope.suggestionBoxToggle = function () {
        scope.showSuggestionBox = !scope.showSuggestionBox;
        if (!scope.products.length) { scope.searchDebounce(); }
      };

      scope.itemSelected = function (product) {
        scope.showSuggestionBox = false;
        if (product && product.id) {
          scope.searchText = product.title ? product.title : '';
          var productNew = _.cloneDeep(product);
          productNew.id = String(product.id);
          scope.selectedItem = productNew;
        } else {
          scope.selectedItem = null;
        }
      };

      scope.$watch('params.session_id', function (value) {
        if (value) {
          scope.searchText = '';
          scope.selectedItem = null;
          scope.firstLoad = false;
          scope.products = [];
          scope.totalPage = 1;
          scope.page = 1;
        }
      }, true);

      scope.$watch('searchText', function (value) {
        if (!value) {
          scope.searchText = '';
          scope.selectedItem = null;
          scope.products = [];
          scope.totalPage = 1;
          scope.page = 1;
        } else {
          scope.searchText = value;
          scope.showSuggestionBox = true;
          scope.searchDebounce();
        }
      });

      scope.nextPage = function () {
        if (scope.page >= scope.totalPage) { return; }
        scope.page++;
        query();
      };

      scope.previousPage = function () {
        if (scope.page <= 1) { return; }
        scope.page--;
        query();
      };

      $(document).on('click', function (e) {
        if (!$(e.target).parents('.box-search-advance').length) {
          scope.$apply(function () {
            scope.showSuggestionBox = false;
          });
        }
      });
    }
  };
};
