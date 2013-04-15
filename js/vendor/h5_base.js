//h5 api
/**
 * localstoary 的一些操作
 */


function h5_base(){



    var exports = {};

    //paramKey
    exports.paramKey = 'h5_paramKey';
    exports.targetUrl = 'h5_targetUrl';
    //userinfoKey
    exports.userInfoKey = 'h5_userInfoKey';
    //href hash
    exports.hrefHash = '_hash';
    //last href hash
    exports.lastHash = '_lastHash';
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
     //类似于map的set方法，如果value不是string对象，会用JSON.stringify转化为string，存储到本地
    exports.set = function(key, value) {
        if(this.isSuppLocalStorage()) {
            if( typeof (value) != "string") {
                value = JSON.stringify(value);
                // JSON.parse
            };
            try{
            window.localStorage.setItem(key, value);
            return true;
            }
            catch(e)
            {

            }
        }
        return false;
    }

    exports.add = function(key, value) {
        if(this.isSuppLocalStorage()) {
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
        if(this.isSuppLocalStorage()) {
            return window.localStorage.getItem(key);
        }
        return null;
    }
    //简单的做了一个window.localStorage.getItem 映射
    exports.removeValue = function(key) {
        if(this.isSuppLocalStorage()) {
            return window.localStorage.removeItem(key);
        }
    }
    //清除所有localStorage
    exports.clearAll = function() {
        if(this.isSuppLocalStorage()) {
            return window.localStorage.clear();
        }
    }
    /**
     * 判断是否从cache中取hash
     * 如果当前请求没有hash则从localstoary中取，否则如果请求带hash保存当前hash到localstoray中
     */
    exports.userCacheHash = function(webappName) {
        //如果没有hash，从localStoray中取上一次的hash
        var key = webappName || 'h5';
        var lastKey = key + this.lastHash;
        var hashkey = key + this.hrefHash;

        if(!location.hash && this.get(hashkey)) {
            location.hash = this.get(hashkey);
            return true;
        }
        //save current hash to cache
        else if(location.hash) {
            //记录上一个hash
            if(this.get(hashkey) != location.hash)
            this.set(lastKey,this.get(hashkey) || '');
            this.set(hashkey, location.hash);
        }
        return false;
    }
    /**
     * 返回上一个hash
     */
    exports.getLastHash = function(webappName,defaultHash) {
        return this.get((webappName || 'h5') + this.lastHash) || defaultHash || '';
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
    //如果不传系统时间则返回缓存中的时间差
    exports.getBetweenTime = function(currentSeverTime) {
        if(currentSeverTime)
        {
        var betTime = (new Date()).getTime() - currentSeverTime;
        this.set(this.appTokenBetween,betTime);
        return betTime;
        }
        else
        {
        return parseInt(this.get(this.appTokenBetween) || 0 );
        }
    }

    exports.checkIsBlank = function(s) {
        return null == s || '' == s;
    }
    //判断是否登录
	/**以废弃，用h5_common 中的isLogin**/
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

	  /***
	  *判断是否客户端请求
	  * 目前判断标准是是否含有ttid参数并且参数中包含'@'字符
	  * return true or false
	  ***/
	 exports.isClient = function(){
		var ttid = this.getQueryString('ttid');

		 return ttid && ttid.indexOf('@') > -1 ;

	 }

     exports.isAndroidClient = function() {
        var ttid = this.getQueryString('ttid')
        return ttid && ttid.toLowerCase().indexOf('android') > -1
     }

    /**
     * 判断是否支持localStorage，并且开启
     * 否则返回false
     */
    exports.isSuppLocalStorage= function(){
        try
        {
        if(window.localStorage == 'undefined')
        {
            return false;
        }
        else{
            var key = 'testSupportKey';
            window.localStorage.setItem(key,'1');
            var value =  window.localStorage.getItem(key);
            window.localStorage.removeItem(key);
            return '1' == value;
        }
        }
        catch(e)
        {}
        return false;
     }

     

     return exports;
}