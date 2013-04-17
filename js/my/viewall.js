(function (app, undef) {

    var viewAll = app.page.define({
        name:"viewAll",
        title:'所有评论', //title bar的文案
        route:"viewAll\/(P<itemId>\\d+)\/(P<ratedUid>\\d+)\/p(P<pageNo>\\d+)",
        templates:{
           "layout":JST['template/viewall_layout'],
           "comments":JST['template/comment_item'],
           "goodItem":JST['template/good_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],

        _queryComments:function(){

            var self = this;
            var data = {"ratedUid":this.ratedUid,"tradeId":"0", "itemIds":this.itemId,"pageSize":"10","pageIndex":"1"};

            app.mtopH5Api.getApi( 'mtop.gene.feedCenter.queryFeedItems', '1.0',  data,{},  function (result) {

                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    var comments = result.data.dataList;
                    var html = self.templates['comments']({comments:comments});
                    console.log(html);

                    $(app.component.getActiveContent()).find("#zdm-comment").html('<ul class="zdm-comment-block">'+html+'</ul>');
                }else{
                    notification.flash("评论请求失败，请重试").show();
                }

            });

        },

        renderItem:function(){

            if(app.ZDMData.itemHtml){
                $("#J-goodSection").html(app.ZDMData.itemHtml);
            }else{

            }
        },


        events:{
            "click .J-addPic":"triggerUploader"

        },

        triggerUploader:function(e){
            e.preventDefault();
            $("#J-upload").trigger("click");

           $("#J-upload").on("change",function(){
                app.navigation.push("upload",{datas:{"picInput":$("#J-upload")}});
           });

        },

        ready:function () {
          console.log("view all");
          // implement super.ready
          var self = this;
          var content = $(app.component.getActiveContent());
          var navigation = app.navigation;

          this.itemId = navigation.getParameter("itemId");
          this.ratedUid = navigation.getParameter("ratedUid");

          content.html(self.templates['layout']());

          //delegate events
         // app.Util.Events.call(this,"#J-myGood",this.events);

          this.renderItem();
          this._queryComments();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);