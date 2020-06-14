'use strict';

angular.module('core').directive('searchBox', function ($timeout, Product) {

  let template = `
  <div class="box-search-advance">
    <div>
      <input class="form-control placeholder-black border-none-radius" placeholder="{{ placeholder }}" ng-model="searchText" ng-change="search()" ng-click="suggestionBoxToggle()"/>
    </div>
    <div class="panel panel-default suggestion-box" ng-class="{ 'active' : showSuggestionBox }">
      <div class="panel-body" style="width: 100%">
        <div class="list-search-data">
          <div class="search-loading" ng-class="{ 'hidden' : !searchLoading }">Đang tìm kiếm...</div>
          <ul class="clearfix">
            <li ng-if="data.length == 0" class="row">
              <label class="inline_block">Chưa có dữ liệu</label>
            </li>
            <li ng-if="!multiple && !tick" class="row" ng-repeat="item in data" ng-click="itemSelected(item)">
              <label class="inline_block" ng-bind="item[titleProp]"></label>
              <div class="clear"></div>
              <span ng-bind="item[subtitleProp]"></span>
            </li>
            <li ng-if="multiple" class="row checked-item" ng-repeat="item in data" ng-click="itemSelected(item)">
              <label class="inline_block" ng-bind="item[titleProp]"></label>
              <div class="clear"></div>
              <span ng-bind="item[subtitleProp]"></span>
              <i class="fa fa-plus" title="Thêm"></i>
            </li>
            <li ng-if="tick" class="row checked-item" ng-repeat="item in data" ng-click="itemSelected(item)">
              <label class="inline_block" ng-bind="item[titleProp]"></label>
              <div class="clear"></div>
              <span ng-bind="item[subtitleProp]"></span>
              <i ng-if="item.checked" class="fa fa-check"></i>
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
  </div>
`;

  return {
    template: template,
    restrict: 'E',
    replace: true,
    scope: {
      selectedItem: '=',
      searchText: '=',
      params: '=',
      reload: '=',
      keyField: '@'
    },
    link: function (scope, elem, attrs) {
      var resource = null;
      var suggestionBoxTimeout = null;

      var query = function () {
        var params = { limit: 10 };

        _.merge(params, scope.params);
        params.q = scope.searchText;
        params.page = scope.page;

        scope.searchLoading = true;

        resource[attrs.resourceMethod || 'query'](params, function (data) {
          scope.searchLoading = false;

          if (data && data[attrs.resourceKey] && data[attrs.resourceKey].length) {

            scope.data = data[attrs.resourceKey] || [];
            scope.totalPage = Math.ceil(data.total / params.limit);
          }
        }, function (errorResponse) {
          scope.searchLoading = false;
          console.error(errorResponse);
        });
      };

      scope.searchText = '';
      scope.showSuggestionBox = false;
      scope.searchLoading = false;
      scope.placeholder = attrs.placeholder;
      scope.titleProp = attrs.titleProp;
      scope.subtitleProp = attrs.subtitleProp;
      scope.multiple = attrs.boxType ? attrs.boxType == 'multiple' : false;
      scope.tick = attrs.boxType ? attrs.boxType == 'ticked' : false;
      scope.data = [];
      scope.totalPage = 1;
      scope.page = 1;
      if (!scope.keyField) scope.keyField = 'id';

      if (!attrs.resource) {
        return console.error('Resource not available');
      }

      if (!attrs.resourceKey) {
        return console.error('Resource key not available');
      }

      if (!attrs.titleProp || !attrs.subtitleProp) {
        console.warn('Title/Subtitle prop shouldn\'t blank');
      }

      switch (attrs.resource) {
        case 'Product':
          resource = Product;
          break;
        default:
          return console.error('Resource not valid');
      }

      query(); // First load

      scope.search = function () {
        scope.page = 1;
        scope.totalPage = 1;
        scope.data = [];

        query();
      };

      scope.suggestionBoxToggle = function () {
        scope.showSuggestionBox = true;
        query();
      };

      scope.itemSelected = function (item) {
        if (scope.multiple) {
          scope.selectedItem = scope.selectedItem || [];

          if (!_checkIfItemExist(item)) {
            scope.selectedItem.unshift(item);
          }
        } else if (scope.tick) {
          scope.selectedItem = scope.selectedItem || [];

          item.checked = item.checked !== undefined && item.checked !== null ? !item.checked : true;

          if (item.checked) {
            if (!_checkIfItemExist(item)) {
              scope.selectedItem.push(item);
            }
          } else {
            _findAndRemoveItem(item);
          }
        } else {
          scope.showSuggestionBox = false;
          scope.selectedItem = item;
        }
      };

      scope.nextPage = function () {
        if (scope.page >= scope.totalPage) {
          return;
        }

        scope.page++;

        query();
      };

      scope.previousPage = function () {
        if (scope.page <= 1) {
          return;
        }

        scope.page--;

        query();
      };

      scope.$watch('selectedItem', function (items) {
        if (scope.tick) {
          if (!items || (items && _.isArray(items) && !items.length)) {
            scope.data.forEach(function (item) {
              item.checked = false;
            });
          }
        }
      }, true);

      scope.$watch('reload', function (value) {
        if (value) {
          scope.page = 1;
          scope.totalPage = 1;
          scope.data = [];

          query();
        }
      });

      function _checkIfItemExist(checkedItem) {
        for (var i = 0; i < scope.selectedItem.length; i++) {
          var item = scope.selectedItem[i];
          debugger
          if (item[scope.keyField] == checkedItem[scope.keyField]) {
            return true;
          }
        }

        return false;
      }

      function _findAndRemoveItem(deletedItem) {
        for (var i = 0; i < scope.selectedItem.length; i++) {
          var item = scope.selectedItem[i];

          if (item.id == deletedItem.id) {
            scope.selectedItem.splice(i, 1);
          }
        }
      }

      $(document).on('click', function (e) {
        if (!$(e.target).parents('.box-search-advance').length) {
          scope.$apply(function () {
            scope.showSuggestionBox = false;
          });
        }
      });

      // Auto close box
      $('.suggestion-box').on('mouseenter', function () {
        $timeout.cancel(suggestionBoxTimeout);
      }).on('mouseleave', function () {
        suggestionBoxTimeout = $timeout(function () {
          scope.showSuggestionBox = false;
        }, 2500);
      });

    }
  };

});
