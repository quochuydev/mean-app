'use strict';

require('array.prototype.find').shim();
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
var chalk = require('chalk');
var crypto = require('crypto');
var async = require('async');

const _to = require(path.resolve('./modules/core/share/lib/_to.lib.share.js'));

const common = module.exports;

const color = new chalk.constructor({ enabled: true });
exports.color = color;

exports.groupByKey = function (data, key) {
  var returnData = [];

  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      var existgroup = returnData.find(function (item_in_return) {
        return item_in_return.group[key] == item[key];
      });

      if (existgroup)
        existgroup.Data.push(item);
      else {
        var group = {Data: []};
        group.group = item;
        group.Data.push(item);
        returnData.push(group);
      }
    }
  }

  return returnData;
};

exports.sortByKey = function (data, key, type) {
  if (!data || (data && !data.length)) {
    return;
  }

  if (type == 'date') {
    data.sort(function (item1, item2) {
      var d1 = moment(item1[key], 'DD/MM/YYYY').toDate();
      var d2 = moment(item2[key], 'DD/MM/YYYY').toDate();

      if (d1 > d2) {
        return 1;
      } else if (d1 < d2) {
        return -1;
      } else {
        return 0;
      }
    });
  } else {
    data.sort(function (item1, item2) {
      if (item1[key] > item2[key]) {
        return 1;
      } else if (item1[key] < item2[key]) {
        return -1;
      } else {
        return 0;
      }
    });
  }
};

exports.convertExcelDate = function (date) {
  return new Date((Number(date) - (25567 + 2)) * 86400 * 1000);
};

exports.financialStatusName = function (input) {
  switch (input) {
    case "paid":
      return "Đã thanh toán";
    case "partially_paid":
      return "Đã thanh toán một phần";
    case "pending":
      return "Chưa thanh toán";
    case "partially_refunded":
    case "partiallyrefunded":
      return "Đã hoàn tiền một phần";
    case "refunded":
      return "Đã hoàn tiền";
    case "voided":
      return "Đã hủy";
    default:
      return "";
  }
};

exports.fulfillmentStatusName = function (input) {
  switch (input) {
    case "notfulfilled":
      return "Chưa giao";
    case "fulfilled":
      return "Đã giao";
    default:
      return "";
  }
};

exports.posCODStatusName = function (input) {
  switch (input) {
    case 'pos_cod_none':
      return 'Không';

    case 'pos_cod_pending':
      return 'Chưa nhận';

    case 'pos_cod_paid':
      return 'Chưa nhận';

    case 'pos_cod_receipt':
      return 'Đã nhận';

    default:
      return input;
  }
};

exports.userType = function (input) {
  switch (input) {
    case 'user_admin':
      return 'Admin';

    case 'user_normal':
      return 'Normal';

    case 'user_location':
      return 'Nhân viên trung tâm';

    case 'user_store':
      return 'Nhân viên';

    default:
      return input;
  }
};


exports.getFinancialStatus = function (input) {
  switch (input) {
    case "paid":
      return "Đã thanh toán";
    case "partially_paid":
      return "Đã thanh toán một phần";
    case "pending":
      return "Chưa thanh toán";
    case "partially_refunded":
    case "partiallyrefunded":
      return "Đã hoàn tiền một phần";
    case "refunded":
      return "Đã hoàn tiền";
    case "voided":
      return "Đã hủy";
    default:
      return "";
  }
};

exports.getFulfillmentStatus = function (input) {
  switch (input) {
    case "notfulfilled":
      return "Chưa giao";
    case "fulfilled":
      return "Đã giao";
    default:
      return "";
  }
};

exports.getItemFulfillmentStatus = function (input) {
  switch (input) {
    case "notfulfilled":
      return "Chưa hoàn thành";
    case "fulfilled":
      return "Đã hoàn thành";
    default:
      return "";
  }
};
exports.customerName = function (customer) {
  if (!customer) {
    return '';
  }

  var name = '';

  if (customer.default_address) {
    if (customer.default_address.name) {
      name = customer.default_address.name;
    } else {
      if (customer.default_address.last_name) {
        name += customer.default_address.last_name + ' ';
      }

      if (customer.default_address.first_name) {
        name += customer.default_address.first_name;
      }
    }
  }

  if (!name) {
    if (customer.last_name) {
      name += customer.last_name + ' ';
    }

    if (customer.first_name) {
      name += customer.first_name;
    }
  }

  return name;
};

exports.gatewayName = function (input) {
  input = input ? input.toLowerCase() : '';

  switch (input) {
    case "cod":
      return "COD";
    case "bankdeposit":
      return "Chuyển Khoản";
    case "custom":
      return "Tùy Chọn";
    case "sml_atm":
      return "Smartlink ATM";
    case "sml_cc":
      return "Smartlink Visa/Master";
    case "sml":
      return "Smartlink";
    case "nganluong":
      return "Ngân Lượng";
    case "vnpayment":
      return "VNPayment";
    case "paypal":
      return "PayPal";
    case "pay123_atm":
      return "Pay123 ATM";
    case "pay123_cc":
      return "Pay123 Visa/Master/JCB";
    case "payoo":
      return "Payoo";
    case "vtcpay":
      return "VTCPay";
    case "paydirect":
      return "PayDirect";
    case "webmoney":
      return "WebMoney";
    case "onepay_atm":
      return "OnePay ATM";
    case "onepay_cc":
      return "OnePay Visa/Master/JCB";
    case "scb_atm":
      return "Sacombank ATM";
    case "scb_cc":
      return "Sacombank Visa/Master/JCB";
    default:
      return input;
  }
};

exports.lazadaOrderType = function (input) {
  switch (input) {
    case "LZD":
      return "Lazada";
    case "CRM":
      return "Marketing";
    default:
      return "";
  }
};

exports.cancelReason = function (input) {
  switch (input) {
    case 'customer':
      return 'Khách hàng đổi ý';

    case 'fraud':
      return 'Đơn hàng giả mạo';

    case 'inventory':
      return 'Hết hàng';

    case 'other':
      return 'Khác';

    default:
      return '';
  }
};

exports.refundNote = function (order, plainText) {
  if (!order) {
    return plainText ? '' : [];
  }

  if (!order.refunds || (order.refunds && !order.refunds.length)) {
    return plainText ? '' : [];
  }

  var note = [];

  order.refunds.forEach(function (refund) {
    if (refund.note) {
      note.push(refund.note);
    }
  });

  return plainText ? note.join(' \r\n ') : note;
};

exports.getDiscountNote = function (order) {
  if (!order) {
    return '';
  }

  var discountNote = '';

  order.note_attributes.forEach(function (note) {
    if (note.name == 'khuyen_mai_tang_hang') {
      discountNote = note.value;
    }
  });

  return discountNote;
};

exports.formatTypeNameInventoryTransaction = function (input) {
  var inputNew = input.toLowerCase().trim();
  switch (inputNew) {
    case "basic":
      return "Cơ bản";
    case "init":
      return "Khởi tạo";
    case "transfer":
      return "Điều chuyển";
    case "adjustment":
      return "Điều chỉnh";
    case "purchaseorder":
      return "Mua hàng";
    case "saleorder":
      return "Bán hàng";
    case "saleorderfulfill":
      return "Giao hàng";
    case "saleorderrestock":
      return "Trả hàng";
    default:
      return "Cơ bản";
  }
};

exports.formatStateCustomer = function (input) {
  var inputNew = input.toLowerCase().trim();
  switch (inputNew) {
    case "enabled":
      return "Khách hàng đang hoạt động";
    case "disabled":
      return "Khách hàng chưa được mời";
    case "invited":
      return "Khách hàng đã mời";
    case "declined":
      return "Khách hàng đã từ chối";
    default:
      return "Khách hàng chưa được mời";
  }
};


exports.formatStateCustomerExcel = function (input) {
  var inputNew = input.toLowerCase().trim();
  switch (inputNew) {
    case "enabled":
      return "Yes";
    case "disabled":
    case "invited":
    case "declined":
      return "No";
    default:
      return "No";
  }
};

exports.calcShippingFee = function (order) {
  var shippingFee = 0;

  if (order && order.shipping_lines && order.shipping_lines.length) {
    order.shipping_lines.forEach(function (line) {
      shippingFee += line.price;
    });
  }

  return shippingFee;
};

exports.calcTotalRefund = function (order) {
  var totalRefund = 0;

  if (!order || !order.refunds || (order.refunds && !order.refunds.length)) {
    return 0;
  }

  order.refunds.forEach(function (refund) {
    if (refund.transactions && refund.transactions.length) {
      refund.transactions.forEach(function (transaction) {
        if ((transaction.kind || '').toLowerCase() == 'refund' && (transaction.status || '').toLowerCase() == 'thành công') {
          totalRefund += Number(Math.abs(transaction.amount));
        }
      });
    }
  });

  return totalRefund;
};

exports.calcTotalPaid = function (order) {
  var totalPay = 0;

  if (!order || !order.transactions || (order.transactions && !order.transactions.length)) {
    return 0;
  }

  order.transactions.forEach(function (transObj) {
    if (transObj.kind && transObj.kind.toLowerCase() == 'capture' && transObj.amount) {
      totalPay += Number(transObj.amount);
    }
  });

  return totalPay;
};


exports.getValueAttributes = function (note_attributes, name) {
  if (note_attributes && note_attributes.length) {
    let attribute = _.find(note_attributes, attributeFound => attributeFound.name == name);
    if (attribute) {
      return attribute.value || "";
    } else {
      return "";
    }
  } else {
    return "";
  }
};

exports.formatCountdownTime = function (miliseconds) {
  let formatArr = {
    "d": 24 * 60 * 60 * 1000,
    "h": 60 * 60 * 1000,
    "m": 60 * 1000,
    "s": 1000
  };

  let timeStr = "";

  for (let index in formatArr) {
    let timeUnit = miliseconds / formatArr[index];
    if (Math.floor(timeUnit)) {
      timeStr += Math.floor(timeUnit) + index + "-";
      miliseconds = miliseconds % formatArr[index];
    }
  }
  return timeStr.trim().substring(0, timeStr.length - 1);
};

exports.getDefaultAddress = function (data) {
  var default_address = {
    last_name: "",
    first_name: "",
    company: "",
    address1: "",
    address2: "",
    province: "",
    province_code: "",
    district: "",
    district_code: "",
    ward: "",
    ward_code: "",
    country: "",
    country_code: "",
    phone: ""
  };

  if (data) {
    var isExistDefaultAddress = data.default_address && data.default_address.id;
    if (isExistDefaultAddress) {
      default_address = data.default_address;
    } else if (!isExistDefaultAddress && data.addresses && data.addresses.length && data.addresses[0].id) {
      default_address = data.addresses[0];
    }
  }
  return default_address;

};

exports.utf8_format_field = function (strData) {
  if (strData && _.isString(strData)) {
    strData = strData.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]+/g, '');
    strData = strData.replace(/[\u200B-\u200D\uFEFF]/g, '');
    return strData;
  } else {
    return strData;
  }
};

exports.formatCarrierStatusCode = function (input) {
  if (!input || !_.isString(input)) {
    return "Chờ xử lý";
  } else {
    switch (input.toLowerCase()) {
      case "readytopick":
        return "Chờ lấy hàng";
      case "picking":
        return "Đang đi lấy";
      case "delivering":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancel":
        return "Hủy giao hàng";
      case "return":
        return "Chuyển hoàn";
      case "pending":
        return "Chờ xử lý";
      case "notmeetcustomer":
        return "Không gặp khách";
      case "waitingforreturn":
        return "Chờ chuyển hoàn";
      default:
        return input;
    }
  }
};

exports.formatCarrierCodStatusCode = function (input) {
  if (!input || !_.isString(input)) {
    return "Không";
  } else {
    switch (input.toLowerCase()) {
      case "none":
        return "Không";
      case "codpending":
        return "Chưa nhận";
      case "codpaid":
        return "Đã thu";
      case "codreceipt":
        return "Đã nhận";
      case "codnotreceipt":
        return "Chưa nhận";
      default:
        return input;
    }
  }
};

exports.customerType = function (input) {
  if (!input || !_.isString(input)) {
    return "";
  } else {
    switch (input) {
      case "staff":
        return "Nhân viên công ty";
      case "agency-lv2":
        return "Khách hàng đại lý cấp 2";
      case "agency":
        return "Khách hàng doanh nghiệp";
      case "normal":
        return "Khách hàng bình thường";
      default:
        return input;
    }
  }
};

exports.accuracyStatus = function (input) {
  if (!input || !_.isString(input)) {
    return "Chưa xác thực";
  } else {
    switch (input) {
      case 'authenticed':
        return "Đã xác thực";
      case 'unauthentic':
        return "Chưa xác thực";
      case 'changed':
        return "Đã thay đổi";
      default:
        return "Chưa xác thực";
    }
  }
};

exports.stateFormat = function (input) {
  if (!input || !_.isString(input)) {
    return "deactive";
  } else {
    switch (input) {
      case 'enabled':
        return "active";
      case 'disabled':
        return "deactive";
      default:
        return "deactive";
    }
  }
};

exports.formatInvoiceNumber = function (invoiceStr) {
  if (invoiceStr && invoiceStr.length > 6) {
    invoiceStr = String(invoiceStr);
    invoiceStr = invoiceStr.slice(6);
    return invoiceStr;
  } else {
    return invoiceStr;
  }
};

exports.typeRequestPayment = function (input) {
  switch (input) {
    case 1:
      return "Chuyển khoản";
    default:
      return "Chuyển khoản";
  }
};

exports.statusRequestPayment = function (input) {
  switch (input) {
    case 0:
      return "Chưa xác nhận";
    case 1:
      return "Đã xác nhận";
  }
};

exports.mapRequestRefundResource = function (input) {
  switch (input) {
    case 0:
      return "Không xác định";
    case 1:
      return "Khách hàng";
    case 2:
      return "Nhân viên nội bộ";
    default:
      return "Không xác định";
  }
};

exports.mapStatusRequestRefund = function (input) {
  switch (input) {
    case 1:
      return "Mới";
    case 2:
      return "Chờ xử lý";
    case 3:
      return "Đã duyệt";
    case 4:
      return "Hủy";
    case 5:
      return "Hoàn thành";
    case 6:
      return "Hàng đã về và chờ thẩm định";
    case 7:
      return "Từ chối nhập kho";
    default:
      return "";
  }
};

exports.mapStatusWarehouse = function (input) {
  if ([1, 4, 6, 8].includes(input.status)) {
    return "";
  } else {
    switch (input.status_import_warehouse) {
      case 1:
        return "Đã nhập kho";
      case 2:
        return "Chưa nhập kho";
      default:
        return "";
    }
  }
};

exports.mapLimitAplly = function (input) {
  switch (input) {
    case 1:
      return "Tháng";
    case 2:
      return "Năm";
    default:
      return "";
  }
};

exports.mapActive = function (input) {
  switch (input) {
    case 1:
      return "active";
    case 2:
      return "deactive";
    default:
      return "";
  }
};

exports.mapCarrierStatusName = function (input) {
  let data = input && _.isString(input) ? input.toLowerCase() : "";
  switch (data) {
    case "readytopick":
      return "Chờ lấy hàng";
    case "picking":
      return "Đang đi lấy";
    case "delivering":
      return "Đang giao hàng";
    case "delivered":
      return "Đã giao hàng";
    case "cancel":
      return "Hủy giao hàng";
    case "return":
      return "Chuyển hoàn";
    case "pending":
      return "Chờ xử lý";
    case "notmeetcustomer":
      return "Không gặp khách";
    case "waitingforreturn":
      return "Chờ chuyển hoàn";
    default:
      return input;
  }
};

exports.mapCarrierStatusCOD = function (input) {
  var input_tmp = input || '';
  switch (input_tmp.toLowerCase()) {
    case "none":
      return "Không";
    case "codpending":
      return "Chưa nhận";
    case "codpaid":
      return "Đã thu";
    case "codreceipt":
      return "Đã nhận";
    case "codnotreceipt":
      return "Chưa nhận";
    default:
      return input;
  }
};

exports.mapOrderStatusName = function (input) {
  var input_tmp = input || '';
  switch (input_tmp.toLowerCase()) {
    case "pos_pending":
      return "Chờ xử lý";
    case "pos_user_assigned":
      return "Đang xử lý";
    case "pos_confirmed":
      return "Đã xác nhận";
    case "pos_store_assigned":
      return "Đã chuyển";
    case "pos_stock_on_hand":
      return "Đã duyệt";
    case "pos_out_of_stock":
      return "Hết hàng";
    case "pos_waiting_for_output":
      return "Chờ xuất kho";
    case "pos_output":
      return "Đã xuất kho";
    case "pos_delivering_nvc":
      return "NVC giao";
    case "pos_delivering_self":
      return "Tự giao hàng";
    case "pos_complete":
      return "Hoàn tất";
    case "pos_cancel_restock":
      return "Hủy nhập kho";
    case "pos_cancel":
      return "Hủy đơn";
    case "pos_cancel_refund":
      return "Hủy trả hàng";
    default:
      return input;
  }
};

exports.kindStatusName = function (input) {
  let inputLowerCase = input ? input.toLowerCase() : input;
  switch (inputLowerCase) {
    case "capture":
      return "Xác nhận thanh toán";
    case "refund":
      return "Hoàn trả";
    // case "Authorization":
    //   return "Đã xác thực";
    case "pending":
      return "Chưa thanh toán";
    case "void":
      return "Đã hủy";
    default:
      return inputLowerCase;
  }
};

exports.kindStatusName = function (input) {
  let inputLowerCase = input ? input.toLowerCase() : input;
  switch (inputLowerCase) {
    case "capture":
      return "Xác nhận thanh toán";
    case "refund":
      return "Hoàn trả";
    // case "Authorization":
    //   return "Đã xác thực";
    case "pending":
      return "Chưa thanh toán";
    case "void":
      return "Đã hủy";
    default:
      return inputLowerCase;
  }
};

exports.styleFilterInventory = function (input) {
  let inputLowerCase = input ? input.toLowerCase() : input;
  switch (inputLowerCase) {
    case "qty_all":
      return "Tất cả";
    case "qty_onhand":
      return "Số lượng tồn";
    case "qty_commited":
      return "Số lượng đặt";
    case "qty_available":
      return "Số lượng khả dụng";
    default:
      return '';
  }
}

exports.convertIsActive = function (input) {
  if(!input) return 0;
  switch (input.toLowerCase()) {
    case 'active':
      return 1;
    case 'deactive':
      return 2;
    default:
      return 0;
  }
}

exports.convertIsActiveText = function (input) {
  switch (Number(input)) {
    case 1:
      return 'Đang hoạt động';
    case 2:
      return 'Đã khóa';
    default:
      return '';
  }
};

exports.convertIsActiveTextFrontend = function (input) {
  switch (Number(input)) {
    case 1:
      return 'active';
    case 2:
      return 'locked';
    default:
      return null;
  }
};

exports.convertViolations = function (key, input) {
  switch(key){
      case "max_total_in_order":
        return "Giá trị đơn hàng lớn hơn "+input;
      case "max_total_all_order":
        return "Tổng giá trị đơn hàng chưa hoàn tất lớn hơn "+input;
      case "max_time_between_order":
        return "Đơn hàng đặt liền kề nhau nhỏ hơn "+input+'s';
      case "max_item_in_order":
        return "Tổng số lượng sản phẩm trong đơn hàng lớn hơn "+input;
      case "check_same_before_order":
        return "Đơn hàng giống hoàn toàn đơn hàng trước";
      default:
        return input;
}
};

/**
 * @note this method mutate source.items
 */
exports.remoteMongoJoin = async function remoteMongoJoin({ source, dest }) {
  if (!(Array.isArray(source.items) && source.items.length > 0)) { return }

  source.empty_keys = source.empty_keys || [null, undefined, ''];
  dest.default_value = dest.default_value || {};
  dest.limit = dest.limit || 100000;
  dest.join = dest.join || _joinData;

  let keys = [];

  for (let i in source.items) {
    let item = source.items[i];
    if (typeof item.toObject === 'function') {
      item = item.toObject();
      source.items[i] = item;
    }
    if (!source.empty_keys.includes(item[source.key])) {
      if (!keys.includes(item[source.key])) {
        keys.push(item[source.key])
      }
    }
  }

  if (keys.length === 0) {
    _assignDefault({ source, dest });
    return;
  }

  let filter = dest.filter(keys);

  if (typeof dest.find === 'function') {
    dest.items = await dest.find(filter, { keys, source, dest });
  }
  else {
    if (dest.model) {
      dest.items = await dest.model.find(filter, dest.fields).limit(dest.limit).lean(true);
    }
    else if (dest.service) {
      dest.items = await dest.service.find({ filter, fields : dest.fields, limit : dest.limit });
    }
  }

  if (!(Array.isArray(dest.items) && dest.items.length > 0)) {
    _assignDefault({ source, dest });
    return;
  }

  dest.join({ source, dest });
};

function _joinData({ source, dest }) {
  for (let s_item of source.items) {
    let d_item = dest.items.find(item => item[dest.key] == s_item[source.key]);

    if (d_item === undefined) {
      d_item = dest.default_value;
    }

    source.assign(s_item, d_item);
  }
}

function _assignDefault({ source, dest }) {
  for (let s_item of source.items) {
    source.assign(s_item, dest.default_value);
  }
}

/**
 * Make sure that iteratee[n] will be invoked after time(ms) from the iteratee[n - 1] invoking.
 * @param {number} time (ms)
 * @param {function} iteratee 
 * 
 * @example
 * 
 * const start_date = Date.now();
 * const coll = ['A', 'B', 'C', 'D'];
 * const iteratee = async item => console.log(`at ${Date.now() - start_date}ms ${item}`);
 * 
 * Promise.all(coll.map(utils.DelayIteratee(200, iteratee)));
 * 
 * // or
 * const asyncLib = require('async');
 * asyncLib.eachLimit(coll, 3, utils.DelayIteratee(200, iteratee));
 * 
 * // will print like:
 * at 0ms A
 * at 200ms B
 * at 400ms C
 * at 600ms D
 */
exports.DelayIteratee = DelayIteratee;
function DelayIteratee(time, iteratee) {
  let start_date;
  let i = -1;

  return async function delayIteratee(...args) {
    i++;

    if (!start_date) { start_date = Date.now() }

    let timeout = Math.max((i * time) - (Date.now() - start_date), 0);

    await delay(timeout);

    return iteratee(...args);
  }
};

exports.delay = delay;
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
};

/**
 * @example
 * let items = [
 *    { sku : 'HEO', price : 1000 },
 *    { sku : 'GA', price : 2000 },
 *    { sku : 'HEO', price : 2500 },
 * ];
 * let sku_count = keyStatistics({ items, keyPath : 'sku', includesMinCount : 2 });
 * 
 * => sku_count = { HEO : 2 };
 */
exports.keyStatistics = function keyStatistics({ items, keyPath, includesMinCount }) {
  let key_count = {};

  if (Array.isArray(items) && items.length > 0) {
    for (let item of items) {
      let key = item;
      if (keyPath) {
        key = item[keyPath];
      }
      if (!key_count[key]) {
        key_count[key] = 1;
      }
      else {
        key_count[key]++;
      }
    }
  }

  if (includesMinCount > 0) {
    for (let key in key_count) {
      if (!(key_count[key] >= includesMinCount)) {
        delete key_count[key];
      }
    }
  } 

  return key_count;
}

exports.parseAxiosError = function parseAxiosError(err) {
  if (err.response) {
    if (err.response.data) {
      if (err.response.data.error && typeof err.response.data.error === 'object') {
        return err.response.data.error;
      }
      return err.response.data;
    }
    return err;
  }
}

exports._test = _test;
/**
 * Simple test runner
 * 
 * @note only run on NODE_ENV : development
 * 
 * @interface \
 * * _test(name : string, f : Function | Object, options : { timeout : number })
 * * _test(f : Function | Object, options : { timeout : number })
 * 
 * @example
 * 
 * _test('doSomthing', () => {});
 * _test(function doSomthing() {});
 * _test({ doSomthing() {}, doSomthingElse() {} });
 * 
 * // Will print like : 
 * 
 * [TEST] [START] doSomthing()
 * [TEST] [OK   ] doSomthing() 12ms
 * // or
 * [TEST] [FAIL ] doSomthing() 12ms
 * Error: Invalid ....
 */
async function _test(name, f, options) {
  if (!['development'].includes(process.env.NODE_ENV)) { return }

  if (typeof name === 'object' || typeof name === 'function') {
    options = f;
    f = name;
    name = undefined;
  }

  options = Object.assign({ groups : [], timeout : 5000 }, options);

  setTimeout(async () => {
    if (typeof f === 'function') {
      let _case = Array.from(options.groups);
      if (name) {
        _case.unshift(name);
      }
      if (f.name && f.name !== _case[_case.length - 1]) {
        _case.push(f.name);
      }
  
      _case = _case.join('.');
  
      const started_at = Date.now();
      try {
        console.log(color.cyan(`[TEST] [START] ${_case}()`));
        await f();
        console.log(color.green(`[TEST] [OK   ] ${_case}() ${Date.now() - started_at}ms`));
      }
      catch (err) {
        console.log(color.red(`[TEST] [FAIL ] ${_case}() ${Date.now() - started_at}ms`));
        console.error(err);
      }
    }
    else if (f && typeof f === 'object') {
      const keys = Object.keys(f);
    
      await Promise.all(keys.map(key => _test(f[key], { groups : [...options.groups, key], timeout : 0 })));
    }
    else {
      console.log(color.yellow('No test found'));
    }
  }, options.timeout);
}

/** 
 * Add method nextBatch() to cursor that return [size] items. 
 * While the current next() method return only one item.
 * 
 * @example
 * 
 * const cursor = await OrderModel.find()lean(true).cursor({ batchSize : 100 });
 * 
 * injectNextBatchToCursor(cursor);
 * 
 * while (true) {
 *  const items = await cursor.nextBatch();
 *  if (!items) { break }
 *  // do something with items = [100 items]
 * }
 */
exports.injectNextBatchToCursor = function injectNextBatchToCursor(cursor, batchSize) {
  
  cursor.nextBatch = async function nextBatch(size = batchSize) {
    if (cursor._finished) {
      return null;
    }

    let batch = [];

    for (let i = 0; i < size; i++) {
      let item = await cursor.next();

      if (!item) {
        cursor._finished = true;
        break;
      }

      batch.push(item);
    }

    return batch.length > 0 ? batch : null;
  }

  return cursor;
}

/**
 * change the way handle promise
 * @param {Object} promise 
 * @example
 * To handle mongoose error, instead of try catch :
 * try {
 *  let store = await StoresModel.findOne({ id : 1000 });
 * }
 * catch (err) {
 *   // handle mongoose error
 * }
 * You can :
 * let [err, store] = await to(StoresModel.findOne({ id : 1000 }));
 * if (err) {
 *  // handle mongoose error
 * }
 */
exports.to = function to(promise) {
  return promise.then(data => {
     return [null, data]
  })
  .catch(err => [err]);
}

exports.asyncEachLimit = async function asyncEachLimit({ col, items, limit, delay, iteratee }) {
  if (!items) {
    items = col;
  }
  
  if (delay > 0) {
    iteratee = DelayIteratee(delay, iteratee);
  }

  return new Promise((resolve, reject) => {

    async.eachLimit(items, limit, (item, cb) => {
      iteratee(item)
      .then(() => cb && cb())
      .catch(err => cb && cb(err));
    }, error => {
      if (error) {
        return reject(error);
      }
      return resolve(error);
    });
  })
}

exports.createHmacSha256 = function createHmacSha256(string, secret_key) {
  var hmacSha256 = crypto
    .createHmac('sha256', secret_key)
    .update(new Buffer(string, 'utf8'))
    .digest('hex');
  return hmacSha256;
};

/**
 * @description convert obj to array<key, value : string>
 */
exports.toListKeyVal = function toListKeyVal(obj) {
  const table = [];

  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      let value = obj[key];

      if (value && typeof value === 'object') {
        value = JSON.stringify(value);
      }
      else {
        value = _.toString(value);
      }

      table.push({ key, value });
    }
  }

  return table;
}

common.getSellerQueryTime = function getSellerQueryTime({ fetchWindowMinutes, bufferMinutes }) {
  const now = Date.now();
  const updated_at_min = new Date(now - fetchWindowMinutes * 60 * 1000 - bufferMinutes * 60 * 1000);
  const updated_at_max = new Date(now + bufferMinutes * 60 * 1000);

  return {
    updated_at_min: _to.utc7(updated_at_min),
    updated_at_max: _to.utc7(updated_at_max)
  };
}

common.isMatchSyncAllTime = function isMatchSyncAllTime({ syncAllAt, msRange }) {
  if (!syncAllAt) { return false }

  const now = new Date();
  const sync_all_date = new Date(now);

  sync_all_date.setHours(syncAllAt.hours);
  sync_all_date.setMinutes(syncAllAt.minutes);

  let min_date, max_date;

  if (msRange > 0) {
    min_date = new Date(sync_all_date.getTime() - msRange);
    max_date = new Date(sync_all_date.getTime() + msRange);
  }
  else {
    min_date = max_date = sync_all_date;
  }

  return now >= min_date && now <= max_date;
}