(function (app, undef) {

    var myGood = app.page.define({
        name:"myGood",
        title:'我的商品', //title bar的文案
        route:"my\/p(P<pageNo>\\d+)",
        templates:{
           "layout":JST['template/good_layout'],
           "commentItem":JST['template/comment_item'],
           "goodItem":JST['template/good_item']
        },
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],



        // load good list
        loadGoodList:function(){

            var self = this;
            var navigation = app.navigation;
            var pageNo = navigation.getParameter("pageNo");
            var result,goodList;
            var url = {api:"mtop.mz.getMyMzList",data:{"page": pageNo || 1, "pagesize": "12"}};

            $.ajax({
                url:"json/goodlist.json",
                dataType:"json",
                success:function(resp){

                    console.log(resp);

                    goodList = resp.data.cell;
                    $("#J-goodList").html(self.templates['goodItem']({goods:goodList}));





                 //   that.fill({list:data1});

                }
            });


        },

        ready:function () {
          // implement super.ready
          var self = this;
          var content = $(app.component.getActiveContent());
          var navigation = app.navigation;

          content.html(self.templates['layout']());

          this.loadGoodList();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);