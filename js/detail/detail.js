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






        ready:function () {
            var self = this;
            var content = $(app.component.getActiveContent());
            content.html(self.templates["layout"]());

            this.queryData();
        },


        //query detail data
        queryData:function () {

            var self = this;
            var id = app.navigation.getParameter("id");
            var el = $("#J_detailCont");

            app.mtopH5.getApi( 'mtop.wdetail.getItemDetail', '3.0',  {'itemNumId':id}, {'ttid':'2000@taobao_h5_3.0'},  function (result) {
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
            app.helper._parseDetailJson(data);
            var detailData =  app.ZDMDetail;

            //good slider
            var sliderHtml = this.templates['slider']({sliders:detailData.images});
            $("#J_slide").html(sliderHtml);


            //good info
            console.log(detailData);
            var infoHtml = this.templates['info']({info:detailData.info,mallInfo:detailData.mallInfo});
            $("#J-dInfo").html(infoHtml);

            // merchant info
            var merchantInfo = this.templates['merchant']({itemId:detailData.itemId,seller:detailData.seller,guarantees:detailData.guarantees});
            $("#J-merchant").html(merchantInfo);


            new Swipe($('#J-sliderShow')[0], {"fixWidth":200,"preload": 4});

        },


        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);