/**
 * 简化 h5APi 的调用
 * 前提：
 *   调用之前当前文档必须包含一个J_app_key的AppKey隐藏字段
 * 一般直接调用
 * getApi(
 *     api, 如：mtop.logistic.getlogisticbyorder
 *      v, 1.0
 *      data,  {'orderId':148697349962715}
 *  extParam,  {'pds':'seeflow#order'}
 *  callback,
 *  errorback
 * );
 *
 */


(function(app,undef){

    function configS(){
        var exports = {};

        // loading
        {
            var _checkSysType = 'm';
            if(window.location.host=='localhost' || window.location.host.match('.*\\waptest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')){
                _checkSysType = 'waptest';
            } else if (window.location.host.match('.*\\wapa\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*'))
            {
                _checkSysType = 'wapa';
            }
            else if (window.location.host.match('.*\\m\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*'))
            {
                _checkSysType = 'm';
            }
        }

        // [auto check]system type , m or wapa or waptest
        exports.sysType = _checkSysType || 'm';

        return exports;
    }

    function h5_base(){
        var exports = {};
        //paramKey
        exports.paramKey = 'h5_paramKey';
        exports.targetUrl = 'h5_targetUrl';
        //userinfoKey
        exports.userInfoKey = 'h5_userInfoKey';
        //href hash
        exports.hrefHash = 'h5_hrefHashKey';
        // for token
        exports.appKey = 'h5_app_key';
        exports.appToken = 'h5_app_token';
        exports.appRefreshToken = 'h5_app_ref_token';
        exports.appTokenExpired = 'h5_app_token_expired';
        exports.appTokenBetween = 'h5_app_token_between';
        exports.appTokenSaveTime = 'h5_app_token_save_time'; //存储localstoary time
        exports.appRequestFailed = 'h5_app_request_failed_tag';

        // Extend a given object with all the properties in passed-in object(s).
        function extend(obj) {
            var args = Array.prototype.slice.call(arguments, 1);
            for(var i = 0, len = args.length; i < len; i++) {
                for(var prop in args[i]) {
                    obj[prop] = args[i][prop];
                }
            }
            return obj;
        };


        exports.useLocalstorage = useLocalstorage = window.localStorage != null;

        //类似于map的set方法，如果value不是string对象，会用JSON.stringify转化为string，存储到本地
        exports.set = function(key, value) {
            if(useLocalstorage) {
                if( typeof (value) != "string") {
                    value = JSON.stringify(value);
                    // JSON.parse
                };
                window.localStorage.setItem(key, value);
                return true;
            }
            return false;
        }

        exports.add = function(key, value) {
            if(useLocalstorage) {
                if( typeof (value) == "string") {
                    value = JSON.parse(value);
                } else {
                    // JSON.parse
                    try {
                        extend(value, JSON.parse(getValue(key)));
                    } catch(e) {
                        //  console.log(e);
                    }
                    value = JSON.stringify(value);
                }
                window.localStorage.setItem(key, value);
                return true;
            }
            return false;
        }
        //简单的做了一个window.localStorage.getItem 映射
        exports.get = getValue = function(key) {
            if(useLocalstorage) {
                return window.localStorage.getItem(key);
            }
            return null;
        }
        //简单的做了一个window.localStorage.getItem 映射
        exports.removeValue = function(key) {
            if(useLocalstorage) {
                return window.localStorage.removeItem(key);
            }
        }
        //清除所有localStorage
        exports.clearAll = function() {
            if(useLocalstorage) {
                return window.localStorage.clear();
            }
        }
        /**
         * 判断是否从cache中取hash
         * 如果当前请求没有hash则从localstoary中取，否则如果请求带hash保存当前hash到localstoray中
         */
        exports.userCacheHash = function() {
            //如果没有hash，从localStoray中取上一次的hash
            if(!location.hash && this.get(this.hrefHash)) {
                location.hash = this.get(this.hrefHash);
                return true;
            }
            //save current hash to cache
            else if(location.hash) {
                this.set(this.hrefHash, location.hash);
            }
            return false;
        }
        //获取指定参数值
        exports.getParamFromStorage = function(key) {
            try {
                return JSON.parse(this.get(this.paramKey))[key];
            } catch(ex) {
                //
            }
            return null;

        }
        //获取指定参数值
        exports.getUserProFromStorage = function(pro) {
            try {
                return JSON.parse(this.get(this.userInfoKey))[pro];
            } catch(ex) {
                //
            }
            return null;
        }
        //当前时间与服务器当前时间比较
        exports.getBetweenTime = function(currentSeverTime) {
            return (new Date()).getTime() - currentSeverTime;

        }

        exports.checkIsBlank = function(s) {
            return null == s || '' == s;
        }
        //判断是否登录
        exports.isLogin = function() {
            var nick = this.getUserProFromStorage('nick');

            if(nick == '' || nick == null) {
                return false;
            } else {
                return true;
            }
        }

        //删除token
        exports.removeToken = function () {
            try {
                this.removeValue(this.appToken);
                this.removeValue(this.appRefreshToken);
                this.removeValue(this.appTokenExpired);
                this.removeValue(this.appTokenBetween);
                this.removeValue(this.appTokenSaveTime);
            } catch (e) {

            }

        }
        //获取Url参数,不传key返回所有参数
        exports.getQueryString = function(paramKey){
            var paramStr=location.search;
            if(paramStr.length < 1 )
            {
                return "";
            }
            paramStr=paramStr.substr(1);
            var params = paramStr.split('&');
            var queryString={};
            for(i in params)
            {
                var aparam = params[i].split('=');
                queryString[decodeURIComponent(aparam[0])] = decodeURIComponent(aparam[1]) ;
            }

            if (paramKey)
            {
                return queryString[paramKey];
            }
            else
            {
                return queryString;
            }

        }
        return exports;
    }


    function h5_utils(){
        var exports = {};
        /**
         * 判断是否为空
         * null、undefined、空格 都返回true
         */
        exports.isBlank   = function(str){
            if(str == null || typeof(str) == 'undefined' || $.trim(str) == ''){
                return true;
            }
            return false;
        }

        exports.wrapColsure = function(o) {
            $.each(o, function(f) {
                if (typeof o[f] == 'function') {
                    o[f] = _.bind(o[f], o);
                }
            });
            return o;
        }


        // ~~~ md5 method begin ~~~
        exports.MD5 = function (string) {

            function RotateLeft(lValue, iShiftBits) {
                return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
            }

            function AddUnsigned(lX,lY) {
                var lX4,lY4,lX8,lY8,lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }

            function F(x,y,z) { return (x & y) | ((~x) & z); }
            function G(x,y,z) { return (x & z) | (y & (~z)); }
            function H(x,y,z) { return (x ^ y ^ z); }
            function I(x,y,z) { return (y ^ (x | (~z))); }

            function FF(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function GG(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function HH(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function II(a,b,c,d,x,s,ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1=lMessageLength + 8;
                var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
                var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
                var lWordArray=Array(lNumberOfWords-1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while ( lByteCount < lMessageLength ) {
                    lWordCount = (lByteCount-(lByteCount % 4))/4;
                    lBytePosition = (lByteCount % 4)*8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
                lWordArray[lNumberOfWords-2] = lMessageLength<<3;
                lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
                return lWordArray;
            };

            function WordToHex(lValue) {
                var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
                for (lCount = 0;lCount<=3;lCount++) {
                    lByte = (lValue>>>(lCount*8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
                }
                return WordToHexValue;
            };

            function Utf8Encode(string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            };

            var x=Array();
            var k,AA,BB,CC,DD,a,b,c,d;
            var S11=7, S12=12, S13=17, S14=22;
            var S21=5, S22=9 , S23=14, S24=20;
            var S31=4, S32=11, S33=16, S34=23;
            var S41=6, S42=10, S43=15, S44=21;

            string = Utf8Encode(string);

            x = ConvertToWordArray(string);

            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

            for (k=0;k<x.length;k+=16) {
                AA=a; BB=b; CC=c; DD=d;
                a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
                d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
                c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
                b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
                a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
                d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
                c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
                b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
                a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
                d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
                c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
                b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
                a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
                d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
                c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
                b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
                a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
                d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
                c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
                b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
                a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
                d=GG(d,a,b,c,x[k+10],S22,0x2441453);
                c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
                b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
                a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
                d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
                c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
                b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
                a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
                d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
                c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
                b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
                a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
                d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
                c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
                b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
                a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
                d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
                c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
                b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
                a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
                d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
                c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
                b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
                a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
                d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
                c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
                b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
                a=II(a,b,c,d,x[k+0], S41,0xF4292244);
                d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
                c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
                b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
                a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
                d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
                c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
                b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
                a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
                d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
                c=II(c,d,a,b,x[k+6], S43,0xA3014314);
                b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
                a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
                d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
                c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
                b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
                a=AddUnsigned(a,AA);
                b=AddUnsigned(b,BB);
                c=AddUnsigned(c,CC);
                d=AddUnsigned(d,DD);
            }

            var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

            return temp.toLowerCase();
        }

        return exports;
    }



    function uri_link(){
        var exports = {};

        var config = configS();
        var tbh5   = h5_base();

        // configure options for M\WAPA\WAPTEST
        exports.uri = {
            protocol		: 'http://',
            sysType			: config.sysType || 'm',
            defaultDomain	: 'taobao'
        };

        var _domainWhiteList = ['taobao', 'tmall', 'etao', 'alibaba', 'alipay'];
        var _Domainholder = '${_serverDomain}';
        // waptest/wapa/m/wap.${_serverDomain}.com
        exports._serverHost	 = exports.uri.sysType + '.' + _Domainholder + '.com';

        // sub uri , can be extended
        exports.subUri = {
            index : exports.uri.protocol + exports._serverHost,
            // you can add ur uri here
        };

        // sid & tt & default url query str
        exports.ttQueryStr = "";

        // load
        try {
            var defaultParams = JSON.parse(tbh5.get(tbh5.userInfoKey) || '{}') || {};
            var sid = defaultParams.sid;
            if (null != sid && '' != sid)
            {
                exports.ttQueryStr += ('sid=' + sid);
            }
            var paramKeyValues = JSON.parse(tbh5.get(tbh5.paramKey) || '{}') || {};
            if (paramKeyValues.ttid && '' != paramKeyValues.ttid)
            {
                exports.ttQueryStr += ("&ttid=" + paramKeyValues.ttid);
            }

            //		console.log(exports.ttQueryStr);
        } catch (e) {
            // do nothing
        }

        // ~~~ exportsort function begin ~~~

        /**
         * render tool: sub uri
         * @uri		[must]exports.subUri, you can add new configuration or extends this module to define new subUri
         * @target	[optional]pageName, just like 'index.htm'
         * @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
         * @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3'
         * @domain	[optional]domainName, just like 'tmall', default is ${exports.uri.defaultDomain}
         *
         * you can use like :
         - URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688},'shop','tmall');
         - URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688},'shop');
         - URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm', {'shopId':1688});
         - URI_MODULE.renderURI(URI_MODULE.subUri.shopHost, 'shop_index.htm');
         - URI_MODULE.renderURI(URI_MODULE.subUri.shopHost);
         *
         * error : URI_MODULE.renderURI();
         */
        exports.renderURI = function (uri, target, param, path, domain) {
            return _render(buildUrl(_getServerHost(uri, domain), target, param, path));
        }

        /**
         * render tool: domain
         * @target	[optional]pageName, just like 'index.htm'
         * @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
         * @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3'
         * @domain	[optional]domainName, just like 'tmall', default is ${exports.uri.defaultDomain}
         *
         * you can use like :
         - URI_MODULE.renderDomain('a.htm',{'a':3},'subPath','etao');
         - URI_MODULE.renderDomain('a.htm',{'a':3},'subPath');
         - URI_MODULE.renderDomain('a.htm',{'a':3});
         - URI_MODULE.renderDomain('a.htm'));
         - URI_MODULE.renderDomain();
         */
        exports.renderDomain = function(target, param, path, domain) {
            return _render(buildUrl(_getServerHost(exports.subUri.index, domain), target, param, path));
        }

        /**
         * render tool: server
         * @target	[optional]pageName, just like 'index.htm'
         * @param	[optional]json value, url param, just like {param1:'value1', param2:'value2'}
         * @path		[optional]url path, no need the first and the last '/', just like 'subPath1/subPath2/subPath3'
         * @server	[must]base url, like 'http://www.taobao.com/juhuasuan'
         *
         * you can use like :
         - URI_MODULE.renderServer('detail.htm',{'id':3},'s1/s2','http://m.etao.com');
         - URI_MODULE.renderServer('detail.htm',{'id':3},'','http://m.etao.com/s1/s2');
         - URI_MODULE.renderServer('detail.htm',{},'','http://m.etao.com');
         - URI_MODULE.renderServer('',{},'','http://m.etao.com');
         *
         * error : URI_MODULE.renderServer('detail.htm',{'id':3},'s1/s2');
         */
        exports.renderServer = function(target, param, path, server) {
            return _render(buildUrl(server, target, param, path));
        }

        // encode
        exports.encode = function(v) { return encodeURI(v); }

        // getStrParamFromJson
        exports.getStrParamFromJson = function (j) { return _getJsonStr(j); }

        // createURI for extends
        exports.createURI = function(name) {
            if (name === 'home') {
                return exports.uri.protocol + exports._serverHost;
            }else{
                return exports.uri.protocol + name + '.' + exports._serverHost;
            }
        }

        // ~~~ exportsort function end ~~~ //

        // --- private _method begin ---

        // add default queryString to url
        function _render (url) {
            if (null != exports.ttQueryStr && '' != exports.ttQueryStr)
            {
                var m = url.match("\\.[a-zA-Z]+\\?");
                if (null != m && 0 < m.length)
                {
                    if (url.indexOf('?') == (url.length-1))
                    {
                        url = url + exports.ttQueryStr;
                    } else {
                        url = url + '&' + exports.ttQueryStr;
                    }
                } else {
                    url = url + '?' + exports.ttQueryStr;
                }

                //console.log("render:",url);
            }

            return url;
        }

        // build url
        function buildUrl (base, target, param, folder) {
            if (!_checkIsBlank(folder)) {
                base += ('/' + folder);
            }

            if (!_checkIsBlank(target))
            {
                base += ('/' + target);
            }

            var havParam = false;
            if (null != param)
            {
                for (var k in param)
                {
                    if (null != param[k])
                    {
                        havParam = true;
                        break;
                    }
                }
            }

            if (havParam)
            {
                base += ('?' + _getJsonStr(param));
            }
            return base;
        }

        // check domain is ok or not
        function _checkDomain (domain) {
            if (_checkIsBlank(domain))
            {
                return false;
            }

            for (var i=0;i<_domainWhiteList.length;i++)
            {
                if (_domainWhiteList[i].toLowerCase() == domain.toLowerCase())
                {
                    return true;
                }
            }

            return false;
        }

        function _checkIsBlank(s) {
            return tbh5.checkIsBlank(s);
        }

        // get server host, replace ${PlaceHolder} with domain
        function _getServerHost(host, domain) {
            return host.replace(_Domainholder, function(){
                if (!_checkDomain(domain))
                {
                    return exports.uri.defaultDomain;
                } else {
                    return domain;
                }
            });
        }

        // change json object to json string
        function _getJsonStr (j) {
            var s = '';
            if (null == j)
            {
                return s;
            }

            for (var k in j)
            {
                if (null !=j[k] && ''!= j[k])
                {
                    s += (k + '=' + encodeURIComponent(j[k]) + '&');
                }
            }

            if (''!=s && (s.length-1) == s.lastIndexOf('&'))
            {
                s = s.substr(0, s.length-1);
            }

            return s;
        }

        // --- private method end --- //
        return exports;

    }

    function mtop_h5() {

        var exports = {};
        // require module

        var tbh5 = h5_base(),
            utils = h5_utils(),
            uri = uri_link();
        // app key is stored pre step, for example : loading page
        var app_key_id = 'J_app_key';
        var apiType = 'h5Api.do';

        // ~~~ public method begin ~~~

        /**
         * get first token
         * @v            : version ,default is '1.0'
         * @successback    : success method
         * @errorback    : error method
         */
        exports.getFirstToken = function (v, successback, errorback) {
            var extParam = {};
            extParam.api = 'mtop.auth.h5.getFirstToken2';
            extParam.v = v || "1.0";
            extParam.appKey = document.getElementById(app_key_id).value;
            extParam.t = (new Date()).getTime();
            //get URL
            var firstTokenUrl = _addJsonParam(uri.renderURI(uri.createURI('api'), apiType, extParam, 'rest'));

            //	console.log('getFirstToken:firstTokenUrl='+firstTokenUrl);

            $.ajax({
                type: 'GET',
                url: firstTokenUrl,
                timeout: 10000,
                success: function (result) {
                    var ret = (result.ret ? result.ret : "").toString();
                    if (-1 != ret.indexOf('SUCCESS::')) {
                        _saveNewToken(result);
                    }
                    // callback
                    if (successback) {
                        successback(result);
                    }
                },
                error: function (error) {
                    //	console.log('getFirstToken ajax error.');
                    if (errorback) {
                        errorback(error);
                    }
                },
                complete: function (xhr, status) {
                    if (status != 'success' && errorback) {
                        errorback(status);
                    }
                }
            });
        }

        /**
         *H5 mtop 接口
         * 主流程：
         * 1、判断本地token是否存在或是否超时；如是则调用getFirstToken获取token，然后调用业务接口
         * 否则直接调用业务接口
         * 2、如果业务接口调用失败，清除本地token，返回失败
         *
         */
        exports.getApi = function (api, v, data, extParam, callback, errorback) {

            extParam.api = api;
            extParam.v = v || "*";
            extParam.data = typeof (data) == "string" ? data : JSON.stringify(data);

            var url = uri.renderURI(uri.createURI('api'), apiType, extParam, 'rest');

            var app_key = document.getElementById(app_key_id).value;

            //     console.log("request url="+url);
            //判断是否调用取得firstToken
            if (_isgetFirstToken()) {
                // no token , to error page
                //        console.log('need invoke getFirstToken');
                exports.getFirstToken('1.0',
                    function (result) {
                        var ret = (result.ret ? result.ret : "").toString();
                        //如果成功发送请求
                        if (-1 != ret.indexOf('SUCCESS::')) {
                            //invoke biz api,直接使用返回结果的token
                            _send(url, app_key, result.data.token.token, extParam.data, callback, errorback);
                        }
                        else {
                            if (callback) {
                                callback(result);
                            }
                        }
                    },
                    //错误直接向上抛
                    function (error) {
                        if (errorback) {
                            errorback(error);
                        }
                        //           console.log('get first token fail!');
                    });
            }
            else {
                //invoke biz api
                _send(url, app_key, tbh5.get(tbh5.appToken), extParam.data, callback, errorback);

            }
        }

        // ~~~ public method end ~~~

        // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---//

        // ~~~ private method begin ~~~
        /**
         * 判断是否调用取得token接口
         */
        var _isgetFirstToken = function () {
            var app_token = tbh5.get(tbh5.appToken);
            if (tbh5.checkIsBlank(app_token)) {
                return true;
            }
            else {
                var app_token_expired = parseInt(tbh5.get(tbh5.appTokenExpired) || '0');
                var app_token_between = parseInt(tbh5.get(tbh5.appTokenBetween) || '0');
                var appTokenSaveTime = parseInt(tbh5.get(tbh5.appTokenSaveTime) || '0');
                var currentTime = (new Date()).getTime();
                //本地token超时1分钟，或者服务端token 超时1分钟
                if ((currentTime - appTokenSaveTime ) > 60000 || (app_token_expired - currentTime + app_token_between) < 60000) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }

        /**
         * 发送业务请求
         * 1、如果返回超时会清楚localStoary
         *
         */
        var _send = function (url, app_key, app_token, data, callback, errorback) {
            url = _createSignUrl(url, app_key, app_token, data);
            //		console.log('use token send : ' + app_token+";url="+url);
            $.ajax({
                type: 'GET',
                url: url,
                timeout: 10000,
                success: function (result) {
                    // if token is expired, low percent event.
                    var ret = (result.ret ? result.ret : "").toString();
                    //if(-1 != ret.indexOf('TOKEN_EXOIRED::')  || -1 != ret.indexOf('ILLEGAL_REFRESH_TOKEN')) {
                    //fail ,remove token
                    if (-1 == ret.indexOf('SUCCESS')) {
                        tbh5.removeToken();
                    }
                    if (callback) {
                        callback(result);
                    }
                },
                error: function (error) {
                    if (errorback) {
                        errorback(error);
                    }
                },
                complete: function (xhr, status) {
                    if (status != 'success' && errorback) {
                        errorback(status);
                    }
                }
            });
        }

        var _createSignUrl = function (url, app_key, app_token, data) {
            var t = (new Date()).getTime();
            return _addJsonParam(url) + '&appKey=' + app_key + '&sign=' + _sign(app_key, app_token, t, data) + '&t=' + t;
        }

        var _addJsonParam = function (url) {
            if (-1 == url.indexOf('callback=')) {
                var index = url.indexOf('?');
                return url.substr(0, index) + '?callback=?&type=jsonp&' + url.substr(index + 1, url.length);
            }
            else {
                return url;
            }
        }

        var _sign = function (app_key, app_token, t, data) {
            var signTemp = app_token + '&' + t + "&" + app_key + "&" + data;

            return utils.MD5(signTemp);
        }


        var _saveNewToken = function (r) {
            var newToken = r.data.token.token;
            var newTokenExpired = parseInt(r.data.token.createTime || '0') + (parseInt(r.data.token.lifetime || '0') * 1000);
            var newTokenCreate = parseInt(r.data.token.createTime || '0');
            var refreToken = r.data.token.refreshToken;

            var currentTime = (new Date()).getTime();
            var newTokenBetween = tbh5.getBetweenTime(newTokenCreate);

            if (!tbh5.checkIsBlank(newToken) && newTokenExpired > (currentTime - newTokenBetween)) {
                try {
                    tbh5.set(tbh5.appToken, newToken);
                    //tbh5.set(tbh5.appRefreshToken, refreToken); //not need
                    tbh5.set(tbh5.appTokenExpired, newTokenExpired);
                    tbh5.set(tbh5.appTokenBetween, newTokenBetween);
                    tbh5.set(tbh5.appTokenSaveTime, currentTime);

                    if (tbh5.get(tbh5.appToken) == newToken) {
                        return newToken;
                    }
                } catch (e) {
                    return null;
                }
            } else {
                return null;
            }
        }

        return exports;
    }



    function _checkSysType() {
        var _checkSysType = 'm';
        if (window.location.host == 'localhost' || window.location.host.match('.*\\waptest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
            _checkSysType = 'waptest';
        } else if (window.location.host.match('.*\\wapa\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
            _checkSysType = 'wapa';
        }
        else if (window.location.host.match('.*\\m\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
            _checkSysType = 'm';
        }
        return _checkSysType;
    }
    app.mtopH5 = mtop_h5();
    app.uriSysType = _checkSysType();

})(window['app']);