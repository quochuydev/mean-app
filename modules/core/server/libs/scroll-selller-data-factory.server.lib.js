
'use strict';

const path = require('path');
const API = require(path.resolve('./modules/core/server/api'));
const common = require(path.resolve('./modules/core/server/libs/common.server.lib'));
const { ERR_INVALID_DATA, ERR_SERVICE_TEMPORARILY_UNAVAILABLE, ERR_SERVICE_FAILED, ServerView } = require(path.resolve('./modules/core/server/libs/errors.server.lib.js'));
const { to } = common;

function ScrollSellerDataFactory({ api, skipError = [] }) {

  return async function ScrollSeller({ shop, query }) {

    const Private = {
      items: [],
      shop: shop,
      query: { limit : 50, order : 'created_at asc', ...query },
      page: 0,
      finished: false,
      async fetchNextBatch() {
        Private.page++;

        const query = { ...Private.query, page : Private.page };

        let [error, items] = await to(API.call(api, { shop, query }));

        if (error) {
          Public.failedPages.push({ page : Private.page, error : ServerView(error) });
          if (skipError.includes(error.code)) {
            return this.fetchNextBatch();
          }
          throw error;
        }

        return items;
      }
    };

    const Public = {
      failedPages : [],
      async next() {
        if (Private.finished) {
          return null;
        }
        if (Private.items.length === 0) {
          Private.items = await Private.fetchNextBatch();
        }
        if (!(Array.isArray(Private.items) && Private.items.length > 0)) {
          Private.finished = true;
          return null;
        }
        return Private.items.shift();
      },
      async nextBatch(size = Private.query.limit) {
        if (Private.finished) {
          return null;
        }

        let batch = [];

        for (let i = 0; i < size; i++) {
          let item = await Public.next();

          if (item) {
            batch.push(item);
          }
          else {
            break;
          }
        }

        return batch.length > 0 ? batch : null;
      },
      async eachAsync(iteratee, { parallel = 5, delay = 0 }={}) {
        let items;

        while (true) {
          items = await Public.nextBatch();

          if (!(Array.isArray(items) && items.length > 0)) {
            break;
          }

          await common.asyncEachLimit({ items, limit : parallel, delay, iteratee });
        }

        return;
      }
    };

    return Public;
  }
}

module.exports = { ScrollSellerDataFactory };