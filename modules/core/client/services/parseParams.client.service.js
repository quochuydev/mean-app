'use strict';

angular
    .module('core')
    .factory('ParseParams', ParseParams);

ParseParams.$inject = [
    '$window'
];

function ParseParams($window) {
    return {
        params: params
    };



    function params(query) {
        var re = /([^&=]+)=?([^&]*)/g;
        var decodeRE = /\+/g;
        var decode = function (str) {
            return decodeURIComponent(str.replace(decodeRE, " ") );
        };
        var params = {}, e;
        while ( e = re.exec(query) ) {
            var k = decode( e[1] ), v = decode( e[2] );
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            }
            else params[k] = v;
        }
        return params;
    }
}
