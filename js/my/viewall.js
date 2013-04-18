(function (app, undef) {

    var viewAll = app.page.define({
        name:"viewAll",
        title:'所有评论', //title bar的文案
        route:"viewAll\/(P<itemId>\\d+)\/(P<ratedUid>\\d+)\/p(P<pageNo>\\d+)",
        templates:{
           "layout":JST['template/viewall_layout']
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

            var pageNo = app.navigation.getParameter("pageNo");
            var data = {"ratedUid":this.ratedUid,"tradeId":"0", "itemIds":this.itemId,"pageSize":"10","pageIndex":pageNo || 1};
            var totalPage = 1;
            app.mtopH5Api.getApi( 'mtop.gene.feedCenter.queryFeedItems', '1.0',  data,{},  function (result) {

                if (result.ret && result.ret[0] == 'SUCCESS::调用成功' && result.data) {
                    var comments = result.data.dataList;
                    var html = self.templates['layout']({good:result.data.data,comments:comments});


                    $(app.component.getActiveContent()).find("#J_viewAllLayout").html(html);

                    var totalSize = result.data.total;
                    if(totalSize < 10){
                        totalPage = 1;
                    }else if(totalSize == 10 && result.data.hasNext == "true"){
                        totalPage = 50;
                    }else if(totalSize <= 10 && result.data.hasNext == "false" ){
                        totalPage = 1;
                    }

                    var pageInstance = self.pageNav = new PageNav({'id':'#J-allComments', 'index':1, 'pageCount':totalPage,'objId':'p'});

                }else{
                    notification.flash("评论请求失败，请重试").show();
                }

            });

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
          // implement super.ready
          var self = this;
          var content = $(app.component.getActiveContent());
          var navigation = app.navigation;

          this.itemId = navigation.getParameter("itemId");
          this.ratedUid = navigation.getParameter("ratedUid");

          content.html('<section id="J_viewAllLayout" class="innercontent"></section>');

          //delegate events
         // app.Util.Events.call(this,"#J-myGood",this.events);

          this._queryComments();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);