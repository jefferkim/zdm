/**
 * cookie get、del
 *
 */


    /**
     * 判断浏览器是否能使用cookie
     */

function h5Cookie(){

    var exports = {};

    exports.isCookieEnable = function() {
      if(!window.navigator.cookieEnabled)
            return false;
        var key = '_s_cookie_';
        this.setCookie(key,'1');
        var v = this.getCookie(key);
        if(v == '1') {
            this.delCookie(key);
            return true;
        }
        return false;
    }
    /**
     * get cookieVauel
     */
    exports.getCookieVal = function(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if(endstr == -1)
            endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr));
    }
    /**
     * getCookie
     * if not exist ,return null
     */
    exports.getCookie = function(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while(i < clen) {
            var j = i + alen;
            if(document.cookie.substring(i, j) == arg)
                return this.getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if(i == 0)
                break;
        }
        return null;
    }
    /**
     * 将cookie设置到taobao域下
     */
    exports.setCookie = function(key, value) {
        var host = window.location.host;
        var index = host.indexOf(".");
        var subDomain = host.substring(0, index);
        if(subDomain != 'waptest' && subDomain != 'wapa' && subDomain != 'm' && (host.indexOf("taobao") > -1 || host.indexOf("tmall") > -1)) {
            host = host.substr(index + 1);
        }
        var expires = (arguments.length > 2) ? arguments[2] : null;
        if(expires == null) {
            document.cookie = key + "=" + escape(value) + ";path=/;domain=" + host;
        } else {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() + (expires * 1000 ));
            document.cookie = key + "=" + escape(value) + ";path=/;domain=" + host + ";expires=" + expdate.toGMTString();
        }

    }

    exports.delCookie = function(name)
    //删除Cookie
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    }


    return exports;

}

    


