


    var PageNav = function Page(options) {
        this.init(options);
    }

    PageNav.prototype = {
        setIndex:function (pageIndex) {
            var _self = this;
            pageIndex = Number(pageIndex);
            if (isNaN(pageIndex)) {
                pageIndex = 1;
            }
            if (pageIndex > _self.pageCount) {
                pageIndex = _self.pageCount;
            }
            if (pageIndex <= 0) {
                pageIndex = 1;
            }
            _self.index = pageIndex;
            _self.renderPage();
        },
        init:function (options) {
            if (!this.$container) {
                this.$container = $(options.id);
            }
            this.index = Number(options.index ? options.index : 1);
            this.pageCount = Number(options.pageCount ? options.pageCount : 1);
            this.preFix = options.preFix ? options.preFix : '!page/';
            this.objId = options.objId ? options.objId : 'Z';    //单页面单控件显示'Z'
            this.disableHash = options.disableHash//hash不变功能支持
            this.oldIndex = -1;                 //避免部分android机器select相同选择也会触发change事件
            var length = this.preFix.toString().length;
            if (this.preFix[length - 1] != '/') {
                this.preFix += '/';
            }

            if (isNaN(this.index)) {
                this.index = 1;
            }
            if (this.index > this.pageCount) {
                this.index = this.pageCount;
            }
            if (this.index <= 0) {
                this.index = 1;
            }
            this.createDom();
            this.eventAttach();
            this.parseHash();
            this.renderPage();

        },
        parseHash:function () {
            //获取hash(一个页面多个分页控件)
            var _self = this,
                hashValue = location.hash,
                currHash = hashValue.substr(hashValue.lastIndexOf('/') + 1),
                hashArr = [],
                index = 0,
                mixArr = [];

            hashArr = currHash.split('-');

            for (var i = 0; i < hashArr.length; i++) {
                mixArr = hashArr[i].split('');
                var objId = mixArr.shift();
                if (objId == this.objId) {
                    index = Number(mixArr.join(''));
                    if (isNaN(index) || index <= 0) {
                        _self.index = 1;
                    }
                    if (index > _self.pageCount) {
                        _self.index = _self.pageCount;
                    }

                    _self.index = index;
                }
            }
        },
        setContainer:function (containerId) {
            this.$container = $(containerId);
        },
        getObjId:function () {
            return this.objId;
        },
        changeHash:function () {
            var _self = this,
                hashVal = location.hash;
            if (hashVal == '') {
                location.hash = _self.preFix + '-' + _self.objId + _self.index;
            }
            else {
                var begin = hashVal.lastIndexOf(_self.objId),
                    end = begin;
                if (begin == -1) {
                    location.hash += '-' + _self.objId + _self.index;
                }
                else {
                    while (true) {
                        end++;
                        if (hashVal[end] == '-' || !hashVal[end]) break;
                    }
                    hashVal = hashVal.replace(hashVal.substring(begin, end), _self.objId + _self.index);
                    location.hash = hashVal;
                }
            }
        },
        createDom:function () {

            var _self = this;
            _self.$container.empty();
            var htmlArr = [
                '<section class="c-p-sec">',
                '<div class="c-p-pre">',
                '<span class="c-p-p">',
                '<em></em>',
                '</span><a>上一页</a>',
                '</div>',
                '<div class="c-p-cur">',
                '<div class="c-p-arrow c-p-down"><span></span><span></span></div>',
                '<select class="c-p-select">',
                '</select></div>',
                '<div class="c-p-next">',
                '<a>下一页</a><span class="c-p-p">',
                '<em></em>',
                '</span>',
                '</div>',
                '</section>'
            ];
            _self.$container.html(htmlArr.join(''));

            $('select', _self.$container).empty();
            htmlArr = [];
            for (var index = 1; index <= _self.pageCount; index++) {
                htmlArr[index - 1] = '<option>第' + index + '页</option>';
            }
            $('select', _self.$container).append(htmlArr.join(''));

        },
        renderPage:function () {
            var _self = this,
                selectLen = $('option', _self.$container).length ,
                $lastPage = $('.c-p-pre', _self.$container),
                $nextPage = $('.c-p-next', _self.$container);

            if (selectLen <= 1) {
                $lastPage.addClass('c-p-grey');
                $nextPage.addClass('c-p-grey');
                selectLen = 1;
            }
            else {
                if (_self.index == 1) {
                    $lastPage.addClass('c-p-grey');
                    if (selectLen > 1) {
                        $nextPage.removeClass('c-p-grey');
                    }
                }
                else if (_self.index == selectLen) {
                    $nextPage.addClass('c-p-grey');
                    if (selectLen > 1) {
                        $lastPage.removeClass('c-p-grey');
                    }
                }
                else {
                    if (_self.index > 1 && _self.index < selectLen) {
                        $lastPage.removeClass('c-p-grey');
                        $nextPage.removeClass('c-p-grey');
                    }
                }
            }

            var pageText = _self.index + '/' + selectLen;
            $('.c-p-arrow span:first-child', _self.$container).text(pageText);
            $('select', _self.$container).get(0).selectedIndex = this.index - 1;

            $lastPage = null;
            $nextPage = null;
        },
        //解绑定完全可以有更优雅的方式，涉及应用有点多，挫了。。。
        eventDetach:function () {
            var _self = this,
                $$container = $(_self.$container);
            //Modify arrow.
            $$container.undelegate('select', 'mousedown', _self.modifyArr);

            $$container.undelegate('select', 'blur', _self.blur);

            //last page
            //此种方式修改为了修复ios下的焦点反馈变大问题。改动最小。。
            $$container.find('.c-p-pre').undelegate('a', 'click', _self.lastPage);

            //next page
            $$container.find('.c-p-next').undelegate('a', 'click', _self.nextPage);

            //select change.
            $$container.undelegate('select', 'change', _self.selectChange);

            $$container = null;
        },
        eventAttach:function () {
            var _self = this,
                $$container = $(_self.$container);
            //Modify arrow.
            $$container.delegate('select', 'mousedown', _self.modifyArr = function (e) {
                //修改箭头
                $('.c-p-arrow', _self.$container).removeClass('c-p-down').addClass('c-p-up');
            });

            $$container.delegate('select', 'blur', _self.blur = function (e) {
                //修改箭头
                $('.c-p-arrow', _self.$container).removeClass('c-p-up').addClass('c-p-down');
            });

            //last page
            $$container.find('.c-p-pre').delegate('a', 'click', _self.lastPage = function (e) {
                e.preventDefault();

                if ($(this).parent().hasClass('c-p-grey')) {
                    return false;
                }
                else {
                    _self.index--;
                    _self.renderPage();

                    if (!_self.disableHash) {
                        //锚点
                        _self.changeHash();
                    }
                    else {
                        _self.$container.trigger('P:switchPage', {index:_self.index,type:'pre'});
                    }
                }

                _self.oldIndex = _self.index;

            });

            //next page
            $$container.find('.c-p-next').delegate('a','click', _self.nextPage = function (e) {
                e.preventDefault();

                if ($(this).parent().hasClass('c-p-grey')) {
                    return false;
                }
                else {
                    _self.index++;
                    _self.renderPage();


                    if (!_self.disableHash) {
                        //锚点
                        _self.changeHash();
                    }
                    else {
                        _self.$container.trigger('P:switchPage', {index:_self.index,type:'next'});
                    }
                }
                _self.oldIndex = _self.index;
            });

            //select change.
            $$container.delegate('select', 'change', _self.selectChange = function () {
                _self.index = $(this).get(0).selectedIndex + 1;
                if (_self.oldIndex == _self.index) {
                    return;
                }
                _self.renderPage();
                //修改箭头
                $('.c-p-arrow', _self.$container).removeClass('c-p-up').addClass('c-p-down');

                if (!_self.disableHash) {
                    //锚点
                    _self.changeHash();
                }
                else {
                    _self.$container.trigger('P:switchPage', {index:_self.index,type:'select'});
                }

                _self.oldIndex = _self.index;
            });
        },
        pContainer:function () {
            return this.$container;
        }
    };

