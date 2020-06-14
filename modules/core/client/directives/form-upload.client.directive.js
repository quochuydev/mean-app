'use strict';

angular
  .module('core')
  .directive('formUpload', formUpload);

formUpload.$inject = ['FileUploader', 'Loading'];

function formUpload(FileUploader, Loading) {
  var template = "";
  template += "<section>";
  template += "  <div class=\"text-center\" ng-hide=\"uploader.queue.length\">";
  template += "    <span class=\"btn btn-primary btn-file\">";
  template += "    <form id=\"uploadFileForm\">";
  template += "      Chọn file <input type=\"file\" nv-file-select uploader=\"uploader\" accept=\"{{accept}}\">";
  template += "    </form>";
  template += "    <\/span>";
  template += "  <\/div>";
  template += "  <div class=\"text-center\" ng-show=\"uploader.queue.length\">";
  template += "    <button class=\"btn btn-primary\" ng-click=\"upload();\">{{ uploadText }}<\/button>";
  template += "    <button class=\"btn btn-default\" ng-click=\"cancelUpload();\">{{ cancelText }}<\/button>";
  template += "  <\/div>";
  template += "<\/section>";

  return {
    scope: {
      uploadHandle: '=',
      closeModal: '&',
      uploadFileObject: '=',
      accept: '=',
    },
    restrict: 'E',
    transclude: true,
    template: template,
    compile: compile
  };

  function compile() {
    return {
      pre: pre
    };

    function pre(scope) {
      if (!scope.uploadHandle || (scope.uploadHandle && typeof scope.uploadHandle !== 'object')) {
        console.warn('Upload handle should\'t be null');
      }

      var fileType = scope.uploadHandle && scope.uploadHandle.fileType
        ? scope.uploadHandle.fileType
        : null;

      // Create file uploader instance
      scope.uploader = new FileUploader({
        url: scope.uploadHandle.url,
        headers: { action: 'create,update' },
        alias: scope.uploadHandle.alias || 'uploadedFile',
        onAfterAddingFile: onAfterAddingFile,
        onSuccessItem: onSuccessItem,
        onErrorItem: onErrorItem,
        onBeforeUploadItem: function (item) {
          if (scope.uploadHandle.onBeforeUploadItem) {
            scope.uploadHandle.onBeforeUploadItem(item);
          }
        }
      });
      // scope.uploader.setOptions(uo);

      if (fileType == 'image') {
        // Set file uploader image filter
        scope.uploader.filters.push({
          name: 'imageFilter',
          fn: function imageFilter(item) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
          }
        });
      } else if (fileType == 'excel') {

        // Set file uploader excel filter
        scope.uploader.filters.push({
          name: 'excelFilter',
          fn: function excelFilter(item) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            let check = '|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|wps-office.xls|wps-office.xlsx|'.indexOf(type) !== -1;
            if (check == true) {
              return check;
            } else {
              onErrorItem(null, { message: 'File không hợp lệ. Vui lòng chọn lại!' });
              return check;
            }
          }
        });
      } else if (fileType == 'word') {
        // Set file uploader word filter
        scope.uploader.filters.push({
          name: 'wordFilter',
          fn: function wordFilter(item) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|wps-office.doc|wps-office.docx|'.indexOf(type) !== -1;
          }
        });
      }
      scope.uploadText = scope.uploadHandle && scope.uploadHandle.uploadText ? scope.uploadHandle.uploadText : 'Upload';
      scope.cancelText = scope.uploadHandle && scope.uploadHandle.cancelText ? scope.uploadHandle.cancelText : 'Hủy';
      scope.upload = upload;
      scope.cancelUpload = cancelUpload;
      scope.uploadFileObject = {
        uploader: scope.uploader,
        reset: function () {
          scope.uploader.clearQueue();
          if ($('#uploadFileForm').length > 0) {
            $('#uploadFileForm')[0].reset();
          }
        }
      };

      // Called after the user selected a new file
      function onAfterAddingFile(fileItem) {
        if (scope.uploadHandle.onAdded) {
          scope.uploadHandle.onAdded(fileItem);
        }
      }

      // Called after the user has successfully uploaded a new file
      function onSuccessItem(fileItem, response) {
        if (response && response.error) {
          if (scope.uploadHandle.onError) {
            scope.uploadHandle.onError(fileItem, response);
          }
        } else {
          if (scope.uploadHandle.onSuccess) {
            scope.uploadHandle.onSuccess(fileItem, response);
          }
        }

        // Clear upload buttons
        cancelUpload();
      }

      // Called after the user has failed to uploaded a new file
      function onErrorItem(fileItem, response) {
        // Clear upload buttons
        cancelUpload();

        if (scope.uploadHandle.onError) {
          scope.uploadHandle.onError(fileItem, response);
        }
      }

      function upload() {
        Loading.show(true);
        // Start upload
        scope.uploader.uploadAll();

        if (scope.uploadHandle.onUpload) {
          scope.uploadHandle.onUpload();
        }
      }

      // Cancel the upload process
      function cancelUpload() {
        scope.uploader.clearQueue();
        if ($('#uploadFileForm').length > 0) {
          $('#uploadFileForm')[0].reset();
        }
        scope.closeModal();
        if (scope.uploadHandle.onCancel) {
          scope.uploadHandle.onCancel();
        }
      }
    }
  }
}
