(function () {

  /**
   * MSG(code : string, data ?: object) : string
   * 
   * @example
   * 
   * // nodejs :
   * const MSG = require(path.resolve('./modules/core/share/lib/MSG.lib.share.js'));
   * console.log(MSG('ME-00104'));
   * console.log(MSG('ME-00062', { abc : 'Chi nhánh' }));
   * // browser : MSG is global
   * console.log(MSG('ME-00104'));
   * console.log(MSG('ME-00062', { abc : 'Chi nhánh' }));
   * // Wil print :
   * File không đúng định dạng cho phép (.xlsx). Vui lòng chọn lại.
   * Chi nhánh không hợp lệ.
   */
  const Module = {
    name: 'MSG',
    version: '1.0',
    dependencies: {
      _do: { name: '_do' }
    },
    factory: function (di) {

      const compile = di._do.Compile(/\[.+?\]/g);

      const messages = {
        ['ME-00001']: 'Không tìm thấy dữ liệu thỏa điều kiện tìm kiếm.',
        ['ME-00002']: 'Lưu thông tin thành công.',
        ['ME-00003']: '[abc] không hợp lệ. Vui lòng kiểm tra lại.',
        ['ME-00004']: 'Thời gian bắt đầu > Thời gian kết thúc. Vui lòng kiểm tra lại.',
        ['ME-00005']: 'Vui lòng nhập và chọn đầy đủ thông tin bắt buộc.',
        ['ME-00006']: 'Lưu không thành công. Vui lòng thử lại sau ít phút.',
        ['ME-00007']: 'Vui lòng chọn nhóm sản phẩm.',
        ['ME-00008']: 'Vui lòng chọn sản phẩm/nhóm sản phẩm khuyến mãi.',
        ['ME-00009']: 'Bạn có chắc muốn xóa dữ liệu vừa chọn không?',
        ['ME-00010']: 'Sản phẩm khuyến mãi đã tồn tại trong danh sách. Vui lòng kiểm tra lại.',
        ['ME-00011']: 'Nhóm sản phẩm khuyến mãi đã tồn tại trong danh sách. Vui lòng kiểm tra lại.',
        ['ME-00012']: 'Chương trình khuyến mãi chỉ gồm duy nhất một hình thức khuyến mãi.',
        ['ME-00013']: 'Cập nhật trạng thái thành công.',
        ['ME-00014']: 'Xóa chương trình khuyến mãi thành công.',
        ['ME-00015']: 'Không thể xóa chương trình khuyến mãi đã được sử dụng. Vui lòng kiểm tra lại.',
        ['ME-00104']: 'File không đúng định dạng cho phép (.xlsx). Vui lòng chọn lại.',
        ['ME-00154']: 'Vui lòng nhập/chọn thông tin bắt buộc',
        ['ME-00062']: '[abc] không hợp lệ.', // '- [abc]: tên feild,
        ['ERR_SERVER_FAILED']: `Có lỗi xảy ra, vui lòng liên hệ bộ phận CSKH. Mã lỗi: [id]`,
      };

      function MSG(code, data) {
        const message = messages[code];

        if (!message) { return '' }

        if (data) {
          return compile(message, data);
        }

        return message;
      }

      return MSG;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di._do = require('./_do.lib.share');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();