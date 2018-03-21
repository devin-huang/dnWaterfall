(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function ($) {

    'use strict';
    /* Defind Plugin */
    var _PLUGIN_    = 'dnWaterfall';
    var _VERSION_   = '1.0.0';

    if ( $[ _PLUGIN_ ] && $[ _PLUGIN_ ].version > _VERSION_ )
    {
        return;
    }

    /* Init Object */
    $[_PLUGIN_] = function($container,options){
        var self = this ;
        this.container = $container ;
        this.options   = options ;
        this.winWd = $(window).width() ;
        this.winHg = $(window).height() ;
        this.scrolltop = 0;
        this.defalutCol= 0 ;
        this.api       = [ "init", "destroy" ];
        this.init();

        $(window).on('resize', function(event) {
          self.getBeforeContent();
          if(self.defalutCol === self.attrVal[0]) return ;
          self.init();
          self.defalutCol= self.attrVal[0];
        });

        $(window).on('scroll',function(){
          self.scrolltop = $(this).scrollTop();
          self.showIMG()
        });

        $(this.container.find(".waterfall-area")).on("click",function(){
          let src = $(this).find('img.waterfall-pic').attr('src');
          self.slide(src);
        });

        return this ;
    };

    $[_PLUGIN_].version = _VERSION_;

    $[_PLUGIN_].defaults = {
        "name"    : "Devin" ,
        "isClass" : false , 
        "doFn"    : null ,
    }; 

    /* Prototype Function */
    $[_PLUGIN_].prototype = {
        init : function (){
            let _this_ = this ;
            this.getBeforeContent();
            this.createDom();
            this.getImgItems();
            this.setImgArrs();
            this.deleteDefaultImgDOM()
        },
        getBeforeContent : function(){
          let _this_ = this ;
          this.content   = window.getComputedStyle(_this_.container.get(0),'::before').getPropertyValue('content') ;
          this.attrVal   = this.content.replace(/\"/g,'').split("+") ;
        },
        getImgItems : function(){
          let _this_ = this  ,
              IMG  = this.container.find('img.waterfall-img').map(function(index, elem) {
                return elem.getAttribute("lazy-src");
              }) ;
              return this.filterImgItem(IMG)
        },
        deleteDefaultImgDOM : function(){
          this.container.children('img.waterfall-img').hide();
        },
        filterImgItem : function(IMG){
          let _this_ = this ,
              imgArr = [] ,
              arr    = [...Array(parseInt(_this_.attrVal[0])).keys()] ;
              return arr.map(i=>IMG.filter((index)=> index%arr.length ==i));
        },
        setImgArrs : function(){
          let _this_ = this ,
              count  = 0 ,
              len    = this.container.find('img.waterfall-img').length -1 ,
              imgArr = this.getImgItems() ;
            $.each(imgArr,function(i, e) {
              $.each(e,function(index, el) {
                
                  let src   = _this_.container.hasClass('done') ? imgArr[i][index] : '' ;
                  let statu = _this_.container.hasClass('done') ? 'done' : 'hidden' ;

                  let html = `<div class="waterfall-area">
                                <a class="waterfall-link" href="javascript:void(0)">
                                  <img lazy-src="${imgArr[i][index]}" class="waterfall-pic ${statu}" src="${src}"></img>
                                </a>
                              </div>`;

                  _this_.column.eq(i).append(html);
                  if(count >= len){
                    _this_.showIMG();
                  } 
                  count++;
                
              });
            });            

        },
        showIMG : function(){
          let _this_ = this ;

          this.container.addClass('done').find(".waterfall-pic").each((index,ele)=> {
            let $ele = $(ele) ;
            setTimeout(function(){
              let top   = $ele.offset().top ;
              (_this_.winHg  + _this_.scrolltop > top) ? $ele.addClass('done').attr("src" , $ele.attr("lazy-src") ).fadeIn().parent('.waterfall-link').addClass('loaded') : null;

              (setTimeout(function(){
                if( $ele.hasClass('done') ){
                  $ele.removeClass('hidden')
                  .parents('.waterfall-area').addClass('done');
                }
              }, 500 ))

            }, index * 5);   
          })      
        },
        createDom : function(){
          let _this_ = this , 
              html   = '<div class="column '+ this.attrVal[1] +'"></div>';
          this.deleteDom();
          for(var i = 0 ; i < _this_.attrVal[0] ; i++){
            _this_.container.prepend(html);
          }
          this.column = this.container.find('.column') ;
        },
        deleteDom : function(){
          this.column    = this.container.find('.column') ;
          this.column.remove();
        },
        slide : function(imgSrc){
          let mask  =  $('<div class="dnWaterfall-mask" />') ,
              box   =  $('<div class="dnWaterfall-box" />') ;
          this.column.parents('body').prepend(mask).find(mask).prepend(box);

          let imgObj = new Image() ;
          $(imgObj).on('load error', function(){
            let wd = imgObj.width ,
                hg = imgObj.height ;
            box.prepend(imgObj).css({
              "marginLeft" : -wd / 2 ,
              "marginTop"  : -hg / 2
            });
          });
          imgObj.src = imgSrc;

          mask.on('click' , function(e){
            if(e.target.tagName === 'IMG') return ;
            $(mask).remove();
          })
        },
        destroy : function(){
        },    
        defaultDOM : function(dir){
        },  
        _api_: function()
        {
            var self_ = this,
                api = {};

            $.each( this.api,
                function( i )
                {
                    var fn = this;
                    api[ fn ] = function()
                    {   
                        var re = self_[ fn ].apply( self_, arguments );
                        return ( typeof re == 'undefined' ) ? api : re;
                    };
                }
            );
            return api;
        },
    };

    /* The jQuery plugin */
    $.fn[_PLUGIN_] = function(options){

        options = $.extend( true, {} , $[_PLUGIN_].defaults , options );
        return this.each(function(){
            $(this).data( _PLUGIN_, new $[_PLUGIN_]( $(this), options )._api_() );
        });

    };

}));
