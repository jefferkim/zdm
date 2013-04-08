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
                handler:function(){
                    $("#J-imgForm").submit();

                }
            }
        ],





        // load good list
        loadGoodList:function(){




        },

        events:{
            "click #J-addPicBtn":"triggerUploader"

        },

        triggerUploader:function(e){
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
          app.Util.Events.call(this,"#J-uploader",this.events);

          if(app.navigation._cur.state.datas){
              var picInput = app.navigation.getData("picInput");

              $("#J-addPicWrap").html(picInput);
          }


          //$("#J-upload").val("");

          //delegate events
        //  app.Util.Events.call(this,"#J-myGood",this.events);



        },

        unload:function () {
            // implement super.unload
        }

    });


})(window['app']);