/**
 * 一些通用方法，如跳转到登录页面
 * 
 * 
 * 
 */
function h5_common(){

    var exports = {};

    var uriBroker1    =  uriBroker();
    var    tbh5         =  h5_base(),
        tbcookie     = h5Cookie();

    /**
     * redirect to login
     * targetPath is configied at uriBroker
     * e.g:
     * toLogin('fav')
     *
     */
    var toLogin   =   function(targetPath){
        var redirectURL = uriBroker1.getUrl(targetPath);
        window.location.href = uriBroker1.getUrl('login',{'tpl_redirect_url':redirectURL});
    }

    var toTarget = function(targetPath) {
        if(targetPath && targetPath!='undefined')
        {
            window.location.href = uriBroker1.getUrl(targetPath);
        }
        window.location.href = 'http://m.taobao.com';
    }

    /**
     * deal common response
     * if back success ,callback seccussHandle
     *
     */
    exports.dealResponse = function(resp,seccussHandle,bizErrorHandle,targetPath,defaultPath,orginalResp)
    {
        var ret = resp.ret.toString().toUpperCase();

        if(ret.indexOf('SUCCESS::') > -1)
        {
            seccussHandle(resp);
        }
        //need login
        else
        {
            //set href hash to localStoary
            tbh5.set(tbh5.hrefHash,window.location.hash);
            //判断是否需要登录
            if(ret.indexOf('FAIL_SYS_SESSION_EXPIRED') > -1 || ret.indexOf('NEED_LOGIN::') > -1 || ret.indexOf('-100::') > -1 || ret.indexOf('NOT_FOUNT_USER::') > -1 || ret.indexOf('ERR_SID_INVALID::') > -1  || ret.indexOf('SID_ERROR::') > -1  )
            {
                //
                if(targetPath)
                {
                    toLogin(targetPath) ;
                }
                //redirect index
                else{
                    toLogin('home') ;
                }
            }
            else if(ret.indexOf('ILLEGAL_REQUEST::') > -1 || ret.indexOf('ILLEGAL_SIGN::') > -1) {
                if(!addRequestFailedTimes()) {
                    toTarget(defaultPath) ;
                }
                else if(bizErrorHandle)
                {
                    bizErrorHandle(orginalResp ? resp : ret);
                }
            }
            else if(bizErrorHandle)
            {
                bizErrorHandle(orginalResp ? resp : ret);
            }
        }
    }

    var addRequestFailedTimes = function () {
        var times = parseInt(tbh5.get(tbh5.appRequestFailed) || '0');
        if (3 <= times) {
            window.location.href = 'http://m.taobao.com?t=3';
            return true;
        }
        times += 1;
        tbh5.set(tbh5.appRequestFailed, times);
        return false;
    }

    /**
     * decide wether support my h5 application
     * currently,just determine localStorage and applicationCache
     * e.g:
     * isSupportH5
     */
    exports.isSupportH5   = function(){
        if(window.localStorage == 'undefined')
        {
            return false;
        }
        else if(window.applicationCache == 'undefined')
        {
            return false;
        }
        return true;
    }

    /**
     * 从cookie中获取用户nick
     *  未登录时返回空
     */
    exports.getNickFromCookie  = function(){
        var userNick = tbcookie.getCookie('_w_tb_nick');
        if (userNick && userNick.length > 2  && userNick != 'null')
        {
            return userNick;
        }
        return '';
    }

    /**
     * 从隐藏域获取nick
     * @return {*}
     */
    exports.getNickFromHidden  = function(){
        var userNick =$('#J_user_nick').val();
        if (userNick)
        {
            return userNick;
        }
        return '';
    }

    /**
     * 判断用户是否登录
     * 通过cookie中的标示判断
     */
    exports.isLogin  = function(){

        var imewweoriw = tbcookie.getCookie('imewweoriw');

        return imewweoriw && decodeURIComponent(imewweoriw).length > 32 ;

        /**
         var userNick = this.getNickFromCookie() ;
         if(userNick && userNick != '')
         {
         return true;
         }
         else
         {
         return false;
         }
         **/
    }

    /**
     * 跳转登录
     * @param targetPath
     */
    exports.goLogin   =   function(targetPath){

        targetPath = targetPath || 'home';
        toLogin(targetPath) ;
    }
    exports.isSuppWebp = function(){
        return 'true' == tbcookie.getCookie('supportWebp') ;
    }


    return exports;
}

