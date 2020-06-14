'use strict';
let multer = require('multer');
let path = require('path');
let fse = require('fs-extra');

exports.import = function (req, res, next) {
  function getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

  let multerConfig = {
    dest: path.resolve("./media/import"),
    limits: {
      fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
      let mimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/octet-stream'
      ];

      if (mimeTypes.indexOf(file.mimetype) === -1) {
        return res.status(404).send({
          error: true,
          message: "Vui lòng chỉ upload file có định dạng xlsx, xlsm, xls hoặc csv"
        });
      }

      cb(null, true)
    },
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, multerConfig.dest)
      },
      filename: function (req, file, cb) {
        let extension = getFileExtension(file.originalname);
        let newName = file.originalname.replace("." + extension, "") + new Date().getTime() + '.' + extension;
        cb(null, newName);
      }
    })
  };
  fse.ensureDir(multerConfig.dest, function (errorDir) {
    if (errorDir) {
      fs.mkdirSync(multerConfig.dest);
    }

    let objMulter = multer(multerConfig).single("file");
    objMulter(req, res, function (error) {
      if (error) {
        return res.status(404).send({
          error: true,
          message: error
        });
      }
      next();
    });
  })
};
