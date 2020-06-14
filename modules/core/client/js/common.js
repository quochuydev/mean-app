var objectToFormData = function (obj, form, namespace) {
  var fd = form || new FormData();
  var formKey;
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {

      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      let value = obj[property];
      let type = typeof value;
      let isFile = value instanceof File;
      if (type === 'object' && value && !isFile) {
        fd = objectToFormData(value, fd, formKey);

      } else {

        // if it's a string or a File object
        fd.append(formKey, value);
      }

    }
  }

  return fd;

};

let common = {};

common.mcm = {
  invoke: function (elements, method, ...args) {
    for (let elem_key in elements) {
      let elem = elements[elem_key];

      let elem_method = _.get(elem, method);

      if (typeof elem_method === 'function') {
        elem_method(elem, ...args);
      }
    }
  }
}