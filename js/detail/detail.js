(function (app, undef) {

    var detail = app.page.define({
        name:"detail",
        title:'', //title bar的文案
        route:"detail\/id(P<pageNo>\\d+)",
        template:"js/detail/detail.tpl",
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'返回'
            }
        ],

        //是否支持上传图片
        _supportImgUpload:function(){



        },

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

            this.fill({});
            //this.loadListData();
        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);