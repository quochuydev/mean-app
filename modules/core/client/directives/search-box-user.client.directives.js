'use strict';

angular.module('core').directive('searchBoxUser', function($timeout, Admin) {

  var template="";
  template += "<div class=\"box-search-advance\">";
  template += "  <div>";
  template += "    <input class=\"form-control placeholder-black border-none-radius\" placeholder=\"{{ placeholder }}\" ng-model=\"searchText\" ng-change=\"search()\" ng-click=\"suggestionBoxToggle()\"\/>";
  template += "  <\/div>";
  template += "  <div class=\"panel panel-default suggestion-box\" ng-class=\"{ 'active' : showSuggestionBox }\">";
  template += "    <div class=\"panel-body\" style=\"width: 100%\">";
  template += "      <div class=\"list-search-data\">";
  template += "        <div class=\"search-loading\" ng-class=\"{ 'hidden' : !searchLoading }\">Đang tìm kiếm...<\/div>";
  template += "        <ul class=\"clearfix\">";
  template += "          <li ng-if=\"data.length == 0\" class=\"row\">";
  template += "            <label class=\"inline_block\">Chưa có dữ liệu<\/label>";
  template += "          </li>";
  template += "          <li class=\"row\" ng-repeat=\"item in data\" ng-click=\"itemSelected(item)\">";
  template += "            Tên: <label class=\"inline_block\" ng-bind=\"item[titleProp]\"><\/label>";
  template += "            <div class=\"clear\"><\/div>";
  template += "            Email: <span ng-bind=\"item[subtitleProp]\"></span>";
  template += "            <div class=\"clear\"><\/div>";
  template += "          <\/li>";
  template += "        <\/ul>";
  template += "      <\/div>";
  template += "    <\/div>";
  template += "    <div class=\"panel-footer\">";
  template += "      <div class=\"btn-group pull-right\">";
  template += "        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'disable': page == 1 }\" ng-disabled=\"page == 1\" ng-click=\"previousPage()\">";
  template += "          <i class=\"fa fa-chevron-left\"><\/i>";
  template += "        <\/button>";
  template += "        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{ 'disable': (page >= totalPage) }\" ng-disabled=\"page >= totalPage\" ng-click=\"nextPage()\">";
  template += "          <i class=\"fa fa-chevron-right\"><\/i>";
  template += "        <\/button>";
  template += "      <\/div>";
  template += "      <div class=\"clear\"><\/div>";
  template += "    <\/div>";
  template += "  <\/div>";
  template += "<\/div>";
  template += "<!-- \/ .box-search-advance.collection -->";

  return {
    template: template,
    restrict: 'E',
    replace: true,
    scope: {
      selectedItem: '=',
      searchText: '=',
      params: '=',
      reload: '='
    },
    link: function(scope, elem, attrs) {
      var resource = null;
      var suggestionBoxTimeout = null;

      var query = function() {
        if(!scope.isSearch){
          scope.searchText = '';
        }
        var params = {
          q: scope.searchText,
          page: scope.page
        };

        _.merge(params, scope.params);

        scope.searchLoading = true;

        resource.query(params, function(data) {
          scope.searchLoading = false;

          if(data && data[attrs.resourceKey] && data[attrs.resourceKey].length) {
            scope.data = data[attrs.resourceKey] || [];
            scope.totalPage = Math.ceil(data.total / scope.params.limit);
          }
        }, function(errorResponse) {
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
      scope.sub2titleProp = attrs.sub2titleProp;
      scope.data = [];
      scope.totalPage = 1;
      scope.page = 1;
      scope.isSearch = false;

      if(!attrs.resource) {
        return console.error('Resource not available');
      }

      if(!attrs.resourceKey) {
        return console.error('Resource key not available');
      }

      if(!attrs.titleProp || !attrs.subtitleProp) {
        console.warn('Title/Subtitle prop shouldn\'t blank');
      }

      switch (attrs.resource) {
        case 'Admin':
          resource = Admin;
          break;

        default:
          return console.error('Resource not valid');
      }

      query(); // First load

      scope.search = function() {
        scope.page = 1;
        scope.totalPage = 1;
        scope.data = [];
        scope.isSearch = true;
        query();
      };

      scope.suggestionBoxToggle = function() {
        scope.showSuggestionBox = true;
      };

      scope.itemSelected = function(item) {
        scope.showSuggestionBox = false;
        scope.selectedItem = item;
        scope.isSearch = false;
      };

      scope.nextPage = function() {
        if(scope.page >= scope.totalPage) {
          return;
        }

        scope.page++;

        query();
      };

      scope.previousPage = function() {
        if(scope.page <= 1) {
          return;
        }

        scope.page--;

        query();
      };

      scope.$watch('reload', function(value) {
        if(value) {
          scope.page = 1;
          scope.totalPage = 1;
          scope.data = [];

          query();
        }
      });

      $(document).on('click', function(e) {
        if(!$(e.target).parents('.box-search-advance').length) {
          scope.$apply(function() {
            // scope.data = [];
            // query();
            scope.showSuggestionBox = false;
          });
        }
      });

      // Auto close box
      $('.suggestion-box').on('mouseenter', function() {
        $timeout.cancel(suggestionBoxTimeout);
      }).on('mouseleave', function() {
        suggestionBoxTimeout = $timeout(function() {
          scope.showSuggestionBox = false;
        }, 2500);
      });

    }
  };

});
