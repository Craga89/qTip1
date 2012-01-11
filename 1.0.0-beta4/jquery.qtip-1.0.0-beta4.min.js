/**
 * jquery.qtip. The jQuery tooltip plugin
 * 
 * Copyright (c) 2009 Craig Thompson
 * http://craigsworks.com
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : February 2009
 * Version : 1.0.0-beta4
 * Released: Monday 6th April, 2009 - 20:12
 */

(function($)
{$.fn.qtip=function(options)
{if(typeof options=='string')
{if(options=='api')return $(this).eq(0).data('qtip');}
else
{if(!options)options={};if(typeof options.content!=='object')options.content={text:options.content};if(typeof options.content.title!=='object')options.content.title={text:options.content.title};if(typeof options.position!=='object')options.position={corner:options.position};if(typeof options.position.corner!=='object')options.position.corner={target:options.position.corner,tooltip:options.position.corner};if(typeof options.show!=='object')options.show={when:options.show};if(typeof options.show.when!=='object')options.show.when={event:options.show.when};if(typeof options.show.effect!=='object')options.show.effect={type:options.show.effect};if(typeof options.hide!=='object')options.hide={when:options.hide};if(typeof options.hide.when!=='object')options.hide.when={event:options.hide.when};if(typeof options.hide.effect!=='object')options.hide.effect={type:options.hide.effect};if(typeof options.style!=='object')options.style={name:options.style};options.style=sanitizeStyle(options.style);var opts=$.extend(true,{},$.fn.qtip.defaults,options);opts.style=buildStyle.call({options:opts},opts.style);opts.user=$.extend(true,{},options);}
return $(this).each(function()
{if(typeof options=='string')
{switch(options)
{case'show':$(this).data('qtip').show();break;case'hide':$(this).data('qtip').hide();break;case'focus':$(this).data('qtip').focus();break;case'disable':$(this).data('qtip').disable(true);break;case'enable':$(this).data('qtip').disable(false);break;case'destroy':$(this).data('qtip').destroy();break;}}
else
{var config=$.extend(true,{},opts);config.hide.effect.length=opts.hide.effect.length;config.show.effect.length=opts.show.effect.length;if(config.position.container===false)config.position.container=$(document.body);if(config.position.target===false)config.position.target=$(this);if(config.show.when.target===false)config.show.when.target=$(this);if(config.hide.when.target===false)config.hide.when.target=$(this);var obj=new qTip($(this),config);$(this).data('qtip',obj);}});}
function qTip(target,options)
{var self=this;self.options=options;self.elements={target:target.addClass(self.options.style.classes.target),tooltip:null,wrapper:null,content:null,contentWrapper:null,title:null,tip:null};self.mouse={};self.timers={};$.extend(self,self.options.api,{show:function(event)
{self.elements.tooltip.stop(true,true);var returned=self.beforeShow.call(self,event);if(returned===false)return;function afterShow(){self.onShow.call(self,event);}
if(typeof self.options.show.when.target.data('qtip-toggle')=='number')
self.options.show.when.target.data('qtip-toggle',1);self.updatePosition(event);if(typeof self.options.show.solo=='object')var solo=$(self.options.show.solo);else if(self.options.show.solo===true)var solo=$('div.qtip').not(self.elements.tooltip);if(solo)solo.each(function(){$(this).qtip('api').hide();});if(typeof self.options.show.effect.type=='function')
{self.options.show.effect.type.call(self.elements.tooltip,self.options.show.effect.length);self.elements.tooltip.queue(function(){afterShow();$(this).dequeue();});}
else
{switch(self.options.show.effect.type)
{case'fade':self.elements.tooltip.fadeIn(self.options.show.effect.length,afterShow);break;case'slide':self.elements.tooltip.slideDown(self.options.show.effect.length,function()
{afterShow();self.updatePosition(event,true);});break;case'grow':self.elements.tooltip.show(self.options.show.effect.length,afterShow);break;default:self.elements.tooltip.show(null,afterShow);break;}
self.elements.tooltip.addClass(self.options.style.classes.active);}
if(self.options.position.type.search(/(fixed|absolute)/)!==-1)self.focus();self.onShow.call(self,event);return self;},hide:function(event)
{clearTimeout(self.timers.show);self.elements.tooltip.stop(true,true);var returned=self.beforeHide.call(self,event);if(returned===false)return false;function afterHide(){self.onHide.call(self,event);}
if(typeof self.options.show.when.target.data('qtip-toggle')=='number')
self.options.show.when.target.data('qtip-toggle',0);if(typeof self.options.hide.effect.type=='function')
{self.options.hide.effect.type.call(self.elements.tooltip,self.options.hide.effect.length);self.elements.tooltip.queue(function(){afterHide();$(this).dequeue();});}
else
{switch(self.options.hide.effect.type)
{case'fade':self.elements.tooltip.fadeOut(self.options.hide.effect.length,afterHide);break;case'slide':self.elements.tooltip.slideUp(self.options.hide.effect.length,function()
{self.updatePosition(event,true);afterHide();});break;case'grow':self.elements.tooltip.hide(self.options.hide.effect.length,afterHide);break;default:self.elements.tooltip.hide(null,afterHide);break;}
self.elements.tooltip.removeClass(self.options.style.classes.active);}
self.onHide.call(self,event);return self;},updatePosition:function(event,animate)
{var returned=self.beforePositionUpdate.call(self,event);if(returned===false)return false;if(self.options.position.target=='mouse')
{var targetPos={left:self.mouse.x,top:self.mouse.y};var targetLength={height:1,width:1};}
else
{if(self.options.position.target.get(0).nodeName=='AREA')
{var coords=self.options.position.target.attr('coords').split(',');for(var i=0;i<coords.length;i++)coords[i]=parseInt(coords[i]);var mapName=self.options.position.target.parent("map").attr('name');var imagePos=$('img[usemap="#'+mapName+'"]:first').offset();var targetPos={left:Math.floor(imagePos.left+coords[0]),top:Math.floor(imagePos.top+coords[1])};switch(self.options.position.target.attr('shape'))
{case'rect':var targetLength={width:Math.floor(Math.abs(coords[2]-coords[0])),height:Math.floor(Math.abs(coords[3]-coords[1]))};break;case'circle':var targetLength={width:coords[2],height:coords[2]};targetPos.left+=coords[2]+2;targetPos.top+=coords[2]+2;break;case'poly':var targetLength={width:coords[0],height:coords[1]};for(var i=0;i<coords.length;i++)
{if(i%2==0)
{if(coords[i]>targetLength.width)
targetLength.width=coords[i];if(coords[i]<coords[0])
targetPos.left=Math.floor(imagePos.left+coords[i]);}
else
{if(coords[i]>targetLength.height)
targetLength.height=coords[i];if(coords[i]<coords[1])
{targetPos.top=Math.floor(imagePos.top+coords[i]);}}}
targetLength.width=targetLength.width-(targetPos.left-imagePos.left);targetLength.height=targetLength.height-(targetPos.top-imagePos.top);break;}
targetLength.width-=2;targetLength.height-=2;}
else if(self.options.position.target.add(document.body).length!==1)
{var targetPos=self.options.position.target.offset();var targetLength={height:self.options.position.target.outerHeight(),width:self.options.position.target.outerWidth()};}
else
{var targetPos={left:$(document).scrollLeft(),top:$(document).scrollTop()};var targetLength={height:$(window).height(),width:$(window).width()};}
var targetCorner=self.options.position.corner.target;if(targetCorner.search(/right/i)!==-1)targetPos.left+=targetLength.width;if(targetCorner.search(/bottom/i)!==-1)targetPos.top+=targetLength.height;if(targetCorner.search(/((top|bottom)Middle)|center/)!==-1)
targetPos.left+=targetLength.width/2;if(targetCorner.search(/((left|right)Middle)|center/)!==-1)
targetPos.top+=targetLength.height/2;}
var tooltipCorner=self.options.position.corner.tooltip;if(tooltipCorner.search(/right/i)!==-1)
targetPos.left-=self.elements.tooltip.outerWidth();if(tooltipCorner.search(/bottom/i)!==-1)targetPos.top-=self.elements.tooltip.outerHeight();if(tooltipCorner.search(/((top|bottom)Middle)|center/)!==-1)
targetPos.left-=self.elements.tooltip.outerWidth()/2;if(tooltipCorner.search(/((left|right)Middle)|center/)!==-1)
targetPos.top-=(self.elements.tooltip.outerHeight()/2)
targetPos.left+=self.options.position.adjust.x;targetPos.top+=self.options.position.adjust.y;if(self.options.position.adjust.screen)
targetPos=screenAdjust.call(self,targetPos,targetLength,event);if(self.options.position.target=='mouse')
{targetPos.left+=(self.options.style.tip.corner.search(/right/i)!==-1)?-6:6;targetPos.top+=(self.options.style.tip.corner.search(/bottom/i)!==-1)?-6:6;}
if(animate===true)
self.elements.tooltip.animate({left:targetPos.left,top:targetPos.top},200,'swing');else
self.elements.tooltip.css({left:targetPos.left,top:targetPos.top});self.onPositionUpdate.call(self,event);return self;},updateWidth:function(newWidth)
{if(newWidth&&typeof newWidth!=='number')return;var borderWidth=Math.max(self.options.style.border.width,self.options.style.border.radius);if(!newWidth)
{if(typeof self.options.style.width.value=='number')
var newWidth=self.options.style.width.value;else
{var prevWidth=self.elements.tooltip.outerWidth();self.elements.tooltip.css({width:'auto'});if(($.support&&!$.support.cssFloat)||$.browser.msie)
{self.elements.wrapper.css({position:'static',zoom:'normal'});if(self.elements.tip)self.elements.tip.hide();}
var newWidth=self.elements.tooltip.outerWidth()+(borderWidth*2)+1;if(!self.options.style.width.value)
{if(newWidth>self.options.style.width.max)newWidth=self.options.style.width.max
if(newWidth<self.options.style.width.min)newWidth=self.options.style.width.min}}}
if(newWidth%2!==0)newWidth-=1;self.elements.tooltip.width(newWidth);if(self.options.style.border.radius)
{self.elements.tooltip.find('.qtip-betweenCorners').each(function(i)
{$(this).width(newWidth-(self.options.style.border.radius*2));})}
if(($.support&&!$.support.cssFloat)||$.browser.msie)
{self.elements.wrapper.css({position:'relative',zoom:'1'}).width(newWidth);if(self.elements.tip)self.elements.tip.show();}
return self;},updateStyle:function(name)
{if(typeof name!=='string'||!$.fn.qtip.styles[name])
return debug('No such style is defined');self.options.style=buildStyle.call(self,$.fn.qtip.styles[name],self.options.user.style);self.elements.content.css(jQueryStyle(self.options.style));if(self.options.content.title.text!==false)
self.elements.title.css(jQueryStyle(self.options.style.title,true));self.elements.contentWrapper.css({borderColor:self.options.style.border.color})
if(self.options.style.tip.corner!==false)
{if(document.createElement('canvas').getContext)
{var tip=self.elements.tooltip.find('.qtip-tip canvas:first');var context=tip.get(0).getContext('2d');context.clearRect(0,0,300,300);drawTip.call(self,tip,tip.parent('div[rel]:first').attr('rel'),self.options.style.tip.color||self.options.style.border.color);}
else if(($.support&&!$.support.cssFloat)||$.browser.msie)
{var tip=self.elements.tooltip.find('.qtip-tip [nodeName="shape"]');tip.attr('fillcolor',self.options.style.tip.color||self.options.style.border.color)}}
if(self.options.style.border.radius>0)
{self.elements.tooltip.find('.qtip-betweenCorners').css({backgroundColor:self.options.style.border.color})
if(document.createElement('canvas').getContext)
{var borders=calculateBorders(self.options.style.border.radius)
self.elements.tooltip.find('.qtip-wrapper canvas').each(function()
{var context=$(this).get(0).getContext('2d');context.clearRect(0,0,300,300);var corner=$(this).parent('div[rel]:first').attr('rel')
drawBorder.call(self,$(this),borders[corner],self.options.style.border.radius,self.options.style.border.color);});}
else if(($.support&&!$.support.cssFloat)||$.browser.msie)
{self.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function()
{$(this).attr('fillcolor',self.options.style.border.color)});}}
return self;},updateContent:function(content,reposition)
{if(!content)return false;var parsedContent=self.beforeContentUpdate.call(self,content);if(typeof parsedContent=='string')content=parsedContent;else if(parsedContent===false)return;self.elements.content.html(content);var images=self.elements.content.find('img');if(images.length>0)
{var loadedImages=0;images.each(function(i)
{$('<img src="'+$(this).attr('src')+'" />').load(function(){if(++loadedImages==images.length)reposition();});});}
else reposition();function reposition()
{self.updateWidth();if(reposition!==false)
{self.updatePosition(self.elements.tooltip.is(':visible'));if(self.options.style.tip.corner!==false)positionTip.call(self);}}
self.onContentUpdate.call(self);return self;},loadContent:function(url,data,method)
{var returned=self.beforeContentLoad.call(self);if(returned===false)return;if(method=='post')
$.post(url,data,setupContent);else
$.get(url,data,setupContent);function setupContent(content)
{self.updateContent(content);self.onContentLoad.call(self);}
return self;},focus:function(event)
{var returned=self.beforeFocus.call(self,event);if(returned===false)return;var baseIndex=6000;var curIndex=parseInt(self.elements.tooltip.css('z-index'));var newIndex=baseIndex+$('.qtip').length-1;if(curIndex!==newIndex)
{$('.qtip').not(self.elements.tooltip).each(function()
{$(this).css({zIndex:parseInt($(this).css('z-index'))-1});})
self.elements.tooltip.css({zIndex:newIndex});}
self.onFocus.call(self,event);return self;},disable:function(state)
{if(state)
{self.options.show.when.target.unbind('mousemove.qtip',self.updatePosition);self.options.show.when.target.unbind('mouseout.qtip',self.hide);self.options.show.when.target.unbind(self.options.show.when.event+'.qtip');self.options.show.when.target.removeData("qtip-toggle");self.options.hide.when.target.unbind(self.options.hide.when.event+'.qtip');self.elements.tooltip.unbind(self.options.hide.when.event+'.qtip');self.elements.tooltip.unbind('mouseover.qtip',self.focus);}
else assignEvents.call(self);return self;},destroy:function()
{var returned=self.beforeDestroy.call(self);if(returned===false)return;self.disable(true);self.elements.tooltip.remove();self.elements.target.removeData("qtip");self.onDestroy.call(self);return self.elements.target;},getPosition:function()
{var show=(!self.elements.tooltip.is(':visible'))?true:false;if(show)self.elements.tooltip.css({visiblity:'hidden'}).show();var offset=self.elements.tooltip.offset();if(show)self.elements.tooltip.css({visiblity:'visible'}).hide();return offset;}});construct.call(self);};function construct()
{var self=this;function render(event)
{self.beforeRender.call({options:self.options,elements:{target:self.elements.target}});self.elements.tooltip=$(document.createElement('div')).addClass('qtip').addClass(self.options.style.classes.tooltip||self.options.style).css('-moz-border-radius','').css('-webkit-border-radius','').css({position:self.options.position.type,zIndex:6000+$('.qtip').length}).appendTo(self.options.position.container).hide().data('qtip',self);self.elements.wrapper=$(document.createElement('div')).addClass('qtip-wrapper').css({position:'relative',overflow:'hidden',textAlign:'left'}).appendTo(self.elements.tooltip);self.elements.contentWrapper=$(document.createElement('div')).addClass('qtip-contentWrapper').css({overflow:'hidden'}).appendTo(self.elements.wrapper);self.elements.content=$(document.createElement('div')).addClass(self.options.style.classes.content).css(jQueryStyle(self.options.style)).appendTo(self.elements.contentWrapper);if(($.support&&!$.support.cssFloat)||$.browser.msie)
{$(self.elements.wrapper,self.elements.contentWrapper).css({lineHeight:'100%'});$(self.elements.wrapper).css({zoom:'1'});if(parseInt($.browser.version.charAt(0))==6)
{if($('select, object').length)bgiframe.call(self);var adjust=(self.options.style.border.radius<6)?-1:-2;self.elements.content.css({marginTop:adjust});}}
if(typeof self.options.style.width.value=='number')self.updateWidth();createBorder.call(self);createTip.call(self);if(self.options.content.text===false)
{var content=self.elements.target.attr('title').replace("\\n",'<br />');self.elements.target.attr('title','');}
else if(typeof $(self.options.content.text).length>0)
var content=$(self.options.content.text).clone(true);else var content=self.options.content.text;self.updateContent(content);if(self.options.content.title.text!==false)createTitle.call(self);if(self.options.content.url!==false)
{var url=self.options.content.url;var data=self.options.content.data;var method=self.options.content.method||'get';self.loadContent(url,data,method);}
assignEvents.call(self);if(self.options.show.ready===true)
{var tempLength=self.options.show.effect.length;self.elements.tooltip.show();self.options.show.effect.length=tempLength;}
self.onRender.call(self);}
if(self.options.content.prerender===false&&self.options.show.when.event!==false&&self.options.show.ready!==true)
{var showTarget=self.options.show.when.target;var showEvent=self.options.show.when.event;showTarget.bind(showEvent+'.qtip-create',function(event)
{showTarget.unbind(showEvent+'.qtip-create');render();self.mouse={x:event.pageX,y:event.pageY};showTarget.trigger(event);});}
else render();};function createBorder()
{var self=this;self.elements.tooltip.find('.qtip-borderTop, .qtip-borderBottom').remove();var width=self.options.style.border.width;var radius=self.options.style.border.radius;var color=self.options.style.border.color||self.options.style.tip.color;if(radius===0)
self.elements.contentWrapper.css({border:width+'px solid '+color})
else
{var borders=calculateBorders(radius);var shapes={};for(var i in borders)
{shapes[i]=$(document.createElement('div')).css({height:radius,width:radius,overflow:'hidden',position:'absolute',lineHeight:0.1,fontSize:1}).css((i.search(/Left/)!==-1)?'left':'right',0).attr('rel',i);}
if(document.createElement('canvas').getContext)
{for(var i in borders)
{var canvas=$(document.createElement('canvas')).attr('height',radius).attr('width',radius).css({verticalAlign:'top'}).appendTo(shapes[i]);drawBorder.call(self,canvas,borders[i],radius,color)}}
else if(($.support&&!$.support.cssFloat)||$.browser.msie)
{for(var i in borders)
{var arc=$('<v:arc style="behavior: url(#default#VML)"></v:arc>').attr('stroked',false).attr('fillcolor',color).attr('startangle',borders[i][0]).attr('endangle',borders[i][1]).css({width:radius*2+3,height:radius*2+3,marginLeft:(i.search(/Right/)!==-1)?borders[i][2]-3.5:-1,marginTop:(i.search(/bottom/)!==-1)?-2:-1,verticalAlign:'top',display:'inline-block'}).appendTo(shapes[i]);}}
var betweenCorners=$(document.createElement('div')).addClass('qtip-betweenCorners').css({height:radius,width:self.elements.tooltip.outerWidth()-(Math.max(width,radius)*2),overflow:'hidden',backgroundColor:color,lineHeight:0.1,fontSize:1})
var borderTop=$(document.createElement('div')).addClass('qtip-borderTop').css({height:radius,marginLeft:radius,lineHeight:0.1,fontSize:1,padding:0}).append(shapes['topLeft']).append(shapes['topRight']).append(betweenCorners).prependTo(self.elements.wrapper);var borderBottom=$(document.createElement('div')).addClass('qtip-borderBottom').css({height:radius,marginLeft:radius,lineHeight:0.1,fontSize:1,padding:0,clear:'both'}).append(shapes['bottomLeft']).append(shapes['bottomRight']).append(betweenCorners.clone()).appendTo(self.elements.wrapper);var sideWidth=Math.max(radius,(radius+(width-radius)))
var vertWidth=Math.max(width-radius,0);self.elements.contentWrapper.css({margin:0,border:'0px solid '+color,borderWidth:vertWidth+'px '+sideWidth+'px',position:'relative',clear:'both'})}};function drawBorder(canvas,coordinates,radius,color)
{var context=canvas.get(0).getContext('2d');context.fillStyle=color;context.beginPath();context.arc(coordinates[0],coordinates[1],radius,0,Math.PI*2,false);context.fill();}
function createTip(corner)
{var self=this;var color=self.options.style.tip.color||self.options.style.border.color;if(self.options.style.tip.corner===false)return;else if(!corner)corner=self.options.style.tip.corner;if(self.elements.tip!==null)self.elements.tip.remove();$(self.elements.tooltip).find('.'+self.options.style.classes.tip).remove();self.elements.tip=$(document.createElement('div')).addClass(self.options.style.classes.tip).css({width:self.options.style.tip.size.x,height:self.options.style.tip.size.y,margin:'0 auto',lineHeight:0.1,fontSize:1}).attr('rel',corner)
if(document.createElement('canvas').getContext)
{var canvas=$(document.createElement('canvas')).attr('width',self.options.style.tip.size.x).attr('height',self.options.style.tip.size.y).appendTo(self.elements.tip);drawTip.call(self,canvas,corner,color);}
else if(($.support&&!$.support.cssFloat)||$.browser.msie)
{var coordinates=calculateTip(corner,self.options.style.tip.size.x,self.options.style.tip.size.y);var path='m'+coordinates[0][0]+','+coordinates[0][1];path+=' l'+coordinates[1][0]+','+coordinates[1][1];path+=' '+coordinates[2][0]+','+coordinates[2][1];path+=' xe';$('<v:shape style="behavior: url(#default#VML)"></v:shape>').attr('fillcolor',color).attr('stroked','false').attr('coordsize',self.options.style.tip.size.x+','+self.options.style.tip.size.y).attr('path',path).css({width:self.options.style.tip.size.x,height:self.options.style.tip.size.y,lineHeight:0.1,verticalAlign:(corner.search(/top/)!==-1)?'bottom':'top',display:'inline-block'}).appendTo(self.elements.tip)
if(($.support&&!$.support.cssFloat)||$.browser.msie)
self.elements.content.css({position:'relative'})}
else return debug('Canvas/VML unsupported, cannot draw the tip!');if(corner.search(/left|top|right/)!==-1)
self.elements.tip.prependTo(self.elements.tooltip);else
self.elements.tip.appendTo(self.elements.tooltip);positionTip.call(self,corner);};function drawTip(canvas,corner,color)
{var self=this;var coordinates=calculateTip(corner,self.options.style.tip.size.x,self.options.style.tip.size.y);var context=canvas.get(0).getContext('2d');context.fillStyle=color;context.beginPath();context.moveTo(coordinates[0][0],coordinates[0][1]);context.lineTo(coordinates[1][0],coordinates[1][1]);context.lineTo(coordinates[2][0],coordinates[2][1]);context.fill();}
function positionTip(corner)
{var self=this;if(self.options.style.tip.corner===false||!self.elements.tip)return;if(!corner)var corner=self.elements.tip.attr('rel');var radiusAdjust=self.options.style.border.radius;var pixelAdjust=(($.support&&!$.support.cssFloat)||$.browser.msie)?1:0;self.elements.tip.css(corner.match(/left|right|top|bottom/)[0],0);if(corner.search(/top|bottom/)!==-1)
{if(corner.search(/Middle/)!==-1)
{self.elements.tooltip.css({textAlign:'center'})}
else if(corner.search(/Left/)!==-1)
{self.elements.tip.css({marginLeft:radiusAdjust-pixelAdjust});self.elements.tooltip.css({marginLeft:-radiusAdjust});}
else if(corner.search(/Right/)!==-1)
{self.elements.tip.css({marginLeft:self.elements.tooltip.outerWidth()-self.options.style.tip.size.x-radiusAdjust-pixelAdjust});self.elements.tooltip.css({marginLeft:radiusAdjust})}
if(($.support&&!$.support.cssFloat)||$.browser.msie)
{if(corner.search(/bottom/)!==-1)
self.elements.tip.css({marginTop:-2});}}
else if(corner.search(/left|right/)!==-1)
{if(corner.search(/Middle/)!==-1)
{self.elements.tip.css({position:'absolute',top:"50%",marginTop:-(self.options.style.tip.size.y/2)});}
else if(corner.search(/Top/)!==-1)
{self.elements.tip.css({position:'absolute',top:radiusAdjust-pixelAdjust});self.elements.tooltip.css({marginTop:-radiusAdjust});}
else if(corner.search(/Bottom/)!==-1)
{self.elements.tip.css({position:'absolute',bottom:radiusAdjust+pixelAdjust});self.elements.tooltip.css({marginTop:radiusAdjust});}
if(($.support&&!$.support.cssFloat)||$.browser.msie)
{if(corner.search(/left/)!==-1)
self.elements.tip.css({marginLeft:-1});else
self.elements.tip.css({marginRight:1});}
var paddingCorner='padding-'+corner.match(/left|right/)[0];var paddingSize=(paddingCorner.search(/left/)!==-1)?self.options.style.tip.size.x:self.options.style.tip.size.y
if(paddingCorner!=='padding-bottom')self.elements.tooltip.css(paddingCorner,paddingSize-1);}};function createTitle()
{var self=this;if(self.elements.title!==null)self.elements.title.remove();self.elements.title=$(document.createElement('div')).addClass(self.options.style.classes.title).css(jQueryStyle(self.options.style.title,true)).html(self.options.content.title.text).prependTo(self.elements.contentWrapper);if(self.options.content.title.button!==false&&typeof self.options.content.title.button=='string')
{var button=$(document.createElement('a')).attr('href','#').css({'float':'right',position:'relative'}).addClass(self.options.style.classes.button).html(self.options.content.title.button).prependTo(self.elements.title).click(self.hide);}};function assignEvents()
{var self=this;var showTarget=self.options.show.when.target;var hideTarget=self.options.hide.when.target;if(self.options.hide.fixed)hideTarget=hideTarget.add(self.elements.tooltip);if(self.options.hide.when.event=='inactive')
{var inactiveEvents=['click','dblclick','mousedown','mouseup','mousemove','mouseout','mouseenter','mouseleave','mouseover'];function inactiveMethod()
{clearTimeout(self.timers.inactive);self.timers.inactive=setTimeout(function()
{$(inactiveEvents).each(function()
{hideTarget.unbind(this+'.qtip-inactive');self.elements.content.unbind(this+'.qtip-inactive');});self.hide();},self.options.hide.delay);}}
else if(self.options.hide.fixed===true)
{self.elements.tooltip.bind('mouseover.qtip',function()
{clearTimeout(self.timers.hide);});}
function showMethod(event)
{if(self.options.hide.when.event=='inactive')
{$(inactiveEvents).each(function()
{hideTarget.bind(this+'.qtip-inactive',inactiveMethod);self.elements.content.bind(this+'.qtip-inactive',inactiveMethod);});inactiveMethod();}
clearTimeout(self.timers.show);clearTimeout(self.timers.hide);self.timers.show=setTimeout(function(){self.show(event);},self.options.show.delay);}
function hideMethod(event)
{if(self.options.hide.fixed===true&&self.options.hide.when.event.search(/mouse(out|leave)/i)!==-1&&$(event.relatedTarget).parents('.qtip').length>0)
{event.stopPropagation();event.preventDefault();clearTimeout(self.timers.hide);return false;}
clearTimeout(self.timers.show);clearTimeout(self.timers.hide);self.timers.hide=setTimeout(function(){self.hide(event);},self.options.hide.delay);}
if((self.options.show.when.target.add(self.options.hide.when.target).length===1&&self.options.show.when.event==self.options.hide.when.event&&self.options.hide.when.event!=='inactive')||self.options.hide.when.event=='unfocus')
{showTarget.data('qtip-toggle',0);if(self.options.hide.when.event=='unfocus')
self.elements.tooltip.attr('unfocus',true);showTarget.bind(self.options.show.when.event+'.qtip',function(event)
{if(parseInt($(this).data('qtip-toggle'))===0)
showMethod(event);else
hideMethod(event);});}
else
{showTarget.bind(self.options.show.when.event+'.qtip',showMethod);if(self.options.hide.when.event!=='inactive')
hideTarget.bind(self.options.hide.when.event+'.qtip',hideMethod);}
if(self.options.position.type.search(/(fixed|absolute)/)!==-1)
self.elements.tooltip.bind('mouseover.qtip',self.focus);if(self.options.position.target=='mouse')
{showTarget.bind('mousemove.qtip',function(event)
{self.mouse={x:event.pageX,y:event.pageY};if(self.elements.tip.css('display')!=='none')
self.updatePosition(event,false);});}};function screenAdjust(currentPos,targetLength,event)
{var self=this;var corner=self.options.position.corner.tooltip;if(corner=='center')return
var tooltipLength={height:self.elements.tooltip.outerHeight(),width:self.elements.tooltip.outerWidth()};var newPos=$.extend(true,{},currentPos);if(self.options.position.target!=='mouse')
var targetPos=self.options.position.target.offset();var overflow={leftMin:(currentPos.left<$(window).scrollLeft()),leftMax:(newPos.left+tooltipLength.width+2>=$(window).width()+$(window).scrollLeft()),topMin:(currentPos.top<$(window).scrollTop()),topMax:(newPos.top+tooltipLength.height+2>=$(window).height()+$(window).scrollTop())};if(overflow.leftMin||overflow.leftMax)
{if(overflow.leftMin&&((corner.search(/right/i)===-1&&!overflow.leftMax)||corner.search(/right/i)!==-1))
{if(self.options.position.target=='mouse')
newPos.left=self.mouse.x
else
newPos.left=targetPos.left+targetLength.width;}
else if(overflow.leftMax&&((corner.search(/left/i)===-1&&!overflow.leftMin)||corner.search(/left/i)!==-1))
{if(corner.search(/(top|bottom)Middle/)!==-1)
newPos.left-=(targetLength.width/2)+(tooltipLength.width/2)+(self.options.position.adjust.x*2);else
newPos.left-=tooltipLength.width+targetLength.width+(self.options.position.adjust.x*2);}}
if(overflow.topMin||overflow.topMax)
{if(overflow.topMin&&corner.search(/top/i)===-1)
{if(self.options.position.target=='mouse')
newPos.top=self.mouse.y
else
newPos.top=targetPos.top+targetLength.height;}
else if(overflow.topMax&&corner.search(/bottom/i)===-1)
{if(corner.search(/(left|right)Middle/)!==-1)
newPos.top-=(targetLength.height/2)+(tooltipLength.height/2)+(self.options.position.adjust.y*2);else
newPos.top-=tooltipLength.height+targetLength.height+(self.options.position.adjust.y*2);}}
if(newPos.left<0)newPos.left=currentPos.left;if(newPos.top<0)newPos.top=currentPos.top;if(self.options.style.tip.corner!==false)
{corner=invertCornerString(corner,newPos.left!==currentPos.left,newPos.top!==currentPos.top,overflow)
if(corner!==self.elements.tip.attr('rel'))
{self.options.style.tip.corner=corner;createTip.call(self);}}
return newPos;};function jQueryStyle(style,title)
{var styleObj=$.extend(true,{},style);for(var i in styleObj)
{if(title===true&&i.search(/(tip|classes)/i)!==-1)
delete styleObj[i];else if(i.search(/(width|border|tip|title|classes|user)/i)!==-1)
delete styleObj[i];}
return styleObj;}
function sanitizeStyle(style)
{if(typeof style.tip!=='object')style.tip={corner:style.tip};if(typeof style.tip.size!=='object')style.tip.size={x:style.tip.size,y:style.tip.size};if(typeof style.border!=='object')style.border={width:style.border};if(typeof style.width!=='object')style.width={value:style.width};if(typeof style.width.max=='string')style.width.max=parseInt(style.width.max.replace(/([0-9]+)/i,"$1"));if(typeof style.width.min=='string')style.width.min=parseInt(style.width.min.replace(/([0-9]+)/i,"$1"));return style;}
function buildStyle()
{var self=this;var styleArray=[true,{}];for(var i=0;i<arguments.length;i++)
styleArray.push(arguments[i]);var styleExtend=[$.extend.apply($,styleArray)];while(typeof styleExtend[0].name=='string')
{var nextStyle=sanitizeStyle($.fn.qtip.styles[styleExtend[0].name]);styleExtend.unshift(nextStyle);}
styleExtend.unshift(true,{classes:{tooltip:'qtip-'+arguments[0].name}},$.fn.qtip.styles.defaults);var final=$.extend.apply($,styleExtend);var pixelAdjust=(($.support&&!$.support.cssFloat)||$.browser.msie)?1:0;final.tip.size.x+=pixelAdjust;final.tip.size.y+=pixelAdjust;if(final.tip.size.x%2>0)final.tip.size.x+=1;if(final.tip.size.y%2>0)final.tip.size.y+=1;if(final.tip.corner===true)
final.tip.corner=(self.options.position.corner.tooltip==='center')?false:self.options.position.corner.tooltip;return final;};function calculateTip(corner,width,height)
{var tips={bottomRight:[[0,0],[width,height],[width,0]],bottomLeft:[[0,0],[width,0],[0,height]],topRight:[[0,height],[width,0],[width,height]],topLeft:[[0,0],[0,height],[width,height]],topMiddle:[[0,height],[width/2,0],[width,height]],bottomMiddle:[[0,0],[width,0],[width/2,height]],rightMiddle:[[0,0],[width,height/2],[0,height]],leftMiddle:[[width,0],[width,height],[0,height/2]]}
tips.leftTop=tips.bottomRight;tips.rightTop=tips.bottomLeft;tips.leftBottom=tips.topRight;tips.rightBottom=tips.topLeft;return tips[corner];};function calculateBorders(radius)
{if(document.createElement('canvas').getContext)
{var borders={topLeft:[radius,radius],topRight:[0,radius],bottomLeft:[radius,0],bottomRight:[0,0]}}
else if(($.support&&!$.support.cssFloat)||$.browser.msie)
{var borders={topLeft:[-90,90,0],topRight:[-90,90,-radius],bottomLeft:[90,270,0],bottomRight:[90,270,-radius]}}
return borders;};function invertCornerString(corner,x,y,overflow)
{if(x)
{if(corner.search(/(top|bottom)Middle/)!==-1)
{if(overflow.leftMin)
corner=corner.replace('Middle','Left');else if(overflow.leftMax)
corner=corner.replace('Middle','Right');}
else if(corner.search(/right/)!==-1)corner=corner.replace('right','left');else if(corner.search(/Right/)!==-1)corner=corner.replace('Right','Left');else if(corner.search(/left/)!==-1)corner=corner.replace('left','right');else if(corner.search(/Left/)!==-1)corner=corner.replace('Left','Right');}
if(y)
{if(corner.search(/(left|right)Middle/)!==-1)
{if(overflow.topMin)
corner=corner.replace('Middle','Top');else if(overflow.topMax)
corner=corner.replace('Middle','Bottom');}
else if(corner.search(/top/)!==-1)corner=corner.replace('top','bottom');else if(corner.search(/Top/)!==-1)corner=corner.replace('Top','Bottom');else if(corner.search(/bottom/)!==-1)corner=corner.replace('bottom','top');else if(corner.search(/Bottom/)!==-1)corner=corner.replace('Bottom','Top');}
return corner;};function bgiframe()
{var self=this;var html='<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" '+'style="display:block; position:absolute; z-index:-1; filter:Alpha(Opacity=\'0\'); '+'top:expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\'); '+'left:expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\'); '+'width:expression(this.parentNode.offsetWidth+\'px\'); '+'height:expression(this.parentNode.offsetHeight+\'px\');"/>';$(html).prependTo(self.elements.tooltip);}
function debug(text)
{if(window.console&&window.console.log)
window.console.log('qTip: '+text);};$.fn.qtip.defaults={content:{prerender:false,text:false,url:false,data:null,title:{text:false,button:false}},position:{target:false,corner:{target:'bottomRight',tooltip:'topLeft'},adjust:{x:0,y:0,screen:false,scroll:true,resize:true},type:'absolute',container:false},show:{when:{target:false,event:'mouseover'},effect:{type:'fade',length:100},delay:140,solo:false,ready:false},hide:{when:{target:false,event:'mouseout'},effect:{type:'fade',length:100},delay:0,fixed:false},api:{beforeRender:function(){},onRender:function(){},beforePositionUpdate:function(){},onPositionUpdate:function(){},beforeShow:function(){},onShow:function(){},beforeHide:function(){},onHide:function(){},beforeContentUpdate:function(){},onContentUpdate:function(){},beforeContentLoad:function(){},onContentLoad:function(){},beforeDestroy:function(){},onDestroy:function(){},beforeFocus:function(){},onFocus:function(){}}};$.fn.qtip.styles={defaults:{background:'white',color:'#111',overflow:'hidden',textAlign:'left',width:{min:0,max:250},padding:'5px 9px',border:{width:1,radius:0,color:'#d3d3d3'},tip:{corner:false,color:false,size:{x:13,y:13},opacity:1},title:{background:'#e1e1e1',fontWeight:'bold',padding:'7px 12px'},classes:{target:'',tip:'qtip-tip',title:'qtip-title',content:'qtip-content',active:'qtip-active'}},cream:{border:{width:3,radius:0,color:'#F9E98E'},title:{background:'#F0DE7D',color:'#A27D35'},background:'#FBF7AA',color:'#A27D35',classes:{tooltip:'qtip-cream'}},light:{border:{width:3,radius:0,color:'#E2E2E2'},title:{background:'#f1f1f1',color:'#454545'},background:'white',color:'#454545',classes:{tooltip:'qtip-light'}},dark:{border:{width:3,radius:0,color:'#303030'},title:{background:'#404040',color:'#f3f3f3'},background:'#505050',color:'#f3f3f3',classes:{tooltip:'qtip-dark'}},red:{border:{width:3,radius:0,color:'#CE6F6F'},title:{background:'#f28279',color:'#9C2F2F'},background:'#F79992',color:'#9C2F2F',classes:{tooltip:'qtip-red'}},green:{border:{width:3,radius:0,color:'#A9DB66'},title:{background:'#b9db8c',color:'#58792E'},background:'#CDE6AC',color:'#58792E',classes:{tooltip:'qtip-green'}},blue:{border:{width:3,radius:0,color:'#ADD9ED'},title:{background:'#D0E9F5',color:'#5E99BD'},background:'#E5F6FE',color:'#4D9FBF',classes:{tooltip:'qtip-blue'}}}
var adjustTimer;$(window).bind('resize scroll',function(event)
{clearTimeout(adjustTimer);adjustTimer=setTimeout(function()
{$('.qtip').each(function()
{var api=$(this).qtip("api");if(api.options.position.adjust.scroll&&event.type==='scroll'||api.options.position.adjust.resize&&event.type==='resize')
api.updatePosition(event);})},100);})
$(document).bind('mousedown.qtip',function(event)
{if($(event.target).parents('div.qtip').length===0)
{$('.qtip[unfocus]').each(function()
{var api=$(this).qtip("api");if($(this).is(':visible')&&$(event.target).add(api.elements.target).length>1)
api.hide();})}});})(jQuery);