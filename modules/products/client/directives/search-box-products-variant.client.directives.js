'use strict';

angular.module('core').directive('searchBoxProductsVariant', searchBoxProductsVariant)

searchBoxProductsVariant.$inject = ['Product', 'debounce'];

function searchBoxProductsVariant(Product, debounce) {
  let template = `
  <div class="input-addon box-search-advance" ng-class="{ 'border-red' : checkValid }">
    <div class="input-addon_icon" ng-hide="hideIcon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon-svg">
        <path
          d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8m9.707 4.293l-4.82-4.82A5.968 5.968 0 0 0 14 8 6 6 0 0 0 2 8a6 6 0 0 0 6 6 5.968 5.968 0 0 0 3.473-1.113l4.82 4.82a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414">
        </path>
      </svg>
    </div>
    
    <div style="width: 94%">
      <input name="idSearch" id="idSearch" class="form-control placeholder-black border-none-radius" 
        placeholder="{{ placeholder }}" ng-model="searchText" style="border: none;" ng-click="suggestionBoxToggle();" autocomplete="off"/>
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
            <li class="row" ng-repeat="item in products">
              <div ng-if="item.images && item.images.length" class="frame-img-32 vertical-align-m inline_block"><img class="format-img-32" ng-src="{{ item.images[0].src }}" /></div>
              <div ng-if="!item.images || (item.images && !item.images.length)" class="img-empty img-empty-bg fa-empty-images vertical-align-m inline_block"> </div> 
              <label class="inline_block ml10">{{ item.title }}</label>
              <div class="clear"></div>
              <ul>
                <li class="clearfix product-variant" ng-repeat="variant in item.variants"  ng-click="itemSelected(item, variant)">
                  <a class="color_green col-xs-12 p-l-none">
                    <span class="note-order">{{ variant.title }}</span>
                  </a>
                  <div class="col-xs-6 p-l-none">
                    <span ng-if="variant.sku" class="note-order"> {{ variant.sku }}</span>
                    <span ng-if="!variant.sku">---</span>
                  </div>
                  <div class="col-xs-6 p-l-none">
                    <span ng-if="variant.price" class="note-order"> {{ variant.price | formatMoney }}đ</span>
                    <span ng-if="!variant.price">---</span>
                  </div>
                </li>
              </ul>
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
  </div>
  `;

  return {
    template: template,
    restrict: 'E',
    replace: true,
    scope: {
      selectedItem: '=',
      params: '=',
      placeholder: '@',
      checkValid: '=',
      hideIcon: '=?',
    },
    link: function (scope, elem, attrs) {
      scope.placeholder = scope.placeholder || 'Tìm sản phẩm';

      var query = function () {
        var searchNew = formatDataSearch(scope.searchText);
        var params = {
          searchq: searchNew.searchq,
          title_product: searchNew.title_product,
          title_variant: searchNew.title_variant,
          sku: searchNew.sku,
          page: scope.page,
          limit: scope.params.limit
        };
        _.merge(params, scope.params);

        scope.searchLoading = true;

        Product.getSellerProducts(params, function (data) {
          scope.firstLoad = true;
          scope.searchLoading = false;

          if (!scope.query_at) { scope.query_at = data.query_at; }

          var isPass = false;
          if (data.query_at && scope.query_at && new Date(scope.query_at).getTime() <= new Date(data.query_at).getTime()) {
            scope.query_at = data.query_at;
            isPass = true;
            if (data && data.total) {
              scope.totalPage = Math.ceil(data.total / scope.params.limit);
            }
          }

          if (data && data.products && data.products.length && isPass) {
            data.products = filterVariant(data.products, data.searchq, data.title_product, data.title_variant, data.sku);
            scope.products = data.products || [];
          }
        }, function (errorResponse) {
          scope.firstLoad = true;
          scope.searchLoading = false;
          console.error(errorResponse);
        });
      };

      function formatDataSearch(searchText) {
        if (searchText && searchText.trim() != '') {
          searchText = searchText.replace(/\s\s+/g, ' ');
          var arrSearch = searchText.trim();
          var title_product = null;
          var title_variant = null;
          var sku = null;
          arrSearch = arrSearch.split('||');
          if (searchText.indexOf('||') != -1 && arrSearch && arrSearch.length && arrSearch.length > 0) {
            for (var i = 0; i < arrSearch.length; i++) {
              if (i == 0) {
                if (arrSearch[i].trim() != '') {
                  title_product = '';
                  title_product = arrSearch[i].trim();
                  title_product = title_product.replace(/\s\s+/g, ' ');
                }
              } else if (i == 1) {
                if (arrSearch[i].trim() != '') {
                  title_variant = '';
                  title_variant = arrSearch[i].trim();
                  title_variant = title_variant.replace(/\s\s+/g, ' ');
                }
              } else if (i == 2) {
                if (arrSearch[i].trim() != '') {
                  sku = '';
                  sku = arrSearch[i].trim();
                  sku = sku.replace(/\s\s+/g, ' ');
                }
              }
            }
          }
          return {
            searchq: searchText,
            title_product: title_product,
            title_variant: title_variant,
            sku: sku
          };
        } else {
          return {
            searchq: searchText,
            title_product: null,
            title_variant: null,
            sku: null
          };
        }
      }

      function filterVariant(products, searchq, title_product, title_variant, sku) {
        var variantsNew = [];
        var listProductNew = [];

        if (title_product || title_variant || sku) {
          var is_title_product = false;
          var is_title_variant = false;
          var is_sku = false;
          var countFilter = 0;
          var countFilterTemp = 0;
          if (title_product && title_product.trim() != "") {
            is_title_product = true;
            countFilter = countFilter + 1;
          }
          if (title_variant && title_variant.trim() != "") {
            is_title_variant = true;
            countFilter = countFilter + 1;
          }
          if (sku && sku.trim() != "") {
            is_sku = true;
            countFilter = countFilter + 1;
          }
          for (var i = 0; i < products.length; i++) {
            if (products[i].variants && products[i].variants.length) {
              variantsNew = [];
              for (var j = 0; j < products[i].variants.length; j++) {
                countFilterTemp = _.cloneDeep(countFilter);
                if (is_title_product && products[i].variants[j].title.indexOf(title_product) != -1) {
                  countFilterTemp = countFilterTemp - 1;
                }
                if (is_title_variant && products[i].variants[j].title.indexOf(title_variant) != -1) {
                  countFilterTemp = countFilterTemp - 1;
                }
                if (is_sku && products[i].variants[j].sku && products[i].variants[j].sku.indexOf(sku) != -1) {
                  countFilterTemp = countFilterTemp - 1;
                }
                variantsNew.push(products[i].variants[j]);
              }
              products[i].variants = variantsNew;
              if (products[i].variants && products[i].variants.length) {
                listProductNew.push(products[i]);
              }
            }
          }
          return listProductNew;
        } else {
          if (searchq && searchq.trim() == "") {
            return products;
          } else {
            for (var i = 0; i < products.length; i++) {
              if (products[i].variants && products[i].variants.length) {
                variantsNew = [];
                for (var j = 0; j < products[i].variants.length; j++) {
                  variantsNew.push(products[i].variants[j]);
                }
                products[i].variants = [];
                products[i].variants = variantsNew;
              }
              if (products[i].variants && products[i].variants.length) {
                listProductNew.push(products[i]);
              }
            }
            return listProductNew;
          }
        }
      }

      scope.searchText = '';
      scope.showSuggestionBox = false;
      scope.searchLoading = false;
      scope.products = [];
      scope.totalPage = 1;
      scope.page = 1;
      scope.firstLoad = false;
      scope.query_at = null;

      scope.searchDebounce = debounce(500, function () {
        scope.search();
      }, true);

      scope.search = function () {
        scope.page = 1;
        scope.totalPage = 1;
        scope.products = [];
        query();
      };

      scope.suggestionBoxToggle = function () {
        scope.showSuggestionBox = !scope.showSuggestionBox;
        if (!(scope.products && scope.products.length)) { scope.searchDebounce(); }
      };

      scope.itemSelected = function (product, variant) {
        scope.showSuggestionBox = false;
        var productNew = _.cloneDeep(product);
        var variantNew = _.cloneDeep(variant);
        productNew.variants = [];
        if (variantNew && variantNew.id) {
          variantNew.id = String(variantNew.id);
          productNew.variants.push(variantNew);
        }
        if (productNew && productNew.id) {
          scope.searchText = product.title ? product.title : '';
          scope.searchText += (variantNew && variantNew.title ? (' || ' + variantNew.title) : '');
          scope.searchText += (variantNew && variantNew.sku ? (' || ' + variantNew.sku) : '');
          productNew.id = String(productNew.id);
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
}