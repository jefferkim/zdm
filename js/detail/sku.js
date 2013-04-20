(function (app, undef) {

   app.sku = {
       init:function(data){


           console.log(data);
          // var data = $.TBDetail || {};
           //this.url = data.propsAjaxUrl;
           this.isIpad = data.isIpad;  //ipad客户端
           this.isJu = null;//TBDetail.jhsData;  //聚划算


           this.el = $(".d-sku");



           this.template = JST['template/detail_sku'];

           $("#J-dSKU").html(this.template({item:data.item,seller:data.seller,sku:data.skuData}));

           //定义常用变量，避免重复操作DOM
           this.skuId = $('#sku-id');
           this.skuLimit =  $('#sku-limit');
           this.skuAll =  $('#sku-all');
           this.porigin = $('.dc-origin');
           var ppromo = $('.dc-promo');  //促销
           this.ppromo = ppromo.length && ppromo || null;
           ppromo = this.ppromo;
           var ppromotjb = ppromo && ppromo.find('.coins');  //是否有淘金币
           this.tjbText = ppromotjb && ppromotjb.length && ' ' + ppromotjb.text() || '';

           this.priceori = this.porigin.html();
           this.priceomo = ppromo && ppromo.html();
           this.promoTxt = ppromo && ppromo.prev() && ppromo.prev().text().slice(0,-1) || '价格';
           this.firstLoad = true;


           //数据
           var skudata = data.skuData || {};
           this.skuProps = skudata.skuProps || [];
           this.availSKUs = skudata.availSKUs || {};




           app.Util.Events.call(this,"#tbh5v0",this.events);


           if(this.skuProps.length){
               this.render();
           }
           else{
               // this.$el.hide();
           }

       },



       events: {
           'click #sku-drow' : 'fold',
           'click #sku-limit' : 'unfold',
           'click .dsmp-v i' : 'select'
       },

       resize : function(callback){
           var that = this,
               skuAll = that.skuAll,
               skuFuc = function(){
                   that.width = skuAll.width() + 10;
                   callback && callback.call(that);  //确定width
                   that.height = skuAll.height();
               };
           if(skuAll.hasClass('none')){
               app.Util.getActualSize(skuAll,skuFuc);
               /*skuAll.css({'position':'absolute','width':'100%','left':-2000,'top':-2000}).removeClass('none');  //obtain element actual height
                skuFuc();
                skuAll.css({'position':'static','width':'auto','left':0,'top':0}).addClass('none');*/
           }
           else{
               skuFuc();
           }
       },
       contract : function(){
           var that = this,
               skuLimit = this.skuLimit,
               skuAll = that.skuAll;
           //定义sku常用dom
           that.skuSel = $('.dsm-sel');
           that.skuLap = $('.dsm-lap');
           that.skuSep = $('.dst-sep');

           /*that.$('#sku-limit').on('touchstart',function(e){
            that.unfold.call(that,e);
            });
            that.$('#sku-drow').on('touchstart',function(e){
            that.fold.call(that,e);
            });*/
           that.resize(that.adjust);
           //旋转
           app.Util.resize(function(){
               if(skuAll.hasClass('none')){
                   that.resize(that.setImgEle);
               }else{
                   that.height = skuAll.height();
                   that.width = skuAll.width() + 10;
                   that.setImgEle();
               }
           });
           //window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize',,false);
       },
       unfold : function(str){
           var that = this,
               isScroll = str && typeof str == 'string' && str == 'noScroll',  //是否需要置顶，ipad不需要
               skuLimit = that.skuLimit,
               skuAll = that.skuAll,
               height = that.height;
           if(skuLimit.hasClass('none')){return;}

           !isScroll && scrollTo(0,skuLimit.offset().top - 58);
           $("#J-dInfo").removeClass("fold");
           skuLimit.addClass('none');
           /*skuAll.removeClass('none');
            !isScroll && utils.sendPoint('showsku%23h%23detail');*/
           skuAll.css('height',28).removeClass('none').animate({'height':height},500,'ease-out',function(){
               skuAll.css('height','auto');
            //   !isScroll && app.Util.sendPoint('showsku#h#detail');
           });
       },
       fold : function(e){
           e.preventDefault();
           var that = this,
               skuLimit = that.skuLimit,
               skuAll = that.skuAll,
               height = that.height;
           $("#J-dInfo").addClass("fold");
           setTimeout(function(){
               scrollTo(0,skuAll.offset().top - 58);
           },200);


           /*skuLimit.removeClass('none');
            skuAll.addClass('none');
            utils.sendPoint('hidesku%23h%23detail');*/
           skuAll.css('height',height).animate({'height':28},500,'ease-out',function(){
               skuLimit.removeClass('none');
               skuAll.addClass('none').css('height','auto');
           //    app.Util.sendPoint('hidesku#h#detail');
           });
       },
       showImg : function(obj){
           function getNext(o){
               var no = o.next();
               if(no.length == 0) return null;
               else return no.hasClass('last') ? no : arguments.callee(no);
           }
           var nextObj;
           if(obj.hasClass('last')) nextObj = obj;
           else nextObj = getNext(obj);
           if(!nextObj){return;}

           var src = obj.attr('data-img'),
               dsInsert = obj.parent().find('.ds-insert'),
               img = dsInsert && dsInsert.find('img'),
               dsSpan = dsInsert && dsInsert.find('span');
           if(src){
               src += '_120x120.jpg';
           }
           else{
               dsInsert.hide();return;
           }
           dsSpan && dsSpan.removeClass('none');
           if(dsInsert.length == 0){
               nextObj.after('<span class="ds-insert c-loading"><span></span><img src="'+src+'" /></span>');
               dsInsert = nextObj.next();
               img = dsInsert.find('img');
               dsSpan = dsInsert.find('span');
               img[0].onload = function(){
                   $(this).animate({'opacity':1},200,'linear');
                   dsSpan.addClass('none');
               }
           }
           else{
               nextObj.after(dsInsert);
               dsInsert.show();
               img.attr('src' , src);
           }
           if(this.cacheSrc != src){  // Won't trigger load if src unchanged
               img.css({'opacity':0});
               this.cacheSrc = src;
           }
           else{
               dsSpan.addClass('none');
           }
       },
       select : function(e){
           e.preventDefault();
           var that = this;
           $target = $(e.target);
           if($target.hasClass('disabled')) return;
           that.skuId.val('');
           if($target.hasClass('sel')){
               $target.removeClass('sel');
               $target.parent().find('.ds-insert').hide();
           }
           else{
               $target.addClass('sel');
               $target.siblings().removeClass('sel');
               that.showImg($target);
           }
           that.notice();
           that.disable();
       },
       notice : function(){
           var sels = $('.sel'),
               len = sels.length,
               allLen = this.skuProps.length,
               skuSel = this.skuSel,
               skuSep = this.skuSep,
               skuLap = this.skuLap,
               skuAll = this.skuAll;
           var chosenPropNames  = [],
               chosenPropValues = [],
               noselProp;
           sels.each(function(i,s){
               chosenPropNames.push($(s).parent().prev().text().replace(':',''));
               chosenPropValues.push($(s).text());
           });
           noselProp = _.difference(this.propsName,chosenPropNames);
           var seltxt = '',
               promotxt = '',
               priceor = this.priceori,
               pricepo = this.priceomo,
               tjbText = this.tjbText;
           if(len == 0){  // no select
               skuSel.addClass('none');
           }
           else if(len == allLen){  // all select
               seltxt = '已选：'+_.map(chosenPropValues,function(n){return '"'+n+'"';}).join(' ');
               var temp = _.map(sels,function(n){return n.getAttribute('data-id')}),
                   tempobj = this.availSKUs[temp.join(';')];
               promotxt = this.promoTxt+'：<em class="red">￥'+(tempobj.promoPrice || tempobj.price) + tjbText +'</em>'+ (!this.isJu && '(库存'+tempobj.quantity+'件)' || '');
               priceor = '￥' + tempobj.price;
               pricepo = tempobj.promoPrice && ('￥' + tempobj.promoPrice) || priceor;
               pricepo += tjbText;
               /*if(tempobj.tmall){  //天猫特色服务
                skuSep.find('span').html(tempobj.tmall);
                skuSep.removeClass('none');
                }*/
               skuLap.removeClass('none');
               this.skuId.val(tempobj.skuId);
           }
           else{
               seltxt = '已选："'+chosenPropValues.join(' ')+'" 还未选 <em class="red">'+noselProp.join(' ')+'</em>';
               skuSel.removeClass('none');
               skuSep.addClass('none');
               skuLap.addClass('none');
           }
           skuSel.html(seltxt);
           skuLap.html(promotxt);
           this.porigin.html(priceor);  //cost price
           this.ppromo && this.ppromo.html(pricepo);  //promo price
           this.height = skuAll.height();
       },
       disable : function(){
           var that = this;
           $props.removeClass('disabled');
           var $sels = $('.sel');
           if ($sels.length == 0) return;
           if ($('.dsmp-v').length == 1) return;    // just one property, no need to disable values
           $props.each(function() {
               var $this = $(this);
               if ($this.hasClass('sel')) {
                   var $others = $this.parent().parent().siblings().find('i');  // values of other properties
                   $others.each(function(i, e) {
                       var available = false;
                       for ( var key in that.availSKUs ) {
                           if ( key.search( $this.attr('data-id') ) > -1 && key.search( $others.eq(i).attr('data-id') ) > -1 ) {
                               available = true;
                               break;
                           }
                       }
                       if ( !available ) $others.eq(i).addClass('disabled');
                   });
               }
           });
       },
       setImgEle : function(){
           var width = this.width,
               outerArr = this.skuAll.find('.dsmp-v'),
               arr,tempw,$prev,$this;
           outerArr.each(function(){   //每行的最后一个标识
               arr = $(this).find('i');
               tempw = 0;
               for(var i=0,len=arr.length;i<len;i++){
                   $this = $(arr[i]);
                   tempw += ($this.width() + 10);
                   $this.removeClass('last');
                   if(tempw > width){
                       $prev = $this.prev();
                       $prev = $prev.hasClass('ds-insert') && $prev.prev() || $prev;  //排除插入的span元素
                       $prev.addClass('last');
                       tempw = ($this.width() + 10);
                   }
               }
               arr.last().addClass('last');  // increase 'last' if it's this last
           });
       },
       adjust : function(){
           $props =  $('.dsmp-v i');

           var $this,width;
           $props.each(function() {
               $this = $(this);
           //    console.log($this);
               width = $this.width();

               console.log(width);
               if ( width < 32 ) { $this.addClass('a');}
               else if ( width < 80 )  { $this.addClass('b');}
               else if ( width < 138 ) { $this.addClass('c');}
               else { $this.addClass('d');}
           });
           this.setImgEle();
       },
       render : function(){

           var that = this,
               skuProps = that.skuProps;
           //console.log(skuProps);
           if(skuProps.length) this.el.show();
           else this.el.hide();
           var content = that.outputHtml(skuProps);
        //   console.log(that.skuAll);
        //   console.log(content);

           that.skuAll.html(content);

           if(that.firstLoad){
               that.contract();
               //that.options.action.previousAction(that.availSKUs,that);
               that.isIpad && that.unfold('noScroll');
               that.firstLoad = null;
           }
           else{
               that.resize(that.adjust);
           }
       },
       outputHtml : function(json){
           var props = this.propsName = _.pluck(json,'name'),
               content = ['<p class="dsm-s">请选择 <em class="red">'+props.join('/')+'</em></p>'];
           for(var i=0,len=json.length;i<len;i++){
               content.push('<div class="dsm-p"><p class="dsmp-n">'+json[i].name+':</p><div class="dsmp-v">');
               _.each(json[i].values,function(item){
                   content.push('<i data-id="'+item.id+'" '+(item.img && "data-img="+item.img+"" || "")+'>'+item.txt+'</i>');
               });
               content.push('</div></div>');
           }
           content.push('<p class="dsm-sel none"></p><p class="dst-sep none">特色服务：<span class="gray12"></span></p><p class="dsm-lap none"></p>');
           content.push('<div class="dsm-f"><a id="sku-drow" href="#" class="dsmf-a"><b class="aw up"></b></a></div>');
           return content.join('');
       },
       destroy : function(){
           //this.undelegateEvents(); //清除events内的事件
           this.skuId = this.skuLimit = this.skuAll = this.porigin = this.ppromo = this.skuSel = this.skuLap = this.skuSep = $props = null;
           this.remove();
       }
   }


})(window['app']);