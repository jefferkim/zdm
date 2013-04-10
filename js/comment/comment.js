(function (app, undef) {

    var comment = app.page.define({
        name:"comment",
        title:'评论', //title bar的文案
        route:"comment\/(P<id>\\d+)",
        templates:JST['template/comment'],
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'宝贝详情'
            }
        ],

        events:{
            'click #J_commtab li':'tabClick'

        },

        render:function (resp) {

            var content = $(app.component.getActiveContent());


            var html = this.templates(resp);
            content.html(html);
            console.log(html);

        },

        queryComments:function () {
            var self = this;
            var itemId = this.itemId;

            $.ajax({
                url:'http://a.m.taobao.com/ajax/rate_list.do?type=jsonp&callback=?&item_id=' + itemId,
                success:function (resp) {
                    self.render(resp);
                }
            });
        },

        ready:function () {
            // implement super.ready
            var self = this;

            this.itemId = app.navigation.getParameter("id");
            this.queryComments();

            //delegate events
            app.Util.Events.call(this, "#J-myGood", this.events);


            this.typeg = 'good';
            this.url = 'http://a.' + app.helper.fetchHost() + '.taobao.com/ajax/rate_list.do';
            this.isFirst = true;
            this.tabCache = {
                "good":{first:true, second:1, page:1, total:0, sel:null, list:[]}, //second由于评论接口总页数出现问题，需要二次请求才正确
                "ok":{first:true, second:1, page:1, total:0, sel:null, list:[]},
                "bad":{first:true, second:1, page:1, total:0, sel:null, list:[]},
                "addto":{first:true, second:1, page:1, total:0, sel:null, list:[]}
            }


        },

        unload:function () {
            // implement super.unload
        },


        /*
        *   http://a.m.taobao.com/ajax/rate_list.do?item_id=8106997741&sid=78aac522a50135e8&t=1365563431088&rateRs=0&p=1&ps=10
        *   first:是不是第一页，如果是第一页将好评中评差评数返回
        *   rateRs：1为好评等等，对应下方typeMap
        *   p:page 页码
        *   ps:pagesize 一页有多少
        *
        * */

         typeMap:{
            "good":"1",//好评
            "ok":"0",  //中评
            "bad":"-1",  //差评
            "addto":"2"  //追加
        },

       /* typePonit:{  //埋点数据
            "good":"saygood#h#detail",
            "ok":"saynormal#h#detail",
            "bad":"saybad#h#detail",
            "addto":"addsay#h#detail"
        },*/

        tabClick:function () {
            var that = this,
                tabar = that.tabar;
            that.curLi = tabar.find('li.cur');
            tabar.on('click', 'li', function (e) {
                e.preventDefault();
                scrollTo(0, 0);
                var target = $(e.currentTarget);
                if (target.hasClass('cur')) {
                    return;
                }
                target.addClass('cur');
                that.curLi.removeClass('cur');
                that.curLi = target;
                var tabCache = that.tabCache[that.typeg],
                    tsel = tabCache.sel;
                tsel && tsel.addClass('none');

                that.typeg = target.attr('s');
                var curCache = that.tabCache[that.typeg];
                curCache.total && that.pagebar.removeClass('none') || that.pagebar.addClass('none');  //页码显示和隐藏
                curCache.first = true;
                that.getData();
                utils.sendPoint(that.typePonit[that.typeg]);
            });
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
        destroy:function () {
            this.pageNav && this.pageNav.eventDetach();
            this.undelegateEvents();
            this.$el.html('');
            this.$el = null;
        }










    });


})(window['app']);