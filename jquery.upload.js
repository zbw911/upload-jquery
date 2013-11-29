/**
 * jQuery upload v1.2
 * http://www.ponxu.com
 *
 * @author xwz
 * @modify zbw911 https://github.com/zbw911/upload-jquery/
 *  

 */
(function ($) {
    var noop = function () { return true; };
    var frameCount = 0;

    $.uploadDefault = {
        url: '',
        fileName: 'filedata',
        dataType: 'json',
        params: {},
        exts: '',//扩展名
        onSend: noop,
        onComplate: noop
    };

    $.upload = function (options) {
        var opts = $.extend(jQuery.uploadDefault, options);
        if (opts.url == '') {
            return;
        }

        var canSend = opts.onSend();
        if (!canSend) {
            return;
        }

        var frameName = 'upload_frame_' + (frameCount++);
        var iframe = $('<iframe style="position:absolute;top:-9999px" />').attr('name', frameName);
        var form = $('<form method="post" style="display:none;" enctype="multipart/form-data" />').attr('name', 'form_' + frameName);
        form.attr("target", frameName).attr('action', opts.url);


        // form中增加数据域
        var formHtml = '<input type="file" name="' + opts.fileName + '" onchange="onChooseFile(this,\'' + options.exts + '\')">';


        for (key in opts.params) {
            formHtml += '<input type="hidden" name="' + key + '" value="' + opts.params[key] + '">';
        }
        form.append(formHtml);

        iframe.appendTo("body");
        form.appendTo("body");

        // iframe 在提交完成之后
        iframe.load(function () {

            var frameWin = iframe[0].contentWindow ||
                            (iframe[0].contentDocument && iframe[0].contentDocument.window);

            iframe
                .unbind()
                .load(function () {

                    if (frameWin.name != frameName) {
                        var resp = frameWin.name;
                        if (resp) {
                            resp = window.eval('(' + resp + ')');
                            opts.onComplate(resp);
                        }
                    } else {
                        // window.alert("取消上传");
                    }
                    iframe.remove();
                });

            frameWin.location = 'about:blank';
        });

        // 文件框
        var fileInput = $('input[type=file][name=' + opts.fileName + ']', form);
        fileInput.click();
    };
})(jQuery);

// 选中文件, 提交表单(开始上传)
var onChooseFile = function (fileInputDom, exts) {
    var form = $(fileInputDom).parent();
    var filename = $(fileInputDom).val();

    var fileext = filename.substring(filename.lastIndexOf(".") + 1);
  
    if (exts != '*' && exts != null && exts != 'undefined') {
        var ok = false;
        var arext = exts.split(',');
        for (var ext in arext) {
           
            if (arext[ext] && arext[ext].toLowerCase() == fileext) {
                ok = true;
                break;
            }
        }
        if (!ok) {
            window.alert('文件类型' + fileext + '不允许上传');
            return false;
        }
    }


    form.submit();
};
