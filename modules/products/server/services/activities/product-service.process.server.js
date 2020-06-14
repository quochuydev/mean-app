'use strict';


module.exports = ({ ProductService }) => async function processProduct(data) {
  if (!(data && data.action && data.product)) { return }

  switch (data.action) {
    case 'WRITE': return ProductService.write(data);
    case 'DELETE': return ProductService.delete(data);
  }
}