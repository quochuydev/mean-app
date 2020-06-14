(function () {

  const Module = {
    name: '_CONST',
    version: '1.0',
    factory: function () {

      const _CONST = {
        IS: {
          TRUE: true,
          FALSE: false,
          ALL: '*'
        },
        ENTRY: {
          ES: {
            ORDER: 'ES_ORDER',
            USER: 'ES_USER',
            LOCATION: 'ES_LOCATION',
          },
        },
        SERVICE_CODES: {
          SELLER: 'SV_SELLER'
        },
        PROCESS: {
          STATUS: {
            IDLE: 'IDLE',
            RUNNING: 'RUNNING',
            MISSED_CONDITION: 'MISSED_CONDITION',
            FINISHED: 'FINISHED',
            FAILED: 'FAILED'
          },
          get STATUS_LIST() {
            return Object.values(_CONST.PROCESS.STATUS)
          },
          ORDER: {
            AUTO_TOOL: {
              AUTO_VERIFY: 'auto_verify',
              POS_USER_ASSIGNED: 'pos_user_assigned',
              POS_CONFIRMED: 'pos_confirmed',
              POS_STORE_ASSIGNED: 'pos_store_assigned',
              AUTO_ASSIGNED_STORE_WHEN_POS_OUTPUT: 'auto_assigned_store_when_pos_out',
              AUTO_POS_STOCK_ON_HAND: 'auto_pos_stock_on_hand',
              AUTO_POS_OUTPUT: 'auto_pos_output',
              POS_DELIVERING_NVC: 'pos_delivering_nvc',
              POS_DELIVERING_SELF: 'pos_delivering_self',
              POS_CANCEL_RESTOCK: 'pos_cancel_restock',
            }
          }
        },
        USER: {
          SYSTEM: 'SYSTEM'
        },
        ALERT_PROCESS_CODES: {
          API_NVC_SELLER: 'API_NVC_SELLER',
          ORDER_AUTO_PROCESS_ERROR: 'ORDER_AUTO_PROCESS_ERROR',
          ORDER_AUTO_PROCESS_NOT_RUN: 'ORDER_AUTO_PROCESS_NOT_RUN',
          INVENTORY_LEAK: 'INVENTORY_LEAK',
          ORDER_DIVIDE_ERROR: 'ORDER_DIVIDE_ERROR',
          SYNC_PRODUCT: 'SYNC_PRODUCT',
          SYNC_INVENTORY: 'SYNC_INVENTORY',
          SYNC_CUSTOMER: 'SYNC_CUSTOMER',
          SYNC_ORDER: 'SYNC_ORDER'
        },
        ALERT_PROCESS_TYPE: {
          IMMEDIATELY: 'IMMEDIATELY',
          SCHEDULE: 'SCHEDULE'
        },
        get ALERT_PROCESSES() {
          return {
            [_CONST.ALERT_PROCESS_CODES.API_NVC_SELLER]: {
              name: 'Lỗi giao nhà vận chuyển',
              value: _CONST.ALERT_PROCESS_CODES.API_NVC_SELLER,
              type: _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_ERROR]: {
              name: 'Tự động xử lý đơn hàng lỗi',
              value: _CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_ERROR,
              type: _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_NOT_RUN]: {
              name: 'Không tự động xử lý đơn hàng',
              value: _CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_NOT_RUN,
              type: _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.INVENTORY_LEAK]: {
              name: 'Lệch tồn kho',
              value: _CONST.ALERT_PROCESS_CODES.INVENTORY_LEAK,
              type: _CONST.ALERT_PROCESS_TYPE.SCHEDULE,
            },
            [_CONST.ALERT_PROCESS_CODES.ORDER_DIVIDE_ERROR]: {
              name: 'Tách đơn hàng lỗi',
              value: _CONST.ALERT_PROCESS_CODES.ORDER_DIVIDE_ERROR,
              type: _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.SYNC_PRODUCT]: {
              name: 'Đồng bộ sản phẩm lỗi',
              value: _CONST.ALERT_PROCESS_CODES.SYNC_PRODUCT,
              type: _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
          }
        },
        get ALERT_PROCESS_LIST() {
          return Object.values(_CONST.ALERT_PROCESSES);
        },
        get ALERT_PROCESS_LIST_WITH_TYPE() {
          return _CONST.ALERT_PROCESS_LIST.map(item => {
            item.name = item.name + (item.type === 'SCHEDULE' ? ' (Theo thời gian)' : ' (Gửi lập tức)');
            return item;
          });
        },
        INVENTORY_REASON_CODES: {
          NEW_PRODUCT: "newproduct",
          RETURNED: "returned",
          PRODUCTION_OF_GOODS: "productionofgoods",
          DAMAGED: "damaged",
          SHRINK_AGE: "shrinkage",
          PROMOTION: "promotion",
          TRANSFER: "transfer"
        },
        get INVENTORY_REASONS_LIST() {
          return {
            [_CONST.INVENTORY_REASON_CODES.NEW_PRODUCT]: {
              name: 'Sản phẩm mới',
              value: _CONST.INVENTORY_REASON_CODES.NEW_PRODUCT
            },
            [_CONST.INVENTORY_REASON_CODES.RETURNED]: {
              name: 'Hoàn trả',
              value: _CONST.INVENTORY_REASON_CODES.RETURNED
            },
            [_CONST.INVENTORY_REASON_CODES.PRODUCTION_OF_GOODS]: {
              name: 'Sản xuất thêm',
              value: _CONST.INVENTORY_REASON_CODES.PRODUCTION_OF_GOODS
            },
            [_CONST.INVENTORY_REASON_CODES.DAMAGED]: {
              name: 'Hư hỏng',
              value: _CONST.INVENTORY_REASON_CODES.DAMAGED
            },
            [_CONST.INVENTORY_REASON_CODES.SHRINK_AGE]: {
              name: 'Hao hụt',
              value: _CONST.INVENTORY_REASON_CODES.SHRINK_AGE
            },
            [_CONST.INVENTORY_REASON_CODES.PROMOTION]: {
              name: 'Khuyến mãi',
              value: _CONST.INVENTORY_REASON_CODES.PROMOTION
            },
            [_CONST.INVENTORY_REASON_CODES.TRANSFER]: {
              name: 'Điểu chuyển',
              value: _CONST.INVENTORY_REASON_CODES.TRANSFER
            }
          }
        },
        INVENTORY_TYPE_UPDATE: {
          ADJUST: 'adjust',
          SET: 'set'
        },
        EVENT: {
          BUS: {
            DIRECT: 'DIRECT',
            EXCHANGE: 'EXCHANGE'
          }
        },
        ETP: {
          ORDER: {
            STATUS: {
              RECEIVED: 'Received',
              ACCEPTED: 'Accepted',
              PICK_AND_PACK: 'Pick&Pack',
              INVOICED: 'Invoiced',
              REJECT: 'Reject'
            },
            get STATUS_LIST() {
              return Object.values(_CONST.ETP.ORDER.STATUS);
            },
            STATUS_MAP_FROM_ES: {
              pos_store_assigned: 'Received',
              pos_stock_on_hand: 'Accepted',
              pos_waiting_for_output: 'Pick&Pack',
              pos_output: 'Invoiced',
              pos_out_of_stock: 'Reject',
            },
          }
        },
        SOURCE_NAMES: [
          { code: 'hararetail', name: 'Hara Retail' },
          { code: 'web', name: 'Buyer' }
        ],
        PROMOTION: {
          TYPE: {
            BUYX_GETY: 1
          },
          _TYPES: [
            { value: 1, name: 'Buy X Get Y' }
          ],
          STATUS: {
            ACTIVE: 1,
            INACTIVE: 2
          },
          DISCOUNT_TYPE: {
            NONE: 0,
            MONEY: 1,
            PERCENT: 2,
            GIFT: 3,
            FIX_AMOUNT: 4
          },
          CONDITION_TYPE: {
            AND: 1,
            OR: 2
          },
          HAS_GROUP: {
            OR: true,
            AND: false
          },
          IS_MAIN: {
            TRUE: true,
            FALSE: false
          },
          APPLY_RESOURCE: {
            PRODUCT: 1,
            VARIANT: 2
          }
        }
      };

      return _CONST;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    window[Module.name] = Module.factory(di);
  }
})();