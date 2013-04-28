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
            var dataConfig = mod.attr("data-config");
            var itemData = dataConfig ? (new Function("return " + dataConfig))() : {};
            app.navigation.push("viewAll/" + itemData.itemId + "/" + itemData.ratedUid + "/p1");
        },

        _queryComments:function (itemArr,objArr) {




            var self = this;
            var ids = _.map(itemArr,function(item){return item.itemId});
            var data = {"ratedUid":"0", "itemIds":ids.join(","), "pageSize":"150", "pageIndex":"1"};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryFeedItems', '1.0', data, {}, function (resp) {

                if (resp.ret && resp.ret[0] == 'SUCCESS::调用成功' && resp.data) {
                    var list = resp.data.dataList;


                    var list = [
                        {

                            "feedId": "64190703057",
                            "ratedUid": "814074396",
                            "ratedUserNick": "君宝话费充值专营店",
                            "raterUid": "432308023",
                            "raterUserNick": "c测试账号171",
                            "raterType": "0",
                            "status": "0",
                            "validscore": "0",
                            "rate": "1",
                            "tradeId": "313360480222380",
                            "parentTradeId": "313360480222380",
                            "gmtTradeCreate": "2013-03-26 15:10:40",
                            "gmtTradeFinished": "2013-03-27 15:12:26",
                            "aucNumId": "13573353934",
                            "auctionTitle": "浙江联通10元充值 快充 即时到帐 自动充值 闪电发货 秒冲快冲",
                            "auctionPicUrl": "http://img2012.i04.wimg.taobao.com/bao/uploaded/i4/T1IxlBXh0IXXbsqFPX_084117.jpg",
                            "auctionPrice": "9.88",
                            "auctionVirtual": "2",
                            "leafCatId": "150402",
                            "rootCatId": "50004958",
                            "spuId": "232079",
                            "feedback": "不错不错不错不错，非常好",
                            "feedbackLength": "12",
                            "validfeedback": "1",
                            "lastModifyFrom": "0",
                            "editStatus": "0",
                            "bizType": "8",
                            "source": "0",
                            "buyState": "1",
                            "raterPic": "1",
                            "propertiesMap": {},
                            "anony": "0",
                            "privacy": "0",
                            "albumId": "0",
                            "voteUseful": "0",
                            "raterStar": "0",
                            "sortWeight": "0",
                            "attributesMap": {},
                            "number1": "204619291142380",
                            "number2": "0",
                            "number3": "0",
                            "gmtCreate": "2013-04-23 09:52:40",
                            "gmtModified": "2013-04-23 09:52:40",
                            "lockVersion": "0",
                            "feedAppendedDOList": [],

                            "feedItemPicDOList": [
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "349638476",
                                    "gmtCreate": "2013-04-23 09:52:18",
                                    "gmtModified": "2013-04-23 09:52:40",
                                    "receiveId": "64190703057",
                                    "ratedUid": "814074396",
                                    "raterUid": "432308023",
                                    "itemId": "13573353934",
                                    "status": "1",
                                    "path": "http://img2012.i04.wimg.taobao.com/bao/uploaded/i0/349638476/T1qiSlXwVdXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                }
                            ],

                            "xid": "dbfbRo",
                            "gmtModifiedFormatStr": "2013-04-23 09:52:40",
                            "appended": "false"
                        },
                        {

                            "feedId": "63988693669",
                            "ratedUid": "263660307",
                            "ratedUserNick": "商家测试帐号12",
                            "raterUid": "432308023",
                            "raterUserNick": "c测试账号171",
                            "raterType": "0",
                            "status": "0",
                            "validscore": "0",
                            "rate": "1",
                            "tradeId": "181026951452380",
                            "parentTradeId": "181026951452380",
                            "gmtTradeCreate": "2012-09-26 14:17:08",
                            "gmtTradeFinished": "2013-02-09 17:14:40",
                            "aucNumId": "15862851825",
                            "auctionTitle": "评价测试1",
                            "auctionPicUrl": "http://img2012.i02.wimg.taobao.com/bao/uploaded/i2/T1dA5AXhduXXXi_NZV_021051.jpg",
                            "auctionPrice": "0.01",
                            "auctionVirtual": "2",
                            "leafCatId": "1629",
                            "rootCatId": "16",
                            "spuId": "202295332",
                            "feedback": "f?g?f?x?cv",
                            "feedbackLength": "10",
                            "validfeedback": "1",
                            "lastModifyFrom": "0",
                            "editStatus": "0",
                            "bizType": "8",
                            "source": "0",
                            "buyState": "1",
                            "raterPic": "1",
                            "propertiesMap": {},
                            "anony": "0",
                            "privacy": "0",
                            "albumId": "0",
                            "voteUseful": "0",
                            "raterStar": "0",
                            "sortWeight": "0",
                            "attributesMap": {},
                            "number1": "181026951452380",
                            "number2": "0",
                            "number3": "0",
                            "gmtCreate": "2013-04-19 21:54:29",
                            "gmtModified": "2013-04-19 21:54:29",
                            "lockVersion": "0",
                            "feedAppendedDOList": [],

                            "feedItemPicDOList": [
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024013",
                                    "gmtCreate": "2013-04-19 21:54:23",
                                    "gmtModified": "2013-04-19 21:54:29",
                                    "receiveId": "63988693669",
                                    "ratedUid": "263660307",
                                    "raterUid": "432308023",
                                    "itemId": "15862851825",
                                    "status": "1",
                                    "path": "http://img2012.i01.wimg.taobao.com/bao/uploaded/i1/348024013/T1_jegXsXfXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                },
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024014",
                                    "gmtCreate": "2013-04-19 21:54:23",
                                    "gmtModified": "2013-04-19 21:54:29",
                                    "receiveId": "63988693669",
                                    "ratedUid": "263660307",
                                    "raterUid": "432308023",
                                    "itemId": "15862851825",
                                    "status": "1",
                                    "path": "http://img2012.i02.wimg.taobao.com/bao/uploaded/i2/348024014/T1aauhXtlgXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                },
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024015",
                                    "gmtCreate": "2013-04-19 21:54:23",
                                    "gmtModified": "2013-04-19 21:54:29",
                                    "receiveId": "63988693669",
                                    "ratedUid": "263660307",
                                    "raterUid": "432308023",
                                    "itemId": "15862851825",
                                    "status": "1",
                                    "path": "http://img2012.i03.wimg.taobao.com/bao/uploaded/i3/348024015/T1_fChXv4gXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                },
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024016",
                                    "gmtCreate": "2013-04-19 21:54:23",
                                    "gmtModified": "2013-04-19 21:54:29",
                                    "receiveId": "63988693669",
                                    "ratedUid": "263660307",
                                    "raterUid": "432308023",
                                    "itemId": "15862851825",
                                    "status": "1",
                                    "path": "http://img2012.i08.wimg.taobao.com/bao/uploaded/i0/348024016/T1JeyhXE0eXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                }
                            ],
                            "rateUtil": {
                                "b2CMappingProcess": "false",
                                "rateInfo": "false",
                                "c2CProcess": "false",
                                "rateAppended": "false",
                                "xinNongye": "false",
                                "domesticAir": "false",
                                "internationalAir": "false"
                            }

                        },
                        {

                            "feedId": "63988693637",
                            "ratedUid": "814074396",
                            "ratedUserNick": "君宝话费充值专营店",
                            "raterUid": "432308023",
                            "raterUserNick": "c测试账号171",
                            "raterType": "0",
                            "status": "0",
                            "validscore": "0",
                            "rate": "1",
                            "tradeId": "313360480222380",
                            "parentTradeId": "313360480222380",
                            "gmtTradeCreate": "2013-03-21 17:12:26",
                            "gmtTradeFinished": "2013-03-21 17:15:46",
                            "aucNumId": "1357335393114",
                            "auctionTitle": "浙江联通10元充值 快充 即时到帐 自动充值 闪电发货 秒冲快冲",
                            "auctionPicUrl": "http://img2012.i04.wimg.taobao.com/bao/uploaded/i4/T1IxlBXh0IXXbsqFPX_084117.jpg",
                            "auctionPrice": "9.88",
                            "auctionVirtual": "2",
                            "leafCatId": "150402",
                            "rootCatId": "50004958",
                            "spuId": "232079",
                            "feedback": "dhfxbh",
                            "feedbackLength": "6",
                            "validfeedback": "1",
                            "lastModifyFrom": "0",
                            "editStatus": "0",
                            "bizType": "8",
                            "source": "0",
                            "buyState": "1",
                            "raterPic": "1",
                            "propertiesMap": {},
                            "anony": "0",
                            "privacy": "0",
                            "albumId": "0",
                            "voteUseful": "0",
                            "raterStar": "0",
                            "sortWeight": "0",
                            "attributesMap": {},
                            "number1": "313360480222380",
                            "number2": "0",
                            "number3": "0",
                            "gmtCreate": "2013-04-19 21:28:31",
                            "gmtModified": "2013-04-19 21:28:31",
                            "lockVersion": "0",
                            "feedAppendedDOList": [],

                            "feedItemPicDOList": [
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024010",
                                    "gmtCreate": "2013-04-19 21:28:25",
                                    "gmtModified": "2013-04-19 21:28:31",
                                    "receiveId": "63988693637",
                                    "ratedUid": "814074396",
                                    "raterUid": "432308023",
                                    "itemId": "13573353934",
                                    "status": "1",
                                    "path": "http://img2012.i02.wimg.taobao.com/bao/uploaded/i2/348024010/T1pEijXs8XXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                },
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024011",
                                    "gmtCreate": "2013-04-19 21:28:25",
                                    "gmtModified": "2013-04-19 21:28:31",
                                    "receiveId": "63988693637",
                                    "ratedUid": "814074396",
                                    "raterUid": "432308023",
                                    "itemId": "13573353934",
                                    "status": "1",
                                    "path": "http://img2012.i03.wimg.taobao.com/bao/uploaded/i3/348024011/T1DSSjXB8XXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                },
                                {
                                    "dbRoute": {
                                        "xid": "dbfbRo",
                                        "routingStrategy": "0",
                                        "empty": "false"
                                    },
                                    "fileid": "348024012",
                                    "gmtCreate": "2013-04-19 21:28:25",
                                    "gmtModified": "2013-04-19 21:28:31",
                                    "receiveId": "63988693637",
                                    "ratedUid": "814074396",
                                    "raterUid": "432308023",
                                    "itemId": "13573353934",
                                    "status": "1",
                                    "path": "http://img2012.i01.wimg.taobao.com/bao/uploaded/i0/348024012/T1_AWhXs0fXXaH.X6X.JPEG",
                                    "source": "0",
                                    "bizType": "8",
                                    "cover": "0"
                                }
                            ],
                            "rateUtil": {
                                "b2CMappingProcess": "false",
                                "rateInfo": "false",
                                "c2CProcess": "false",
                                "rateAppended": "false",
                                "xinNongye": "false",
                                "domesticAir": "false",
                                "internationalAir": "false"
                            },
                            "shareInfoDO": {
                                "flag": "0"
                            },
                            "xid": "dbfbRo",
                            "gmtModifiedFormatStr": "2013-04-19 21:28:31",
                            "appended": "false"
                        }
                    ];




                    for(var j = 0 ; j<ids.length;j++) {

                        var comment1 = false;
                        var currentItem =  itemArr[j];

                        for(var i = 0 ; i< list.length; i++){
                            var l = list[i];

                            if((l["parentTradeId"] == currentItem.parentTradeId) && (l["tradeId"] == currentItem.tradeId) && (l["aucNumId"] == ids[j])){

                                 comment1 = l;

                            }
                        }

                        console.log(self.templates['commentItem']({comment:comment1}));

                        $("#"+objArr[j]).html(self.templates['commentItem']({comment:comment1}));


                    }

                } else {
                    notification.flash("请求商品评论失败，请刷新");
                }

            }, function (error) {
                notification.flash("网络出错，请稍后再试!").show();
            });

        },
        // load good list
        loadGoodList:function () {

            var self = this;
            var navigation = app.navigation;
            var pageNo = parseInt(navigation.getParameter("pageNo"));

            var itemArr = [];
            var objArr = [];

            var data = {"fromIndex":(pageNo-1)*15, "toIndex":pageNo*15};

            app.mtopH5Api.getApi('mtop.gene.feedCenter.queryOrderList', '1.0', data, {}, function (resp) {

                var content = $(app.component.getActiveContent()).find("#J-goodList");
                var ret = resp.ret[0];
                //TODO:后端需要对ret进行输出
                if (resp.ret && resp.ret[0].indexOf('SUCCESS')> -1 && resp.data) {

                    if(!resp.data.result){
                        content.html(self.templates['no_order']());
                        return;
                    }
                    //TODO:write a parse function to flatten the child order
                    var goodList = resp.data.result;

                    content.html(self.templates['goodItem']({goods:goodList}));

                    $(".z-mod").each(function (index, node) {

                        var configData = $(node).attr("data-config");
                        var objId = $(node).find(".J-commentFt").attr("id");
                        var data = configData ? (new Function("return " + configData))() : {};
                        itemArr.push(data);
                        objArr.push(objId);

                    });

                    self._queryComments(itemArr,objArr);

                    var totalPage =  resp.data.total ? Math.ceil(resp.data.total / 15) : 3;
                    self.pageNav = new PageNav({'id':'#tbh5v0 #J-goodsPage', 'index':1, 'pageCount':totalPage, 'objId':'p'});

                } else if (resp.ret[0].indexOf("FAIL_SYS_SESSION_EXPIRED") > -1) {   //
                    notification.flash("请重新登录").show();
                } else {
                    notification.flash(ret.split("::")[1]).show();
                }

            }, function (error) {
                notification.flash("网络出错，请稍后再试!").show();
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

            var dataConfig = item.attr("data-config");

            app.ZDMData.itemDataConfig = dataConfig ? (new Function("return " + dataConfig))() : {};

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