'use strict';

const { ApplierUtilFactory } = require('./cart-service.applier.util.server');

function ApplierFactory(DI) {
  DI.ApplierUtil = ApplierUtilFactory(DI);

  const { ERR } = DI;

  const Applier = {};

  Applier.RawList = [
    require('./BUY_X_GET_Y.ZV03.LINE_QUANTITY_FREE_ITEM.GIVE_BY.SAME_ITEM.applier.server')(DI),
    require('./BUY_X_GET_Y.ZV03.LINE_QUANTITY_FREE_ITEM.GIVE_BY.applier.server')(DI),
  ]
  Applier.List = Applier.RawList.sort((a, b) => a.priority - b.priority);

  Applier.Map = {};
  for (let applier of Applier.List) {
    Applier.Map[applier.code] = applier;
  }

  Applier.assertOne = function assertOneApplier({ promotion }) {
    let found_applier = null;
    for (let applier of Applier.List) {
      if (applier.matchPromotion({ promotion })) {
        found_applier = applier;
      }
    }
    if (!found_applier) {
      throw new ERR({ code: 'ERR_APPLIER_NOT_FOUND', promotion });
    }
    return found_applier;
  }

  Applier.detectCase = function detectCasePromotion({ promotion }) {
    for (let applier of Applier.List) {
      if (applier.isMatchPromotion && applier.isMatchPromotion({ promotion })) {
        return applier.code;
      }
    }
    return null;
  }

  return Applier;
}

module.exports = ApplierFactory;

