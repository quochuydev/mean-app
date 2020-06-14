(function () {

  const Module = {
    name: 'PromotionTemplate',
    version: '1.0',
    dependencies: {
      _: { name: 'lodash' },
    },
    factory: function (di) {
      const PromotionTemplate = {
        // INPUT:
        // {
        //   "promotion_items": [
        //     {
        //       "variant_name": "v2 || v21 || v21",
        //       "has_group_promotion": true,
        //       "promotion_type": 2,
        //       "_promotion_type": "giảm",
        //       "promotion_value": "21",
        //       "_promotion_value": "21%",
        //       "quantity_apply": 12
        //     },
        //     {
        //       "variant_name": "v1 || v11 || v11",
        //       "has_group_promotion": true,
        //       "_has_group_promotion": " hoặc ",
        //       "promotion_type": 3,
        //       "_promotion_type": "tặng",
        //       "promotion_value": "",
        //       "_promotion_value": "",
        //       "quantity_apply": 2
        //     },
        //     {
        //       "variant_name": "v1 || v12 || v12",
        //       "has_group_promotion": true,
        //       "_has_group_promotion": " hoặc ",
        //       "promotion_type": 1,
        //       "_promotion_type": "giảm",
        //       "promotion_value": "5000000",
        //       "_promotion_value": "5,000,000đ",
        //       "quantity_apply": 3
        //     }
        //   ],
        //   "condition_items": [
        //     {
        //       "variant_name": "v1 || v11 || v11",
        //       "quantity": 2
        //     }
        //   ]
        // }

        // OUTPUT:
        // Mua 2 v1 || v11 || v11 
        // giảm 21% khi mua 12 v2 || v21 || v21 
        // hoặc tặng 2 v1 || v11 || v11 
        // hoặc giảm 5,000,000đ khi mua 3 v1 || v12 || v12

        BuyX_GetY: function ({ promotion_items, condition_items }) {
          let template = `
            <span class="text-gray">Mua</span>
            <% _.forEach(condition_items, function(variant) { %>
            <%- variant.quantity %> <%- variant.variant_name %>
            <% }) %>
            <% _.forEach(promotion_items, function(variant) { %>
            <%- variant._has_group_promotion %>
            <span class="text-gray"><%- variant._promotion_type %></span> 
            <%- variant._promotion_value %>
            <% if(variant.promotion_type != 3){ %> khi mua <% } %>
            <%- variant.quantity_apply %> 
            <%- variant.variant_name %>
            <% }) %>
          `;
          return PromotionTemplate._complied(template, { promotion_items, condition_items });
        },

        _complied: function (template, obj) {
          let compiled = _.template(template);
          return compiled(obj);
        }
      }

      return PromotionTemplate;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di._ = require('lodash');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();