(function (app, undef) {

    var win = window,
        isAndroid = (/android/gi).test(navigator.appVersion),
        resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    app.Util = {

        Events:function (el, events) {
            var self = this;
            $(el).unbind();
            for (var key in events) {
                var method = this[events[key]];
                if (!method) throw new Error('Event "' + events[key] + '" does not exist');
                var match = key.match(/^(\S+)\s*(.*)$/);
                var eventName = match[1], selector = match[2];
                if (selector === '') {
                    return;
                } else {
                    $(el).on(eventName, selector, (function(method) {
                        return function(e) {
                            method.call(self, e , this);
                        }
                    })(method));
                }
            }
        },

        getWebpImg : function(url,size){  //处理图片后缀
            if(!url) return;
            size = ['_' , (size || '300x300') , '.jpg'].join('');
            /*var arr = url.split('_.'),
             src = arr[0].replace(/_\d+x\d+\.jpg?/g,''),  //去掉存在的后缀_100x100.jpg
             suffix = arr[1],
             isWebp = suffix && suffix.toLowerCase() == 'webp';
             src += size;
             return isWebp && (src + '_.webp') || src;*/
            var arr = url.lastIndexOf('_.'),  //查找最后一个，url中可能存在_.
                last = arr != -1 ? url.slice(arr+2) : null,  //取到_.后的字符串
                isWebp = last && last.toLowerCase() == 'webp' ? true : false,  //是否webp
                newurl = isWebp ? url.slice(0,arr) : url,
                src = newurl.replace(/_\d+x\d+\.jpg?/g,'');  //去掉存在的后缀_100x100.jpg
            src += size;
            return isWebp && (src + '_.webp') || src;
        },


        timeout : 30000,
        resize : function(callback){  //旋转
            win.addEventListener(resize,function(){
                setTimeout(function(){
                    callback();
                },isAndroid ? 200 : 0);
            },false);
        },
        getActualSize : function(el,callback){  //获取el真实宽高
            el.css({'position':'absolute','width':'100%','left':-20000,'top':-20000}).removeClass('none');
            callback();
            el.css({'position':'static','width':'auto','left':0,'top':0}).addClass('none');
        },
        encode : function(str){
            return encodeURIComponent(str);
        },
        sendPoint : function(pds){  //埋点
            /*var beacon = new Image();
             beacon.src = logURL + '?pds=' + pds;
             beacon.onload = beacon.onerror = function(){
             beacon.onload = beacon.onerror = null;
             beacon = null;
             }*/
            var host = this.fetchHost(),
                logURL = 'http://a.'+host+'.taobao.com/ajax/pds.do';
            $.ajax({
                url : logURL,
                type : "get",
                dataType : 'jsonp',
                data : { pds : pds , t:new Date().getTime()}
            });
        },


        storage : {
            get : function(key){
                try{
                    return localStorage.getItem(key);

                }catch(e){
                    return null;
                }
            },
            set : function(key,value){
                try{
                    localStorage.setItem(key,value);
                }catch(e){
                    console.log('localstorage异常');
                }
            }
        },
        pointJudge : function(str){  //宝贝积分判断
            if(!str) return str;
            var tarr = str.split('-');
            return (tarr.length > 1 && tarr[0] == tarr[1]) ? tarr[0] : str;
        }


    }

    app.ZDMData = {};
    app.ZDMDetail = {}; //global data for zdm detail
    app.helper = {};

})(window['app']);