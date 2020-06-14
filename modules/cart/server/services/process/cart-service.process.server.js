'use strict';

function ProcessCartFactory(DI) {
  
  const ProcessCart = {};

  DI.ProcessCart = ProcessCart;

  ProcessCart.PROPERTY_PREFIX = '[PE] ';
  ProcessCart.ATTRIBUTE_PREFIX = '[PE] ';
  ProcessCart.PROCESSING_DATA_KEY = 'CART_PROCESSING_DATA';
  ProcessCart.LineKey = LineKeyFactory(DI);
  ProcessCart.ProcessingData = ProcessingDataFactory(DI);
  ProcessCart.changeLineQuantity = ChangeLineQuantityFactory(DI);
  ProcessCart.changeLineQuantity = ChangeLineQuantityFactory(DI);
  ProcessCart.changeLinePrice = ChangeLinePriceFactory(DI);
  ProcessCart.setLineProperty = SetLinePropertyFactory(DI);
  ProcessCart.setLinePromotionRef = SetLinePromotionRefFactory(DI);
  ProcessCart.setLinePromotionBuyProductId = SetLinePromotionBuyProductIdFactory(DI);
  ProcessCart.removeLineId = RemoveLineIdFactory(DI);
  ProcessCart.setAttribute = SetAttributeFactory(DI);
  ProcessCart.splitLine = SplitLineFactory(DI);
  ProcessCart.mapLines = MapLinesFactory(DI);
  ProcessCart.addProcessingData = AddProcessingDataFactory(DI);
  ProcessCart.isSameLines = IsSameLinesFactory(DI);
  ProcessCart.mergeLines = MergeLinesFactory(DI);
  ProcessCart.mergeSameLines = MergeSameLinesFactory(DI);
  ProcessCart.removeProcessingData = RemoveProcessingDataFactory(DI);
  ProcessCart.clearPromotionData = ClearPromotionDataFactory(DI);
  ProcessCart.applyLinePromotion = ApplyLinePromotionFactory(DI);

  return ProcessCart;
}

function ApplyLinePromotionFactory({ CartUtils, _CONST, ProcessCart }) {
  return function applyLinePromotion({ context, the_case, line, type, value }) {
    if (type === _CONST.PROMOTION.DISCOUNT_TYPE.GIFT) {
      ProcessCart.changeLinePrice({ context, the_case, line, new_price: 0 });
    }
    if (type === _CONST.PROMOTION.DISCOUNT_TYPE.MONEY) {
      ProcessCart.changeLinePrice({ context, the_case, line, new_price: Math.max(line.price - Number(value), 0) });
    }
    if (type === _CONST.PROMOTION.DISCOUNT_TYPE.PERCENT) {
      const price_sale = ProcessCart.ProcessingData.Line.get({ line: line, key: 'price_sale' });

      ProcessCart.changeLinePrice({ context, the_case, line, new_price: Math.max(line.price - (price_sale * Number(value)) / 100, 0) });
    }
    if (type === _CONST.PROMOTION.DISCOUNT_TYPE.FIX_AMOUNT) {
      ProcessCart.changeLinePrice({ context, the_case, line, new_price: Number(value) });
    }
    CartUtils.writeLog({ context, the_case, activity: 'apply_line_promotion', data: { line: ProcessCart.LineKey.get({ line }), type, value } });
    return line;
  }
}

function ChangeLineQuantityFactory({ CartUtils, ProcessCart }) {
  return function changeLineQuantity({ context, the_case, line, new_quantity }) {
    const from = line.quantity;
    line.quantity = new_quantity;
    CartUtils.writeLog({ context, the_case, activity: 'change_line_quantity', data: { line: ProcessCart.LineKey.get({ line }), from, to: new_quantity } });
    return line;
  }
}

function ChangeLinePriceFactory({ CartUtils, ProcessCart }) {
  return function changeLinePrice({ context, the_case, line, new_price }) {
    const from = line.price;
    line.price = new_price;
    CartUtils.writeLog({ context, the_case, activity: 'change_line_price', data: { line: ProcessCart.LineKey.get({ line }), from, to: new_price } });
    return line;
  }
}

function SetLinePropertyFactory({ _to, CartUtils, ProcessCart }) {
  return function setLineProperty({ context, the_case, line, key, value }) {
    key = ProcessCart.PROPERTY_PREFIX + key;
    value = _to.string(value);
    line.properties[key] = value;
    CartUtils.writeLog({ context, the_case, activity: 'set_line_property', data: { line: ProcessCart.LineKey.get({ line }), key, value } });
    return line;
  }
}

function SetLinePromotionRefFactory({ CartUtils, ProcessCart }) {
  return function setLinePromotionRef({ context, the_case, line, value }) {
    line.PromotionRef = value;
    CartUtils.writeLog({ context, the_case, activity: 'set_line_promotion_ref', data: { line: ProcessCart.LineKey.get({ line }), value } });
    return line;
  }
}

function RemoveLineIdFactory({ CartUtils }) {
  return function removeLineId({ context, the_case, line }) {
    line._id = undefined;
    CartUtils.writeLog({ context, the_case, activity: 'remove_line_id' });
    return line;
  }
}

function SetLinePromotionBuyProductIdFactory({ CartUtils, ProcessCart }) {
  return function setLinePromotionBuyProductId({ context, the_case, line, product_id }) {
    line.PromotionByProductId = product_id;
    CartUtils.writeLog({ context, the_case, activity: 'set_line_promotion_by_product_id', data: { line: ProcessCart.LineKey.get({ line }), product_id } });
    return line;
  }
}

function SetAttributeFactory({ CartUtils, _to, ProcessCart }) {
  return function setAttribute({ context, the_case, cart, key, value }) {
    key = ProcessCart.ATTRIBUTE_PREFIX + key;
    value = _to.string(value);
    cart.attributes[key] = value;
    CartUtils.writeLog({ context, the_case, activity: 'set_attribute', data: { key, value } });
    return cart;
  }
}

function SplitLineFactory({ _, CartUtils, ERR, ProcessCart }) {

  return function splitLine({ context, the_case, line, patches }) {
    const result = { new_lines: [] };

    const line_key = ProcessCart.LineKey.get({ line });

    let remain_quantity = line.quantity;

    for (let required_quantity of patches) {
      if (required_quantity > remain_quantity) {
        throw new ERR({ code: 'INVALID_LINE_PATCHES', line, patches });
      }
      const new_line = _.cloneDeep(line);
      new_line.quantity = required_quantity;
      const new_line_key = ProcessCart.LineKey.create({ source_line_key: line_key, index: result.new_lines.length });
      new_line._id = 0;
      ProcessCart.LineKey.set({ line: new_line, key: new_line_key });

      result.new_lines.push(new_line);

      remain_quantity -= required_quantity;
    }

    const new_lines_key = result.new_lines.map(line => ProcessCart.LineKey.get({ line }));
    CartUtils.writeLog({ context, the_case, activity: 'split_line', data: { line: line_key, new_lines: new_lines_key } });

    return result;
  }
}

function MapLinesFactory({ ProcessCart }) {

  return function mapLines({ cart, map = [] }) {
    const result = { new_cart: cart };

    let new_lines = [];

    for (let line of cart.items) {
      if (map.length > 0) {
        const found_line_map = map.find(item => ProcessCart.LineKey.get({ line: item.from }) === ProcessCart.LineKey.get({ line }));

        if (found_line_map) {
          new_lines.push(...found_line_map.to);
          map = map.filter(item => item !== found_line_map);
          continue;
        }
      }
      new_lines.push(line);
    }

    new_lines = new_lines.filter(line => line && typeof line === 'object');

    result.new_cart = { ...cart, items: new_lines };

    return result;
  }
}

function ClearPromotionDataFactory({ ProcessCart }) {

  return function clearPromotionData({ cart }) {
    if (cart.attributes && typeof cart.attributes === 'object') {
      for (let key in cart.attributes) {
        if (key.startsWith(ProcessCart.ATTRIBUTE_PREFIX)) {
          delete cart.attributes[key];
        }
      }
    }
    if (Array.isArray(cart.items) && cart.items.length > 0) {
      for (let item of cart.items) {
        if (item.properties && typeof item.properties === 'object') {
          for (let key in item.properties) {
            if (key.startsWith(ProcessCart.PROPERTY_PREFIX)) {
              delete item.properties[key];
            }
          }
        }
      }
    }
    return cart;
  }
}

function IsSameLinesFactory({ _ }) {
  const COMPARED_KEYS = [
    'price_original', 'price', 'variant_id',
    'product_id', 'not_allow_promotion', 'PromotionRef',
    'PromotionByProductId', 'properties'
  ];

  return function isSameLines({ line_a, line_b }) {
    return _.isEqual(_.pick(line_a.item, COMPARED_KEYS), _.pick(line_b.item, COMPARED_KEYS))
  }
}

function MergeLinesFactory({ CartUtils }) {
  
  return function mergeLines({ lines }) {
    const first_line = lines[0];

    const new_line = {
      index: first_line.index,
      item: CartUtils.cloneLine(first_line.item)
    };
    
    let new_quantity = 0;

    for (let line of lines) {
      new_quantity += line.item.quantity;
    }

    new_line.item.quantity = new_quantity;

    return new_line;
  }
}

function MergeSameLinesFactory({ _, ProcessCart }) {

  return function mergeSameLines({ cart }) {
    let new_lines = [];
    let lines = [];
    let line_same_groups = [];

    if (Array.isArray(cart.items)) {
      lines = cart.items.map((item, index) => Object({ item, index }));

      while (lines.length > 0) {
        const line_a = lines[0];

        const lines_same_as_a = [];

        for (let line_b of lines) {
          if (line_a === line_b) { continue }

          if (ProcessCart.isSameLines({ line_a, line_b })) {
            lines_same_as_a.push(line_b);
          }
        }

        if (lines_same_as_a.length > 0) {
          const line_same_group = [line_a, ...lines_same_as_a];
          line_same_groups.push(line_same_group);
          lines = lines.filter(line => !line_same_group.includes(line));
        }
        else {
          new_lines.push(line_a);
          lines = lines.filter(line => line !== line_a);
        }
      }
    }

    if (line_same_groups.length > 0) {
      for (let line_same_group of line_same_groups) {
        const new_line = ProcessCart.mergeLines({ lines: line_same_group });
        new_lines.push(new_line);
      }
    }

    new_lines = new_lines.sort((line_a, line_b) => line_a.index - line_b.index);

    cart.items = new_lines.map(line => line.item);

    return cart;
  }
}

function AddProcessingDataFactory({ ProcessCart }) {

  return function addProcessingData({ cart }) {
    cart[ProcessCart.PROCESSING_DATA_KEY] = {};

    if (Array.isArray(cart.items) && cart.items.length > 0) {
      for (let item_i in cart.items) {
        const item = cart.items[item_i];
        const key = Number(item_i) + 1;
        if (!item.properties) {
          item.properties = {};
        }
        item[ProcessCart.PROCESSING_DATA_KEY] = {};
        ProcessCart.LineKey.set({ line: item, key: key });
        ProcessCart.ProcessingData.Line.set({ line: item, key: 'price_sale', value: item.price });
      }
    }
    return cart;
  }
}

function RemoveProcessingDataFactory({ ProcessCart }) {

  return function removeProcessingData({ cart }) {
    delete cart[ProcessCart.PROCESSING_DATA_KEY];
    if (Array.isArray(cart.items) && cart.items.length > 0) {
      for (let item of cart.items) {
        delete item[ProcessCart.PROCESSING_DATA_KEY];
      }
    }
    return cart;
  }
}

function LineKeyFactory({ ProcessCart }) {
  const LineKey = {};

  LineKey.PROPERTY_KEY = 'LINE_KEY';
  LineKey.START_CODE = 'A'.charCodeAt(0);

  LineKey.create = function ({ source_line_key, index }) {
    return String(source_line_key) + String.fromCharCode(LineKey.START_CODE + index);
  }

  LineKey.get = function ({ line }) {
    return line[ProcessCart.PROCESSING_DATA_KEY][LineKey.PROPERTY_KEY];
  }

  LineKey.set = function ({ line, key }) {
    line[ProcessCart.PROCESSING_DATA_KEY][LineKey.PROPERTY_KEY] = key;
  }

  return LineKey;
}

function ProcessingDataFactory({ ProcessCart }) {
  const ProcessingData = {};

  ProcessingData.get = function ({ cart, key }) {
    return cart[ProcessCart.PROCESSING_DATA_KEY][key];
  }

  ProcessingData.set = function ({ cart, key, value }) {
    cart[ProcessCart.PROCESSING_DATA_KEY][key] = value;
    return value;
  }

  ProcessingData.Line = {};

  ProcessingData.Line.get = function ({ line, key }) {
    return line[ProcessCart.PROCESSING_DATA_KEY][key];
  }

  ProcessingData.Line.set = function ({ line, key, value }) {
    line[ProcessCart.PROCESSING_DATA_KEY][key] = value;
    return value;
  }

  return ProcessingData;
}

module.exports = { ProcessCartFactory };