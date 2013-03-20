(function (app, undef) {

    var home = app.page.define({
        name:"list",
        title:'<h1 id="logo"></h1>', //title bar的文案
        route:"home",
        template:"./default/default.tpl",
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],




        loadListData:function () {
            var that = this;
            $.ajax({
                url:"json/list.json",
                dataType:"json",
                success:function (resp) {
                    var data = resp.data.defaultData;
                    var data1 = app.Util._parseData(data);
                    that.fill({list:data1});
                }
            })
        },

        ready:function () {
            var content = $(app.component.getActiveContent());

            content.html('<div class="loading"></div>');
            // implement super.ready
            this.loadListData();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);