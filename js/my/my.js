(function (app, undef) {

    var myGood = app.page.define({
        name:"myGood",
        title:'我的商品', //title bar的文案
        route:"my\/p(P<pageNo>\\d+)",
        templates:{
           "layout":JST['template/good_layout'],
           "commentItem":JST['template/good_commentItem'],
           "goodItem":JST['template/good_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],





        _queryComments:function(ids){

            var self = this;
            $.ajax({
                url:"json/querycomment.json?itemIds="+ids,
                dataType:"json",
                success:function(resp){
                    var  list = resp.data.dataList;

                    _.each(ids,function(id){

                       var t = _.where(list,{"aucNumId":id});

                       var comment = t.length >0  ? t[0] : '';
                        console.log(comment);
                       $("#J-commentItem-"+id).find(".good-item").after( self.templates['commentItem']({comment:comment}));

                    })


                }
            });


        },
        // load good list
        loadGoodList:function(){

            var self = this;
            var navigation = app.navigation;
            var pageNo = navigation.getParameter("pageNo");
            var itemIdsArr = [];
            var url = {api:"mtop.mz.getMyMzList",data:{"page": pageNo || 1, "pagesize": "12"}};

            $.ajax({
                url:"json/goodlist.json",
                dataType:"json",
                success:function(resp){

                    console.log(resp);

                    //TODO:write a parse function to flatten the child order
                    var goodList = resp.data.cell;

                    $("#J-goodList").html(self.templates['goodItem']({goods:goodList}));


                    $(".z-mod").each(function(index,node){
                        itemIdsArr.push($(node).attr("data-itemId"));
                    });

                    self._queryComments(itemIdsArr);




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

          content.html(self.templates['layout']());

          //reset the input[type=file]  value to empty,so ensure of fire the change event
          $("#J-upload").val("");

          //delegate events
          app.Util.Events.call(this,"#J-myGood",this.events);


          this.loadGoodList();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);