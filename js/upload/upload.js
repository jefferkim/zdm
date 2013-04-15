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
                text:"发布",
                handler:function () {
                    //$("#J-imgForm").submit();
                    var data = {"ratedUid":app.ZDMData.ratedUid, "parentTradeId":app.ZDMData.parentTradeId, "tradeId":app.ZDMData.tradeId, "aucNumId":app.ZDMData.ratedUid, "feedback":$("#J_CommentPoster").val()};
                    app.mtopH5Api.getApi('mtop.gene.feedCenter.createItemFeed', '1.0', data, {}, function (result) {
                        if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                            app.navigation.push("my/p1");
                        }
                    });
                }
            }
        ],

        events:{
            "click #J-addPicBtn":"triggerUploader"
        },

        triggerUploader:function (e) {
            e.preventDefault();
            $("#J-upload").trigger("click");

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
                var picInput = app.navigation.getData("picInput");

                $("#J-addPicWrap").html(picInput);

                $("#J-ratedUid").val(app.ZDMData.ratedUid);
                $("#J-tradeId").val(app.ZDMData.tradeId);
            }

            $("#J_CommentPoster").keyup(function () {

                var val = $(this).val(),
                    valCount = val.replace("/[^/x00-/xff]/g", "**").length;
                $("#J-num").text(valCount);
                if (valCount >= 140) {
                    $(this).val(val.substr(0, 140));
                }

            });
        },

        unload:function () {
            // implement super.unload
        }

    });

})(window['app']);