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
        }


    }

    app.ZDMData = {};
    app.ZDMDetail = {}; //global data for zdm detail
    app.helper = {};

})(window['app']);