
 function mtop_h5_chunk(){

    // require module
    var  h5comm = h5_common();
    var exports = {};

    var _supported;
    exports.isXhr2 = function () {
        if (undefined === _supported) {
            _supported = $.ajaxSettings.xhr().upload;
        }
        return _supported;
    }

    exports.appPath = undefined;
    exports.chunkAjax = function (options, path) {
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]
        var xhr = $.ajaxSettings.xhr(),
            abortTimeout,
            abort = function () {
                xhr.abort();
                abortTimeout && clearTimeout(abortTimeout);
            },
            processedIndex = 0,
            locked = false,
        //有并发的风险
            chunkProcess = function (txt) {
                if (locked) {
                    return
                }
                var processingTxt = txt.substr(processedIndex);
                var lenIndex = processingTxt.search(/\d+/);
                if (lenIndex < 0) {
                    return
                }
                var lenStr = processingTxt.match(/\d+/)[0];
                var chunkLength = (lenStr.length + parseInt(lenStr) + lenIndex);

                if (processingTxt.length >= chunkLength) {
                    locked = true;
                    var chunkPart = processingTxt.substr(lenStr.length + lenIndex, parseInt(lenStr));
                    //TODO bussiness!
                    var data, error;
                    try {
                        data = JSON.parse(chunkPart);
                    } catch (e) {
                        error = e
                    }
                    var context = settings.context;
                    if (error) {
                        abort();
                        settings.error.call(this, error);
                    } else {
                        //处理正常的返回
                        h5comm.dealResponse(data, function (result) {
                                settings.success.call(context, result);
                            }, function (result) {
                                settings.error.call(this, result);
                            },
                            exports.appPath, '', true
                        );
                    }
                    processedIndex += chunkLength;
                    locked = false;
                }
                if (xhr.responseText.length >= processedIndex) {
                    chunkProcess(xhr.responseText);
                }
            };
        if (!xhr.upload) {
            console.log("un support xhr2");
            return false;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    chunkProcess(xhr.responseText, true);
                } else {
                    abort();
                }
            } else if (xhr.readyState == 3) {
                chunkProcess(xhr.responseText);
            }
        };
        xhr.open(settings.type, settings.url, true);
        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
        if (settings.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = function () {
            };
            xhr.abort();
        }, settings.timeout);
        xhr.send(settings.data ? settings.data : null);
        return xhr
    }

     return exports;

 }