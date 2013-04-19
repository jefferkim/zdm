(function (app, undef) {

    var myGood = app.page.define({
        name:"myGood",
        title:'我的商品', //title bar的文案
        route:"my\/p(P<pageNo>\\d+)",
        templates:{
            "layout":JST['template/good_layout'],
            "commentItem":JST['template/good_commentItem'],
            "goodItem":JST['template/good_item'],
            "no_order":JST['template/error_no_order']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],


        events:{
            "click .J-addPic":"triggerUploader",
            "click .view-comments":"gotoViewAll"
        },


        gotoViewAll:function (e) {
            e.preventDefault();
            var mod = $(e.currentTarget).parents(".z-mod");
            var itemId = mod.attr("data-itemid");
            var ratedUid = mod.attr("data-rateduid");
            app.navigation.push("viewAll/" + itemId + "/" + ratedUid + "/p1");

        },


        _queryComments:function (ids, itemIdForBind, orderIdArr) {

            var self = this;


            var data = {"ratedUid":"0", "itemIds":ids.join(","), "pageSize":"150", "pageIndex":"1"};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (resp) {

                if (resp.ret && resp.ret[0] == 'SUCCESS::调用成功' && resp.data) {

                    var list = resp.data.dataList;

                    console.log(ids);

                    _.each(ids, function (id, index) {

                        var t = _.where(list, {"aucNumId":id, "parentTradeId":orderIdArr[index]});

                        var comment1 = t.length > 0 ? t[0] : false;

                        $("#J-comment-" + itemIdForBind[index]).html(self.templates['commentItem']({comment:comment1}));

                    })
                } else {
                    notification.flash("请求商品评论失败，请刷新");
                }
            });

        },
        // load good list
        loadGoodList:function () {

            var self = this;
            var navigation = app.navigation;
            var pageNo = navigation.getParameter("pageNo");
            var itemIdsArr = [];
            var itemIdForBind = [];
            var orderIdArr = [];


            var data = {"archive":"false", "statusId":"2", "page":pageNo || 1, "pageSize":"10"};

            app.mtopH5Api.getApi('mtop.order.queryOrderList', '1.0', data, {}, function (resp) {

                var content = $(app.component.getActiveContent()).find("#J-goodList");
                var ret = resp.ret[0];
                if (resp.ret && resp.ret[0] == 'SUCCESS::调用成功' && resp.data) {

                    //TODO:write a parse function to flatten the child order
                    var goodList = resp.data.cell;

                    content.html(self.templates['goodItem']({goods:goodList}));

                    $(".z-mod").each(function (index, node) {
                        itemIdsArr.push($(node).attr("data-itemId"));
                        itemIdForBind.push($(node).attr("data-id"));
                        orderIdArr.push($(node).attr("data-orderId"));
                    });

                    self._queryComments(itemIdsArr, itemIdForBind, orderIdArr);

                    self.pageNav = new PageNav({'id':'#J-goodsPage', 'index':1, 'pageCount':Math.ceil(resp.data.total / 10), 'objId':'p'});



                } else if (ret.indexOf("ORDER_NOT_FOUND") > -1) {
                    content.html(self.templates['no_order']());
                } else {
                    notification.flash(ret.split("::")[1]).show();
                }

            },function(error){
                console.log(error);

            });


        },


        _testCanUpload:function () {
            var canUpload;
            if (navigator.userAgent.indexOf("OS") > -1) {
                var ua = navigator.userAgent;
                var c = ua.charAt(ua.indexOf("OS") + 3);
                canUpload = c >= 6;
            } else {
                canUpload = false;
            }


            canUpload = true;

            return canUpload;
        },


        triggerUploader:function (e) {
            e.preventDefault();

            var currentTarget = e.currentTarget;
            var item = $(currentTarget).parents(".z-mod");
            var canUpload = this._testCanUpload();

            if (!canUpload) {
                alert("抱歉！您的手机浏览器暂不支持网页上传图片功能。");
            }

            app.ZDMData.ratedUid = item.attr("data-rateduid");
            app.ZDMData.tradeId = item.attr("data-tradeid");
            app.ZDMData.parentTradeId = item.attr("data-parentTradeId");
            app.ZDMData.aucNumId = item.attr("data-itemId");


            app.navigation.push("upload", {datas:{"canUpload":canUpload}});


        },

        ready:function () {
            // implement super.ready
            var self = this;
            var content = $(app.component.getActiveContent());
            var navigation = app.navigation;

            content.html(self.templates['layout']());

            //delegate events
            app.Util.Events.call(this, "#tbh5v0", this.events);


            this.loadGoodList();
        },

        unload:function () {
            // implement super.unload

        }

    });


})(window['app']);