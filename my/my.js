(function (app, undef) {

    var my = app.page.define({
        name:"my",
        title:'<h1 id="logo"></h1>', //title bar的文案
        route:"my\/p(P<pageNo>\\d+)",
        template:"./default/default.tpl",
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            },
            {
                type : 'func',
                text : '下一页',
                handler : function(e) {
                    listPage.nextPage();
                }
            }
        ],




        loadListData:function(){

            var that = this;
            var navigation = app.navigation;
          /*  self._hideNav();
            $("#J-list").html('<div class="loading"><span></span></div>');
            $("#J-pageNav").html('');
            $("#J-My").addClass('cur');*/

            var pageNo = navigation.getParameter("pageNo");

            var url = {api:"mtop.mz.getMyMzList",data:{"page": pageNo || 1, "pagesize": "12"}};

            $.ajax({
                url:"json/list.json",
                dataType:"json",
                success:function(resp){

                    var data = resp.data.defaultData;
                    var data1 = app.Util._parseData(data);
                    that.fill({list:data1});

                }
            });

        },

        ready:function () {
          // implement super.ready
          var content = $(app.component.getActiveContent());
          var navigation = app.navigation;

          content.html('<div class="loading"></div>');

          this.loadListData();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);