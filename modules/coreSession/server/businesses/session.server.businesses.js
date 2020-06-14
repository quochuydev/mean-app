'use strict';

/**
 * Module dependencies
 */

exports.getSessionStoreID = function (req) {
  let orgid = 0;
  if(req && req.session && req.session.orgid){
    orgid = Number(req.session.orgid);
  }else{
    throw new Error('orgid is null!');
  }
  return orgid;
};

exports.setSessionStoreID = function (req, orgid) {
  if(req && orgid){
    req.session.orgid = Number(orgid);
  }else{
    throw new Error('orgid is null!');
  }
  return orgid;
};

exports.criteriaAddSessionStoreID = function (req, criteria) {
  let orgid = 0;
  if(req && req.session && req.session.orgid){
    orgid = Number(req.session.orgid);
  }else{
    throw new Error('orgid is null!');
  } 

  if(criteria)  criteria.orgid = orgid;
  
  return criteria;
};



