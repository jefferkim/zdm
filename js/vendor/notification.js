var win = $(window),

    T_float = [
        '<div class="c-float-popWrap msgMode hide">',
        '<div class="c-float-modePop">',
        '<div class="warnMsg"></div>',
        '<div class="content"></div>',
        '</div>',
        '</div>'
    ].join(''),

    E_float = $(T_float),
    E_floatMsg = E_float.find('.warnMsg'),
    E_floatContent = E_float.find('.content'),

    initDom = false,
    domContainer = '#tbh5v0',
    flashTimeoutId
    ;

function ModePop(options) {
    this._options = $.extend({
        mode:'msg',
        text:'网页提示',
        useTap:false
    }, options || {});

    this._init();
}

$.extend(ModePop.prototype, {
    _init:function () {
        var that = this,
            opt = that._options,
            mode = opt.mode,
            text = opt.text,
            content = opt.content,
            callback = opt.callback,
            background = opt.background,
            clickEvent = opt.useTap ? 'tap' : 'click';
        ;

        // set mode
        var classTxt = E_float.attr('class');
        classTxt = classTxt.replace(/(msg|alert|confirm)Mode/i, mode + 'Mode');
        E_float.attr('class', classTxt);

        // set background
        background && E_float.css('background', background);

        // set text & content
        text && E_floatMsg.html(text);
        content && E_floatContent.html(content);


        if (!initDom) {
            initDom = true;
            $(domContainer).append(E_float);            
            win.on('resize', function () {
                setTimeout(function () {
                    that._pos();
                }, 500);
            });
        }
    },

    _pos:function () {
        var that = this,
            doc = document,
            docEl = doc.documentElement,
            body = doc.body,
            top, left, cW, cH, eW, eH
            ;

        if (!that.isHide()) {
            top = body.scrollTop;
            left = body.scrollLeft;
            cW = docEl.clientWidth;
            cH = docEl.clientHeight;
            eW = E_float.width();
            eH = E_float.height();

            E_float.css({
                top:top + (cH - eH) / 2,
                left:left + (cW - eW) / 2
            });
        }
    },

    isShow:function () {
        return E_float.hasClass('show');
    },

    isHide:function () {
        return E_float.hasClass('hide');
    },

    _cbShow:function () {
        var that = this,
            opt = that._options,
            onShow = opt.onShow
            ;

        E_float.css('opacity', '1').addClass('show');
        onShow && onShow.call(that);
    },


    show:function () {
        var that = this
            ;

        if (flashTimeoutId) {
            clearTimeout(flashTimeoutId);
            flashTimeoutId = undefined;
        }

        if (!that.isShow()) {

            E_float.css('opacity', '0').removeClass('hide');
            that._pos();

            setTimeout(function () {
                that._cbShow();
            }, 300);
            setTimeout(function () {
                E_float.animate({'opacity':'1'}, 300, 'linear');
            }, 1);

        } else {
            that._cbShow();
        }
    },

    _cbHide:function () {
        var that = this,
            opt = that._options,
            onHide = opt.onHide
            ;

        E_float.css('opacity', '0').addClass('hide');
        onHide && onHide.call(that);
    },

    hide:function () {
        var that = this
            ;

        if (!that.isHide()) {
            E_float.css('opacity', '1').removeClass('show');

            setTimeout(function () {
                that._cbHide();
            }, 300);
            setTimeout(function () {
                E_float.animate({'opacity':'0'}, 300, 'linear');
            }, 1);

        } else {
            that._cbHide();
        }
    },

    flash:function (timeout) {
        var that = this
        opt = that._options
        ;

        opt.onShow = function () {
            flashTimeoutId = setTimeout(function () {
                if (flashTimeoutId) {
                    that.hide();
                }
            }, timeout);
        }

        that.show();
    }
});

window.notification = new function () {

    this.flash = function (text, bg, timeout) {
        if (arguments.length == 2) {
            if (typeof arguments[1] == 'number') {
                timeout = arguments[1];
                bg = undefined;
            }
        }

        var pop = new ModePop({
            mode:'msg',
            text:text,
            background:bg
        });

        pop.flash(timeout || 2000);
        return pop;
    }


};
