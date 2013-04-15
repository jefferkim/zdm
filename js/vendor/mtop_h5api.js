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


function mtop_h5api(){

    // require module
    var exports = {},
        cookie = h5Cookie(),
        utils = h5_utils(),
        h5base = h5_base(),
        uri = h5Uri(),
        app_key_id = 'J_app_key',
       apiType = 'h5ApiUpdate.do',     /// why
    //    apiType = 'h5Api.do'
        tokenKey = "_m_h5_tk",
        mtopH5Chunk = mtop_h5_chunk(),
        chunkApiType = 'bigPipe.do',
        failTimes = 0,
        maxFailTimes = 5,
        isOnExcute = false;
        callQue=[];
    // ~~~ public method begin ~~~
   /**
     *H5 mtop 接口
     * 主流程：
     * 1、如果业务接口调用失败，返回token为空或失效会在发送一次请求，同时失败次数增加1次，最大失败5次，成功后清理
    *  2、
     *
     */
    exports.getApi = function (api, v, data, extParam, callback, errorback) {
        var isChunk = ( data && !!data.apis);
        //chunk request,add by wuzhong +2013.2.27
        if (isChunk) {
            extParam.entrance = "h5";
            extParam.apis = typeof (data.apis) == "string" ? data.apis : JSON.stringify(data.apis);
        } else {
            extParam.api = api;
            extParam.v = v || "*";
            extParam.data = typeof (data) == "string" ? data : JSON.stringify(data);
        }
        var url = uri.renderURI(uri.createURI('api'), isChunk ? chunkApiType : apiType, extParam, 'rest');
        //目前对于非客户端请求统一用h5的ttid，等服务端修改后删除这个
        /**********************start*********************/
        var ttid = h5base.getQueryString('ttid');
        if (ttid && ttid.indexOf('@') == -1 )
        {
            url = url.replace(/ttid=[^&]+/,'ttid=taobao_h5_1.0.0') ;
        }
        else if(!ttid)
        {
            url = url + '&ttid=taobao_h5_1.0.0'  ;
        }
        /**********************end*********************/


        //线上要走9999端口
        ( 0 == url.indexOf("http://api.m.taobao.com" && isChunk)) && (url = url.replace("taobao.com", "taobao.com:9999"));
        var app_key = document.getElementById(app_key_id).value;
         callQue.push({url:url, app_key:app_key, data:extParam.data,callback:callback,errorback:errorback});
         if(!isOnExcute)
         {
          isOnExcute=true;
          exceutCall();
         }
    }


    /**
     * 发送业务请求
     * 1、如果返回超时会清楚localStoary
     *
     */
    var _send = function (url, app_key, data, callback, errorback) {
        var app_token = (cookie.getCookie(tokenKey) || '').split('_')[0];
     //   console.log(cookie.getCookie(tokenKey) + "|"+cookie.getCookie(tokenKey+"_enc"));
      //   app_token ='cf84fac3e1bd03f673e5436461607e8e';

        var sendUrl = _createSignUrl(url, app_key, app_token, data);
        //		console.log('use token send : ' + app_token+";url="+url);
        var options = {
            type:'GET',
            url:sendUrl,
            timeout:20000,
            success:function (result) {
                // if token is expired, low percent event.
                var ret = (result.ret ? result.ret : "").toString();
                //如果是token过期重新发送请求
                //如果成功failTimes为0
                if(-1 != ret.indexOf('SUCCESS::'))
                {
                    failTimes = 0;
                }
                else
                {
                if(-1 != ret.indexOf('TOKEN_EMPTY::')  || -1 != ret.indexOf('TOKEN_EXOIRED::')) {
                  if(failTimes < maxFailTimes)
                    {
                      _send(url, app_key,  data, callback, errorback);
                      return ;
                    }
                    else
                    {
                        cookie.delCookie(tokenKey);
                        console.log('try exceed times');
                    }
                }
                }
                if (callback) {
                    callback(result);
                }
                exceutCall();

            },
            error:function (error) {
                if (errorback) {
                    errorback(error);
                }
                exceutCall();
            },
            complete:function (xhr, status) {
                if (status != 'success' && errorback) {
                    errorback(status);
                }
                exceutCall();
            }
        };
        (isBigPipeRequest(url) ) ? mtopH5Chunk.chunkAjax(options) : $.ajax(options);
    }

    /**
     *执行队列方法
     */
    var exceutCall = function(){
        if(callQue.length > 0 )
        {
            var param = callQue.pop(0);
            _send(param.url, param.app_key,  param.data, param.callback, param.errorback);
        }
        else
      {
       isOnExcute=false;
      }

    }

    var _createSignUrl = function (url, app_key, app_token, data) {
        var t = (new Date()).getTime();
        return _addJsonParam(url) + '&appKey=' + app_key + '&sign=' + _sign(app_key, app_token, t, data)+  '&t=' + t;
    }

    var _addJsonParam = function (url) {
        if (-1 == url.indexOf('callback=') && !isBigPipeRequest(url)) {
            var index = url.indexOf('?');
            return url.substr(0, index) + '?callback=?&type=jsonp&' + url.substr(index + 1, url.length);
        }
        else {
            return url;
        }
    }

    var _sign = function (app_key, app_token, t, data) {
       /**
        app_token='1a28b3ff2654ed91e22f9184c25f2b89'
        t=1362568219069;
        app_key=4272;
        data='{"curPage":1,"pageSize":5,"order":"fans"}';
        **/
        var signTemp = app_token + '&' + t + "&" + app_key + "&" + data;
       //  console.log('原串：'+signTemp);
        signTemp = utils.MD5(signTemp);
       // console.log('签名串：'+signTemp);
         return signTemp;
    }

    exports.addApi = function (api, v, data, extParam, callback, errorback) {
        var ApiReq = {
            apis:[
                {api:api, v:v, data:data}
            ],
            succ:{}, error:{},
            addApi:function (api, v, data, extParam, callback, errorback) {
                this.apis.push({api:api, v:v, data:data});
                this.succ[api] = callback;
                this.error[api] = errorback;
                return this;
            },
            execute:function (xhr2) {
         //       console.log(this);
                function jsonpApi(oneApi) {
                    exports.getApi(oneApi.api, oneApi.v, oneApi.data, {}, this.succ[oneApi.api], this.error[oneApi.api]);
                }

                //如果是xhr2
                if (xhr2 && mtopH5Chunk.isXhr2()) {
                    if (1 == this.apis.length) {
                        jsonpApi.call(this, this.apis[0]);
                    } else {
                        var self = this;
                        exports.getApi("", "", {apis : self.apis}, {}, function (result) {
                            result.api && self.error[result.api] && self.error[result.api].call(this, result);
                        }, function (result) {
                            result.api && self.error[result.api] && self.error[result.api].call(this, result);
                        });
                    }
                } else {
                    //走老的api方式!
                    var self = this;
                    this.apis.forEach(function (oneApi) {
                        jsonpApi.call(self, oneApi);
                    });
                }

            }
        };
        ApiReq.succ[api] = callback;
        ApiReq.error[api] = errorback;
        return ApiReq;
    }
    // ~~~ public method end ~~~
    // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---//
    function isBigPipeRequest(url) {
        return url.indexOf("bigPipe.do?") > 0;
    }

    return exports;


}



(function(app,undefined){

    app.mtopH5Api = mtop_h5api();

})(window['app']);



