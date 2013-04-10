(function (app, undef) {


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
        }


    }

    app.ZDMData = {};
    app.ZDMDetail = {}; //global data for zdm detail
    app.helper = {};

})(window['app']);