(function (app, undef) {

    var comment = app.page.define({
        name:"comment",
        title:'评论', //title bar的文案
        route:"comment\/(P<id>\\d+)",
        templates:{
            "commetAllLayout":JST['template/detail_commentAllLayout'],
            "commentItem":JST['template/comment']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'宝贝详情'
            }
        ],


        /*TODO:后期再处理cache逻辑*/

        ready:function () {
            // implement super.ready
            var self = this;

            this.itemId = app.navigation.getParameter("id");

            var content = $(app.component.getActiveContent());
            var id = app.navigation.getParameter("id");
            var pageNo = app.navigation.getParameter("pageNo");
            var host = app.helper.fetchHost();

            content.html(this.templates['commetAllLayout']());

            //delegate events
            app.Util.Events.call(this, "#J_commentCont", this.events);

            this.typeg = 'good';
            this.url = 'http://a.' + host + '.taobao.com/ajax/rate_list.do';
            this.isFirst = true;
            this.tabCache = {
                "good":{first:true, second:1, page:1, total:0, sel:null, list:[]}, //second由于评论接口总页数出现问题，需要二次请求才正确
                "ok":{first:true, second:1, page:1, total:0, sel:null, list:[]},
                "bad":{first:true, second:1, page:1, total:0, sel:null, list:[]},
                "addto":{first:true, second:1, page:1, total:0, sel:null, list:[]}
            };

            this.fetch(id, pageNo);
        },


        events:{
            'click #J_commtab li':'tabClick'
        },

        typeMap:{
            "good":"1",
            "ok":"0",
            "bad":"-1",
            "addto":"2"
        },

        typePonit:{  //埋点数据
            "good":"saygood#h#detail",
            "ok":"saynormal#h#detail",
            "bad":"saybad#h#detail",
            "addto":"addsay#h#detail"
        },

        tabClick:function (e) {

            e.preventDefault();

            scrollTo(0, 0);
            var that = this,
                target = $(e.currentTarget);

            if (target.hasClass('cur')) {
                return;
            }
            that.curLi || (that.curLi = target.parent().find('li.cur'));
            target.addClass('cur');
            that.curLi.removeClass('cur');
            that.curLi = target;
       //     var tabCache = that.tabCache[that.typeg],
        //       tsel = tabCache.sel;
       //     tsel && tsel.addClass('none');

            that.typeg = target.attr('s');
            var curCache = that.tabCache[that.typeg];
            curCache.total && that.pagebar.removeClass('none') || that.pagebar.addClass('none');  //页码显示和隐藏
            curCache.first = true;
            that.getData();
            utils.sendPoint(that.typePonit[that.typeg]);
            //});
        },
        render:function (json, n) {
            var that = this;
            var cache = that.tabCache[that.typeg];
            var htmldom = that.templates['commentItem'](json);
            console.log(htmldom);

            $('#J-detailCommentListAll').html(htmldom);


      //      if (that.isFirst) {  //only once


                that.contbar || (that.contbar = $('#J_commcont'));
                that.loading || (that.loading = $('#J_listload'));
                that.pagebar || (that.pagebar = $('#J_dcpage'));
           //     json.items && json.items.length || that.contbar.append(ul);
                //  open.loadHide();
        //    }
   //         cache.sel && cache.sel.addClass('none');
         //   cache.list[n] = ul;
         //   cache.sel = ul;
            that.loading.addClass('none');
       //     that.isFirst || that.contbar.append(ul);
        },



        fetch:function (id, page) {


            var that = this;
            if (!id) {
                return;
            }
            that.itemId = id;
            that.xhr && that.xhr.abort();
            page = page || 1;
            var url = that.url;
            var isContainMark = url.indexOf('?') != -1;

            url += that.isFirst && (isContainMark && '&first=1' || '?first=1') || '';
            url += [url.indexOf('?') != -1 && '&' || '?', 't=' + Date.now()].join('');
            that.xhr = $.ajax({
                url:url,
                data:{item_id:id, rateRs:that.typeMap[that.typeg], p:page, ps:10},
                dataType:'jsonp',
                success:function (data) {
                    if (data && typeof data == 'string') {
                        data = data.replace(//gi, "");
                        data = JSON.parse(data);
                    }
                    that.fetchAfter(data, page);
                    that.xhr = null;
                },
                error:function () {
                   // tip(message.errorMessage);
                    that.xhr = null;
                    that.loading.addClass('none');
                }
            });
        },

        fetchAfter:function (data, page) {
            console.log("fetchAfter");

            var that = this;
            if (data && data.items && data.items.length) {
                //var cache = that.tabCache[that.typeg];
                that.render(data, page);


                if (!that.pageNav) {

                    var pageInstance = that.pageNav = new PageNav({'id':'#tbh5v0 #J_dcpage', 'index':1, 'pageCount':data.total, 'disableHash':true});
                    pageInstance.$container.on('P:switchPage', function (e, page) {
                        that.getData(page.index);
                        that.tabCache[that.typeg].page = page.index;
                        if (page.type == 'next') { // 下一页埋点
                            //     utils.sendPoint('nextpage#h#detail');暂时不设置埋点
                        }
                    });
                //    cache.total = data.total;
                //    cache.first = null;
               }
          /*      if (cache.first) {  //Only initialize in first
                    cache.first = null;
                    cache.total = data.total;
                    var pageInstance = that.pageNav;
                    pageInstance.eventDetach();
                    pageInstance.init({'index':page, 'pageCount':data.total, 'disableHash':true});
                }
                if (cache.second > 1) { //评论接口总页数出现问题，需要二次请求才正确，需要再次实例pagenav
                    if (cache.second == 2) {
                        cache.total = data.total;
                        var pageInstance = that.pageNav;
                        pageInstance.eventDetach();
                        pageInstance.init({'index':page, 'pageCount':data.total, 'disableHash':true});
                        cache.second += 1;
                    }
                }
                else {
                    cache.second += 1;
                }*/
                that.pagebar.removeClass('none');
            }
            else if (data) {
               // that.render(data, page);
                $(app.component.getActiveContent()).find("#J_commentCont").html('<p class="itc-p">无评论</p>');
            }
            /*if(that.isFirst && !that.tmall){  //第一次且不是tmall
             var arr = ["feedGoodCount","allNormalCount","allBadCount","allAppendCount"],
             ems = that.tabar.find('em');
             ems.each(function(index,item){
             item.innerHTML = ['(',data[arr[index]],')'].join(' ');
             });
             }*/
            that.isFirst = null;
         //   that.loading.addClass('none');
        },
        getData:function (n) {
            var that = this,
                type = that.typeg,
                cache = that.tabCache[type],
                list = cache.list,
                page = n || cache['page'];
            n && scrollTo(0, 0);
            cache.sel && cache.sel.addClass('none');
            if (list[page]) {
                list[page].removeClass('none');
                cache.sel = list[page];
                if (cache.first) {  //Only initialize in first
                    cache.first = null;
                    var pageInstance = that.pageNav;
                    if (!pageInstance) {
                        return;
                    }
                    pageInstance.eventDetach();
                    pageInstance.init({'index':page, 'pageCount':cache.total, 'disableHash':true});
                }
            }
            else {
                that.pagebar.addClass('none');
                that.loading.removeClass('none');
                that.fetch(that.itemId, n);
            }
        },



        unload:function () {
            // implement super.unload

            this.pageNav && this.pageNav.eventDetach();
            this.pageNav = null;
            this.tabCache = null;
        }
    });


})(window['app']);