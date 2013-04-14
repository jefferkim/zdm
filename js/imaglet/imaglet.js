(function (app, undef) {

    var imaglet = app.page.define({
        name:"imaglet",
        title:'<span class="h-tab">图文详情</span><span class="h-tab">产品参数</span>', //title bar的文案
        route:"imaglet\/(P<id>\\d+)",
        templates:JST['template/imaglet'],
        //buttons of navigation
        buttons:[
            {
                type:'back',
                text:'宝贝详情'
            }
        ],

        events:{
            //'click #J_commtab li':'tabClick'


        },

        _formatImg:function(str){
            var f = '300x300';
             var content = str.replace(/<img[^>]+taobao[^>]+jpg[^>]*>/ig, function(img) {
                    if(img.search(/\d+x\d+\.jpg/) > -1 || img.match(/jpg/g).length > 1)  return img;
                    var s = img.indexOf('"') + 1,
                        e = img.lastIndexOf('"'),
                        src = img.slice(s,e);
                    return img.slice(0,s) + app.Util.getWebpImg(src,f) + img.slice(e);
                });
            return content;
        },



        ready:function () {
            // implement super.ready
            var that = this;

            var id = this.itemId  = app.navigation.getParameter("id");
            var content = $(app.component.getActiveContent());
            content.html(this.templates());


            this.el = content;



            var host = app.helper.fetchHost();
            //this.url = 'json/desc.json';
            this.url = 'http://a.' + host + '.taobao.com/ajax/desc_list.do';
            //this.loading = this.$('#J_icload');
            //this.contbar = this.$('#J_imagetCont_ic');
            this.imgSize = '300x300';
            this.isFirst = true;
            this.cachePages = [];




            //delegate events
            app.Util.Events.call(this, "#J-myGood", this.events);


            this.fetch(id);

        },

        unload:function () {
            // implement super.unload
        },


        template : function($data){
            /*var that=this;
             $.ajax({
             url : './js/template/imaget.html',
             type : "get",
             dataType : "html",
             success : function(html){
             console.log(template.compile('imaget',html))
             if(that.imagetTmpl){
             template.compile('imaget',html)
             }
             }
             });*/
            var $helpers=this,$out='';
            $out+='<section class=\"innercontent\">\r\n	<div id=\"J_imagetCont\">\r\n		<div id=\"J_imagetCont_ic\" class=\"it-cont\"></div>\r\n		<div id=\"J_icpage\" class=\"c-pnav-con\"></div>\r\n	</div>\r\n	<div id=\"J_param\" class=\"it-param none\">\r\n		<div id=\"J_paload\" class=\"c-loading dc-load\">\r\n			<span></span>\r\n		</div>\r\n	</div>\r\n</section>\r\n';
            return $out;
        },

        format : function(str){
            var f = this.imgSize,
                content = str.replace(/<img[^>]+taobao[^>]+jpg[^>]*>/ig, function(img) {
                    if(img.search(/\d+x\d+\.jpg/) > -1 || img.match(/jpg/g).length > 1)  return img;
                    var s = img.indexOf('"') + 1,
                        e = img.lastIndexOf('"'),
                        src = img.slice(s,e);
                    return img.slice(0,s) + app.Util.getWebpImg(src,f) + img.slice(e);
                });
            return content;
        },
        render: function(n){
            scrollTo(0,0);
            n = n || 1;
            var that = this,
                datas;
            if(that.cachePages[n-1]){
                datas = that.cachePages[n-1];
            }
            else{
                datas = that.format(that.list[n-1]);
                that.cachePages[n-1] = datas;
            }
            if(that.isFirst){
                that.el.html(that.template());
                that.contbar || (that.contbar = $('#J_imagetCont_ic'));
                that.isFirst = null;
            }
            that.isFirst || that.contbar.html(datas);
            //that.loading.addClass('none');
        },
        fetch : function(id){
            var that = this;
            //that.loading.removeClass('none');
            $.ajax({
                url: that.url,
                dataType: 'jsonp',
                data : {item_id : id},
                success: function(data){
                    if(data && data.pages && data.pages.length){
                        that.list = data.pages;
                        that.images = that.images;
                        that.render();
                        if(!that.pageNav){
                            var pageInstance = that.pageNav = new PageNav({'id':'#J_icpage','index':1,'pageCount':data.pages.length,'disableHash':true});
                            pageInstance.$container.on('P:switchPage',function(e,page){
                                that.render(page.index);
                                if(page.type == 'next'){ // 下一页埋点
                                    //utils.sendPoint('nextpage2#h#detail');
                                }
                            });
                        }
                    }
                    else{
                        that.list = ['<p class="itc-p">无图文详情</p>'];
                        that.render();
                        //that.loading.addClass('none');
                    }
                   // open.loadHide();
                },
                error: function(){
                    that.el.html('<p class="itc-p">' + message.errorMessage + '</p>');
                   // open.loadHide();
                    //that.loading.addClass('none');
                }
            });
        },
        fetchParam : function(id){
            this.paramInstance = new paramView({el : '#J_param'});
            this.paramInstance.getData(id);
        },
        destroy : function(){
            this.paramInstance && this.paramInstance.destroy();
            this.pageNav && this.pageNav.eventDetach();
            this.el.html('');
            this.el = null;
        }









    });


})(window['app']);