(function (app, undef) {



    Object.extend(app.helper,{

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

        _parseDetailJson:function (data) {

            //document : http://dev.wireless.taobao.net/mediawiki/index.php?title=Mtop.wdetail.getItemDetail_3.0

            var newJson = {};
            var host = this.fetchHost();
            var item = data.item;
            var pricep = data.priceUnits;

            //商品属性：
            newJson.itemId = item.itemNumId;

            //图片:图片区域
            newJson.images = item.picsPath;

            //商品信息:
            newJson.info = {
                 "price":pricep[0].price, //价格：值得买不需要输出原先的原价什么的，直接输出最终价格
                 "delivery":data.delivery,  //运费相关:
                 "totalSoldQuantity":item.totalSoldQuantity, //总销量:
                 "soldout":item.soldout, //是否售完:
                 "evaluateCount":item.evaluateCount
            };

            newJson.trade = data.trade;
            //商家信息:
            newJson.seller = data.seller;

            //保障:
            newJson.guarantees = data.guarantees;


            newJson.tmall = data.seller.type == 'B';	//是否tmall
            newJson.taoPlus = true;   					//wap淘加true
            newJson.isIpad = false;   					//是否ipad,目前直接false
            newJson.hasProps = data.item.sku == 'true';			//是否有sku
            newJson.taoPlus = true;  //是否显示淘加



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


            newJson.mallInfo = data.mallInfo;

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

        convertCredit:function(n){
            var src = 'http://a.tbcdn.cn/mw/s/hi/tbtouch/icons/rank/b_';
            src += Math.ceil(n/5);
            src += '_';
            src += (n%5 || 5);  //整除则认为是5
            src += '.gif';
            return src;
        }


    });


})(window['app']);