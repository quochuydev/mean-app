(function () {

  const Module = {
    name: 'PromotionUtil',
    version: '1.0',
    dependencies: {
      _do: { name: '_do' },
      _CONST: { name: '_CONST' },
      PromotionTemplate: { name: 'PromotionTemplate' }
    },
    factory: function (di) {
      const PromotionUtil = {
        mappingServer: function (promotion_client) {
          const found_promotion_mapping = PromotionUtil.ListPromotionMappings.find(item => item.matchClientModel({ promotion_client }));

          if (!found_promotion_mapping) {
            throw new Error('ERR_PROMOTION_MAPPING_NOT_FOUND : ', JSON.stringify(promotion_client));
          }

          return found_promotion_mapping.mapToServerModel({ promotion_client });
        },
        renderClient: function (promotion_server) {
          const found_promotion_mapping = PromotionUtil.ListPromotionMappings.find(item => item.matchServerModel({ promotion_server }));

          if (!found_promotion_mapping) {
            throw new Error('ERR_PROMOTION_MAPPING_NOT_FOUND : ', JSON.stringify(promotion_server));
          }

          return found_promotion_mapping.mapToClientModel({ promotion_server });
        },
        conditionVariants: function (promotion_client) {
          let items = [];
          for (let i = 0; i < promotion_client.condition_items.length; i++) {
            const item = promotion_client.condition_items[i];
            for (let j = 0; j < item.variants.length; j++) {
              const variant = item.variants[j];
              let variant_name = _do.joinS([item.product_name, variant.variant_title, variant.variant_sku], ' || ');
              items.push({ variant_name, quantity: variant.rule[0].quantity });
            }
          }
          return items;
        },
        promotionVariants: function (promotion_client) {
          let items = [];
          let { has_group_promotion, promotion_items } = promotion_client;
          for (let i = 0; i < promotion_items.length; i++) {
            const item = promotion_items[i];
            for (let j = 0; j < item.variants.length; j++) {
              let _has_group_promotion = undefined; // data => '', 'và', 'hoặc'
              if (j > 0 || i > 0) { _has_group_promotion = ` ${PromotionUtil._HAS_GROUP(has_group_promotion)} `; }
              const variant = item.variants[j];
              let variant_name = _do.joinS([item.product_name, variant.variant_title, variant.variant_sku], ' || ');
              let { promotion_type, promotion_value, quantity_apply } = variant.rule[0];
              let _promotion_type = PromotionUtil._DISCOUNT_TYPE(promotion_type);
              let _promotion_value = PromotionUtil._PROMOTION_VALUE(promotion_value, promotion_type, undefined);
              items.push({ variant_name, has_group_promotion, _has_group_promotion, promotion_type, _promotion_type, promotion_value, _promotion_value, quantity_apply });
            }
          }
          return items;
        },
        makeDataDescription: (promotion_client) => {
          let data_description = { condition_items: [], promotion_items: [] };
          data_description.condition_items = PromotionUtil.conditionVariants(promotion_client);
          data_description.promotion_items = PromotionUtil.promotionVariants(promotion_client);
          return data_description;
        },
        parseDescription: function (promotion, objData) {
          let description = '';
          if (promotion.type == _CONST.PROMOTION.TYPE.BUYX_GETY) {
            let { promotion_items, condition_items } = objData;
            description = PromotionTemplate.BuyX_GetY({ promotion_items, condition_items });
          }
          promotion.description = description;
          return promotion;
        },
        _TYPE: (value) => {
          let types = _CONST.PROMOTION._TYPES;
          let type = types.find(e => e.value == value);
          return type ? type.name : null;
        },
        _HAS_GROUP: (has_group) => {
          return _CONST.PROMOTION.HAS_GROUP.OR == has_group ? 'hoặc' : 'và';
        },
        _DISCOUNT_TYPE: (promotion_type, text_gift = 'tặng', text_discount = 'giảm') => {
          return _CONST.PROMOTION.DISCOUNT_TYPE.GIFT == promotion_type ? text_gift : text_discount;
        },
        _DISCOUNT_TYPE_DETAIL: (promotion_type, { text_gift = 'Tặng', text_percent = '% Giảm', text_money = 'VNĐ' } = {}) => {
          if (_CONST.PROMOTION.DISCOUNT_TYPE.GIFT == promotion_type) { return text_gift; }
          if (_CONST.PROMOTION.DISCOUNT_TYPE.MONEY == promotion_type) { return text_money; }
          if (_CONST.PROMOTION.DISCOUNT_TYPE.PERCENT == promotion_type) { return text_percent; }
          return '';
        },
        _SHOW_PROMOTION_VALUE: (promotion_value, promotion_type) => {
          return _CONST.PROMOTION.DISCOUNT_TYPE.GIFT != promotion_type && promotion_value;
        },
        _PROMOTION_VALUE: (promotion_value, promotion_type, block = '', is_format = true) => {
          let is_show = PromotionUtil._SHOW_PROMOTION_VALUE(promotion_value, promotion_type);
          let _promotion_value = is_show ? promotion_value : block;
          if (is_format && is_show) {
            if (_CONST.PROMOTION.DISCOUNT_TYPE.MONEY == promotion_type) { _promotion_value = `${_do.formatMoney(_promotion_value)}đ`; }
            if (_CONST.PROMOTION.DISCOUNT_TYPE.PERCENT == promotion_type) { _promotion_value = `${_promotion_value}%`; }
          }
          return _promotion_value;
        },
        getItemKey({ item, one_variant = false }) {
          const { _CONST } = di;
          const key = { name: null, value: null, values: null };

          if (item.apply_resource === _CONST.PROMOTION.APPLY_RESOURCE.PRODUCT) {
            key.name = 'product_id';
            key.value = item.product_id;
          }
          else if (item.apply_resource === _CONST.PROMOTION.APPLY_RESOURCE.VARIANT) {
            key.name = 'variant_id';
            if (one_variant) {
              key.value = item.variants[0].variant_id;
            }
            else {
              key.values = item.variants.map(variant => variant.variant_id);
            }
          }

          return key;
        }
      };

      const PromotionMappings = {
        'CASE.?': {
          case: 'CASE.?',
          matchClientModel: ({ promotion_client }) => {
            let result = false;

            ///...

            return result;
          },
          mapToServerModel: ({ promotion_client }) => {
            const promotion_server = null;

            //... 

            return promotion_server;
          },
          matchServerModel: ({ promotion_server }) => {
            let result = false;

            ///...

            return result;
          },
          mapToClientModel: ({ promotion_server }) => {
            const promotion_client = null;

            //... 

            return promotion_client;
          },
        },
        'BUYX_GETY.ZV03': {
          case: 'BUYX_GETY.ZV03',
          matchClientModel: ({ promotion_client }) => {
            let result = true;

            ///...

            return result;
          },
          mapToServerModel: ({ promotion_client }) => {
            let promotion_server = {
              ...promotion_client,
              has_group: _CONST.PROMOTION.HAS_GROUP.OR,
              has_group_promotion: _CONST.PROMOTION.HAS_GROUP.OR,
              promotion_products: [],
              product_buy_ids: [],
              variant_buy_ids: []
            };
            if (promotion_server.not_expired) {
              promotion_server.end_date = null;
            }

            for (let i = 0; i < promotion_client.condition_items.length; i++) {
              let _item = promotion_client.condition_items[i];
              promotion_server.product_buy_ids.push(Number(_item.id));
              let apply_item = {
                apply_resource: _CONST.PROMOTION.APPLY_RESOURCE.VARIANT,
                is_main: _CONST.PROMOTION.IS_MAIN.TRUE,
                product_id: _item.id,
                product_name: _item.title,
                product_image: _item.images[0] ? _item.images[0].src : null,
                variants: _item.variants.map(variant => {
                  promotion_server.variant_buy_ids.push(Number(variant.id));
                  variant.variant_id = variant.id;
                  variant.variant_title = variant.title;
                  variant.variant_sku = variant.sku;
                  variant.variant_barcode = variant.barcode;
                  variant.rule = [{
                    quantity: promotion_client.condition_quantity
                  }];
                  return variant;
                })
              };
              promotion_server.promotion_products.push(apply_item);
            }

            for (let i = 0; i < promotion_client.promotion_items.length; i++) {
              let _item = promotion_client.promotion_items[i];
              let apply_item = {
                apply_resource: _CONST.PROMOTION.APPLY_RESOURCE.VARIANT,
                is_main: _CONST.PROMOTION.IS_MAIN.FALSE,
                product_id: _item.id,
                product_name: _item.title,
                product_image: _item.images[0] ? _item.images[0].src : null,
                variants: _item.variants.map(variant => {
                  variant.variant_id = variant.id;
                  variant.variant_title = variant.title;
                  variant.variant_sku = variant.sku;
                  variant.variant_barcode = variant.barcode;
                  variant.rule = [{
                    promotion_type: variant.promotion_type,
                    quantity_apply: variant.quantity_apply,
                    promotion_value: variant.promotion_value
                  }];
                  return variant;
                })
              };
              promotion_server.promotion_products.push(apply_item);
            }

            return promotion_server;
          },
          matchServerModel: ({ promotion_server }) => {
            let result = true;

            ///...

            return result;
          },
          mapToClientModel: ({ promotion_server }) => {
            let promotion_client = { ...promotion_server, condition_items: [], promotion_items: [] };
            for (let i = 0; i < promotion_server.promotion_products.length; i++) {
              const promotion_product = promotion_server.promotion_products[i];
              if (promotion_product.is_main) {
                promotion_client.condition_items.push(promotion_product);
              }
              else {
                promotion_client.promotion_items.push(promotion_product);
              }
            }
            promotion_client.condition_quantity = promotion_client.condition_items[0].variants[0].rule[0].quantity;
            return promotion_client;
          }
        }
      }

      const ListPromotionMappings = [PromotionMappings["CASE.?"], PromotionMappings["BUYX_GETY.ZV03"]];

      PromotionUtil.PromotionMappings = PromotionMappings;
      PromotionUtil.ListPromotionMappings = ListPromotionMappings;

      return PromotionUtil;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di._do = require('./_do.lib.share.js');
    di._CONST = require('./_CONST.lib.share.js');
    di.PromotionTemplate = require('./PromotionTemplate.lib.share.js');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();