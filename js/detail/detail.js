(function (app, undef) {

    var detail = app.page.define({
        name:"detail",
        title:'宝贝详情', //title bar的文案
        route:"detail\/(P<id>\\d+)",
        templates:{
            "layout":JST['template/detail_layout'],
            "slider":JST['template/detail_slider'],
            "orderNow":JST['template/detail_extra'],
            "info":JST['template/detail_info'],
            "comments":JST['template/comment_item'],
            "merchant":JST['template/detail_merchant'],
            "item_non_existent":JST['template/error_no_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],

        ready:function () {
            var self = this;
            var content = $(app.component.getActiveContent());
            content.html(self.templates["layout"]());

            //delegate events
            app.Util.Events.call(this, "#tbh5v0", this.events);

            this.queryData();
        },


        events:{
            'click .goods-slider':'fullscreen1',
            'click .dc-delivery':'recover',
            'click .jsb-ori':'original'
        },

        fullscreen1:function () {
            alert("fff");
        },

        recover:function () {
            alert("fsss");
        },

        original:function () {


        },

        //请求详情页信息
        queryData:function () {

            var self = this;
            var el = $(app.component.getActiveContent()).find("#J_detailCont");
            this.itemQid = id = app.navigation.getParameter("id");

            app.mtopH5Api.getApi('mtop.wdetail.getItemDetail', '3.0', {'itemNumId':id}, {}, function (result) {

                // success callback
                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {

                    var item = result.data.item;

                    if (item && item.h5Common && item.h5Common == 'true') {
                        self.render(result);
                    } else {
                        console.log("本应用暂不支持该宝贝");//模板暂时不支持
                        self.render(result);
                    }
                } else if (result.ret[0].indexOf("ERRCODE_QUERY_DETAIL_FAIL") > -1) { //宝贝不存在
                    el.html(self.templates['item_non_existent']());
                }

            }, function () {
                notification.flash("请求失败，请重试").show();
            });

        },

        queryDesc:function () {



            app.mtopH5Api.getApi('mtop.gene.feedCenter.getConfigByItemId', '1.0', {"aucNumId":this.itemQid}, {}, function (result) {
                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    $("#J-desc").html(result.data.result);

                }
            })
        },

        render:function (json) {
            var data = json.data;
            app.helper._parseDetailJson(data);
            var detailData = app.ZDMDetail;

            //good slider
            var sliderHtml = this.templates['slider']({sliders:detailData.images, info:detailData.info});
            $("#J_slide").html(sliderHtml);


            //good info
            var infoHtml = this.templates['info']({info:detailData.info, mallInfo:detailData.mallInfo});
            $("#J-dInfo").html(infoHtml);

            // merchant info
            var merchantInfo = this.templates['merchant']({evaluateCount:detailData.info.evaluateCount, itemId:detailData.itemId, seller:detailData.seller, guarantees:detailData.guarantees});
            $("#J-merchant").html(merchantInfo);


            var orderNow = this.templates['orderNow']({item:detailData.info, trade:detailData.trade, seller:detailData.seller});
            $("#J-orderNow").html(orderNow);

            this.detailSlider = new Swipe($('#J-sliderShow')[0], {"fixWidth":200, "preload":4});
            this.detailSlider.load();

            this.queryDesc();

            app.sku.init(detailData);


            //query comment
            this.queryComment(detailData.seller.userNumId);

        },


        queryComment:function (ratedId) {

           var self = this;
            var data = {"ratedUid":ratedId, "tradeId":"0", "itemIds":this.itemQid, "pageSize":"5", "pageIndex":"1"};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (result) {

                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    var comments = result.data.dataList;

                    var html = self.templates['comments']({comments:comments});

                    $(app.component.getActiveContent()).find("#zdm-comment").html('<h2>用户晒单</h2><ul class="zdm-comment-block">' + html + '</ul>');
                } else {
                    notification.flash("评论请求失败，请重试").show();
                }
            });
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);