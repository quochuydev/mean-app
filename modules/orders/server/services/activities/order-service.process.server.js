'use strict';


module.exports = ({ OrderService }) => async function processOrder(data) {
  if (!(data && data.action && data.order)) { return }

  switch (data.action) {
    case 'WRITE': return OrderService.write(data);
    case 'DELETE': return OrderService.delete(data);
  }
}