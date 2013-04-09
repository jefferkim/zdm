(function (app, undef) {

    var detail = app.page.define({
        name:"detail",
        title:'宝贝详情', //title bar的文案
        route:"detail\/(P<id>\\d+)",
        templates:{
            "layout":JST['template/detail_layout'],
            "slider":JST['template/detail_slider'],
            "info":JST['template/detail_info'],
            "merchant":JST['template/detail_merchant']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],

        //是否支持上传图片
        _supportImgUpload:function () {


        },


        //query detail data
        queryData:function () {

            var self = this;
            var id = app.navigation.getParameter("id");
            var el = $("#J_detailCont");
            app.mtopH5.getApi(
                'mtop.wdetail.getItemDetail',
                '3.0',
                {'itemNumId':id},
                {'ttid':'2000@taobao_h5_3.0'},
                function (result) {
                    // success callback
                    if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                        var item = result.data.item;
                        if (item && item.h5Common && item.h5Common == 'true') {
                            self.render(result);
                        } else { //not common product
                            el.html('<p class="itc-p">本应用暂不支持该宝贝</p>');
                            //open.loadHide();
                        }
                    }
                    else {
                        el.html('<p class="itc-p">' + message.abnormalMessage + '</p>');
                        //open.loadHide();

                    }
                }, function () {
                    el.html('<p class="itc-p">' + message.errorMessage + '</p>');
                    // open.loadHide();
                }
            )
        },


        render:function (json) {
            var data = json.data;
            this._parseJson(data);

            //good slider
            var sliderHtml = this.templates['slider']({sliders:app.ZDMDetail.images});
            $("#J_slide").html(sliderHtml);

            //good info
            var infoHtml = this.templates['info']({});
            $("#J-dInfo").html(infoHtml);



            // merchant info
            var merchantInfo = this.templates['merchant']({merchant:merchantInfo});
            $("#J-merchant").html(merchantInfo);


        },

        fetchHost:function () {  //获取当前环境
            var host = location.host;
            var http = 'm';
            if (!host.match('m.(taobao|tmall|etao|alibaba|alipay|aliyun)')) {
                if (host == '127.0.0.1' || host == 'localhost' || host.match('(?:.*\\.)?waptest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
                    http = 'm';
                } else if (host.match('(?:.*\\.)?wapa\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')) {
                    http = 'wapa';
                }
            }
            return http;
        },

        _parseJson:function (data) {
            var newJson = {},
                host = this.fetchHost();

            console.log(data);
            //价格
            var pricep = data.priceUnits;
            newJson.price = pricep.length > 1 && pricep[1].price || pricep[0].price;
            newJson.itemId = data.item.itemNumId;
            newJson.tmall = data.seller.type == 'B';	//是否tmall
            newJson.taoPlus = true;   					//wap淘加true
            newJson.isIpad = false;   					//是否ipad,目前直接false
            newJson.hasProps = data.item.sku == 'true';			//是否有sku
            newJson.taoPlus = true;  //是否显示淘加
            newJson.images = data.item.picsPath;


            var numid = newJson.itemId;
            //newJson.logAjaxUrl = 'http://a.'+host+'.taobao.com/ajax/pds.do';
            newJson.loginUrl = 'http://login.' + host + '.taobao.com/login.htm';
            //newJson.descAjaxUrl = 'http://a.m.taobao.com/ajax/desc_list.do?item_id='+numid+'&ps=800';
            //newJson.reviewAjaxUrl = 'http://a.m.taobao.com/ajax/rate_list.do?item_id='+numid;
            //newJson.paramAjaxUrl = 'http://a.m.tmall.com/ajax/param.do?item_id='+numid;
            newJson.recommendAjaxUrl = 'http://a.' + host + '.taobao.com/ajax/wap_recommend.do?item_id=' + numid;
            newJson.shopAuctionSearchUrl = 'http://shop.' + host + '.taobao.com/shop/shop_auction_search.htm?suid=' + data.seller.userNumId;
            newJson.tmallChangeLocationAjaxUrl = 'http://a.' + host + '.taobao.com/ajax/tmall_change_location.do?item_id=' + numid;

            newJson.addFavUrl = 'http://fav.' + host + '.taobao.com/favorite/to_collection.htm?itemNumId=' + numid + '&xid=0db2&pds=addfav%23h%23detail';
            //newJson.addCartUrl = 'http://d.'+host+'.taobao.com/ajax.do?fun=add&item_id='+numid+'&pds=addcart%23h%23detail';
            newJson.cleannowUrl = 'http://d.' + host + '.taobao.com/my_cart.htm?pds=cleannow%23h%23cart';
            newJson.myCartUrl = 'http://d.' + host + '.taobao.com/my_bag.htm?pds=gotocart%23h%23detail';


            if (data.mallInfo) {
                newJson.soldAreas = data.mallInfo.soldAreas;
            }

            if (newJson.hasProps) {    //sku对象，存在才转换
                var skuData = {};
                skuData.skuProps = [];
                var props = data.sku.props,
                    propsid, propsv, tempobj, tempobj1;
                for (var i = 0, len = props.length; i < len; i++) {  //sku属性
                    propsid = props[i].propId;
                    propsv = props[i].values;
                    tempobj = {};
                    tempobj.name = props[i].propName;
                    tempobj.values = [];
                    for (var j = 0, lenj = propsv.length; j < lenj; j++) {
                        tempobj1 = {}
                        tempobj1.id = [propsid , ':' , propsv[j].valueId].join('');
                        tempobj1.txt = propsv[j].valueAlias || propsv[j].name;
                        propsv[j].imgUrl && (tempobj1.img = propsv[j].imgUrl);
                        tempobj.values[j] = tempobj1;
                    }
                    skuData.skuProps[i] = tempobj;
                }
                var skus = data.sku.skus,
                    tempskus = {},
                    singskus;
                for (var k = 0, lenk = skus.length; k < lenk; k++) {  //sku逻辑
                    if (skus[k].quantity > 0) {
                        singskus = {};
                        singskus.quantity = skus[k].quantity;  //库存
                        singskus.skuId = skus[k].skuId;  //传到后台的id
                        if (skus[k].priceUnits) {
                            if (skus[k].priceUnits.length > 1) {
                                singskus.promoPrice = skus[k].priceUnits[0].price;
                                singskus.price = skus[k].priceUnits[1].price;
                            }
                            else {
                                singskus.price = skus[k].priceUnits[0].price;
                            }
                        }
                        else {
                            singskus.price = skus[k].price || '';
                        }
                        tempskus[skus[k].ppath] = singskus;
                    }
                }
                skuData.availSKUs = tempskus;
                newJson.skuData = skuData;
            }
            app.ZDMDetail = newJson; //cache the detail data
        },

        ready:function () {
            var self = this;
            var content = $(app.component.getActiveContent());
            app.ZDMDetail = {}; //global data for zdm detail

            // implement super.ready
            content.html(self.templates["layout"]());


            this.queryData();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);