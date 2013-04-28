(function (app, undef) {

    var upload = app.page.define({
        name:"upload",
        title:'', //title bar的文案
        route:"upload",
        templates:{
            "layout":JST['template/add_pic'],
            "commentItem":JST['template/comment_item'],
            "goodItem":JST['template/good_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            },
            {
                type:"func",
                text:"上传图片",
                handler:function () {
                    if($("#J-upload").val() == "")
                        notification.flash("请上传图片或者回到我的商品页重新进行操作").show();
                    else
                        $("#J-imgForm").submit();
                }
            }
        ],

        events:{
           // "click #J-addPicBtn":"triggerUploader"
        },

        triggerUploader:function (e) {
            e.preventDefault();
         //   $("#J-upload").trigger("click");
        },

        ready:function () {
            // implement super.ready
            var self = this;
            var content = $(app.component.getActiveContent());
            var navigation = app.navigation;

            content.html(this.templates['layout']());


            //delegate events
            app.Util.Events.call(this, "#J-uploader", this.events);

            if (app.navigation._cur.state.datas) {
                var canUpload = app.navigation.getData("canUpload");
                if(!canUpload){
                    $("#J-addPicWrap").hide();
                }

                var data =  app.ZDMData.itemDataConfig;
                $("#J-ratedUid").val(data.ratedUid);
                $("#J-tradeId").val(data.tradeId);
                $("#J-parentTradeId").val(data.parentTradeId);
                $("#J-itemId").val(data.itemId);
            }


            var _calculateCount = function(el){
                var val = el.val(),
                    valCount = val.replace("/[^/x00-/xff]/g", "**").length;
                $("#J-num").text(valCount);
                if (valCount >= 140) {
                    el.val(val.substr(0, 140));
                }
            }

            $("#J-upload").on("change",function(){
                $("#J-uploaderTrigger").hide();
                $("#J-uploaded").show();
                $("#J-upload").css({"opacity":1});
                $(".upload-btn").show();
            });

            $("#J_CommentPoster").on("keyup paste",function () {
                _calculateCount($(this));
            });

        },

        unload:function () {
            // implement super.unload
        }

    });

})(window['app']);