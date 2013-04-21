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
            app.Util.Events.call(this, "body", this.events);

            this.queryData();
        },


        events:{
            'click .goods-slider li img':'fullscreen',
            'click #J-jsbBack':'recover',
            'click #J-cBack':'recover1',
            'click .jsb-ori':'original',
            'click #J-goToComment':'goToComment',
            'click #J-goToView':'goToView',
            'click .immbuy' : 'immediatelyBuy',
            'click #zdm-comment .pic-desc li':'showCommentPicSlider'
        },

        recover1:function(e){
            e.preventDefault();
            $(".viewport").show();
            $("#tbh5v0 .dSliderFull").remove();
        },
        showCommentPicSlider:function(e){
            e.preventDefault();
            var currentTarget = e.currentTarget;
            var cloneDom = $(currentTarget).parents(".pic-desc").clone();
            $('#tbh5v0').addClass("fullscreen");
            var sliderEl = $('<div class="dSliderFull"></div>');
            sliderEl.html('<div class="dSlider" id="J-sliderComment"><div class="js-bton"><a href="#" class="jsb-back" id="J-cBack">返 回</a></div><div id="t"></div></div>');
            sliderEl.find("#t").html(cloneDom);
            $("#tbh5v0").append(sliderEl);
            $(".viewport").hide();
            $("#t li img").each(function(){
                var src = $(this).attr("src");
                $(this).attr("src",src.replace('60x60.jpg','300x300.jpg'));
            });


            var t = new Swipe($('#t')[0], {"fixWidth":300});
            t.element.style.marginLeft = 0;
            t.setup();
            t.begin();
        },

        commonDecide : function(e){  //区域限售、sku都必须选
            if(this.soldAreas && !$('.dia-city').attr('c')){
                notification.flash('请选择所在城市').show();
                return null;
            }
            if(this.hasProps && $('#sku-id').val() == ''){
                var nosel = $('.dsm-sel em'),
                    norText = $('.dsm-s em').html(),
                    text = nosel && nosel.html() || norText;
                text = '请选择 ' + text;
                tip(text);
                $('#sku-limit').trigger('click');
                return null;
            }
            return true;
        },

        immediatelyBuy:function(e){
            e.preventDefault();

            if(!this.commonDecide()) return;

            $('#order-form').submit();

        },


        addToCart:function(data){
            if(!data.item.quantity || data.item.quantity <= 0){  //当总库存为0时，不能购买
                //tip('当前区域已售完');
                var immbuy = $('.d-sure .immbuy');
                if(immbuy.length){
                    var parent = immbuy.parent(),
                        next = immbuy.next();
                    immbuy.remove();
                    next.hasClass('addcart') && next.remove();  //是购物车按钮也去掉
                    parent.append('<b id="J_NoArea" class="ds-coma ds-bs"><span>商品已售完</span></b>');
                }
            }
            else{//当所在地不在区域限售内，重新选择区域需要重置按钮
                var noareaBton = $('#J_NoArea');
                if(noareaBton.length){
                    var parent = noareaBton.parent();
                    noareaBton.remove();
                    parent.append('<a href="#" class="'+(that.tmall && "c-btn-tmall-buy" || "c-btn-oran")+' immbuy"><span>立即购买</span></a><a href="#" class="c-btn-blue addcart"><span>加入购物车</span></a>');
                }
            }

        },


        goToComment:function(e){
            e.preventDefault();
            app.navigation.push("#comment/"+this.itemQid);

        },
        goToView:function(e){
            e.preventDefault();
            app.navigation.push("#imaglet/"+this.itemQid);
        },


        setImg:function (str) {  //切换图片尺寸
            var el = this.slideEl;
            var imgarr = el.find('li img');
            imgarr.each(function (n, item) {
                var item = $(item),
                    src = item.attr('src'),
                    dataimg = item.attr("data-src"),
                    newsrc = app.Util.getWebpImg(dataimg, str);
                item.attr("data-src", newsrc);
                item.attr('src', newsrc);
            });
        },

        fullscreen:function (e) {
            scrollTo(0, 0);

            var slide = this.detailSlider;
            //  if(slide._isScroll){return;}  //滑动过程不允许全屏
            //只查找once
            this.slideEl || (this.slideEl = $('#J_slide'));
            this.body || (this.body = $('#tbh5v0'));
            this.hideEle || (this.hideEle = this.body.children());

            this.slideEl.appendTo(this.body).addClass('dSliderFull');
            this.hideEle.addClass('none'); //隐藏页面元素，不能直接使用display:none，避免和本来就是隐藏的冲突
            this.body.addClass('fullbody');

            slide.fixWidth = 300;
            slide.element.style.marginLeft = 0;

            slide.setup();
            slide.begin();
            this.setImg('300x300');

            $(".price-f").hide();

            this.isFulls = true;
        },

        recover:function (e) {
            e.preventDefault();

            this.slidePar || (this.slidePar = $('#J_detailCont').children()[0]);

            this.slideEl.insertBefore(this.slidePar).removeClass('dSliderFull');
            this.hideEle.removeClass('none'); //还原页面元素
            this.body.removeClass('fullbody');
            $(".price-f").show();

            var slide = this.detailSlider;

            slide.fixWidth = 200;
            slide.element.style.marginLeft = "58px";
            slide.setup();
            slide.begin();
            this.setImg('180x180');

            this.isFulls = false;
        },

        original:function (e) {
            e.preventDefault();

            var images = $("#J-sliderShow").find("li img");
            location.href = $(images[this.detailSlider.index || 0]).attr("src");
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
                } else {
                    notification.flash("请求商品简介失败").show();
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


            var orderNow = this.templates['orderNow']({itemId:detailData.itemId,item:detailData.info, trade:detailData.trade, seller:detailData.seller});
            $("#J-orderNow").html(orderNow);

            this.detailSlider = new Swipe($('#J-sliderShow')[0], {"fixWidth":200, "preload":4});
            this.detailSlider.load();

            this.queryDesc();

            app.sku.init(detailData);


            console.log("===");
            console.log(detailData);
            console.log("===");

            this.addToCart(detailData);

            //query comment
            this.queryComment(detailData.seller.userNumId);

        },


        queryComment:function (ratedId) {


            var self = this;
            var data = {"ratedUid":ratedId, "tradeId":"0", "itemIds":this.itemQid, "pageSize":"100", "pageIndex":"1"};

            var filterComments = function (comments) {
                var commentsSet = comments;
                var tmp = [];
                _.each(commentsSet, function (comment) {
                    if (comment.feedItemPicDOList.length >= 1 && tmp.length <= 4) {
                        tmp.push(comment);
                    }
                });

                if (tmp.length < 5) {
                    var t = commentsSet.slice(0, 5 - tmp.length);
                    var tmp = tmp.concat(t);
                }

                return tmp;
            }

            if(self.commentsFilterArr && self.itemFilterId == self.itemQid){
                var html = self.templates['comments']({comments:self.commentsFilterArr});

                $(app.component.getActiveContent()).find("#zdm-comment").html('<h2>用户晒单</h2><ul class="zdm-comment-block">' + html + '</ul>');

            }else{


                app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (result) {

                    if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                        var comments = self.comments = result.data.dataList;

                        self.itemFilterId = result.data.data.aucNumId;
                        var commentsArr = self.commentsFilterArr = filterComments(comments);

                        var html = self.templates['comments']({comments:commentsArr});

                        $(app.component.getActiveContent()).find("#zdm-comment").html('<h2>用户晒单</h2><ul class="zdm-comment-block">' + html + '</ul>');
                    } else {
                        notification.flash("评论请求失败，请重试").show();
                    }
                });

            }


        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);