!function e(t,n,i){function o(r,s){if(!n[r]){if(!t[r]){var c="function"==typeof require&&require;if(!s&&c)return c(r,!0);if(a)return a(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var d=n[r]={exports:{}};t[r][0].call(d.exports,function(e){var n=t[r][1][e];return o(n?n:e)},d,d.exports,e,t,n,i)}return n[r].exports}for(var a="function"==typeof require&&require,r=0;r<i.length;r++)o(i[r]);return o}({1:[function(e,t,n){var i=e("./js/main");i.init(window)},{"./js/main":9}],2:[function(e,t,n){var i=e("./Event"),o=e("./Params"),a=e("./Util"),r=e("./Dialog"),s=e("./Config"),c=[].slice,l={act:{b:"batchdownload",dl:"download",d:"detail"},ls:{MM:{},MMLITE:{}},init:function(){var e=this;e.ls.MM[e.act.b]=510,e.ls.MM[e.act.dl]=501,e.ls.MM[e.act.d]=500,e.ls.MMLITE[e.act.b]=200,e.ls.MMLITE[e.act.dl]=200,e.ls.MMLITE[e.act.d]=200},support:function(e){var t=this,n=a.getCookie(o.version),i=a.getCookie(o.version_type),r=!1;if(e&&a.s(n)&&n.length>0){n=parseInt(n,10);var s=t.ls[i][e];s&&n>=s&&(r=!0)}return r},checkVersion:function(e){var t=a.getCookie(o.version),n=!1;return a.s(t)&&t.length>0&&(t=parseInt(t,10),t>e&&(n=!0)),n}},d={ua:navigator.userAgent.toLowerCase(),isChrome:function(){var e=this.ua;return e.match(/360 aphone /i)?!1:"chrome"==e.match(/Chrome/i)},query:function(e){var t="";for(var n in e)t+=encodeURIComponent(n)+"="+encodeURIComponent(e[n])+"&";return t},isWechat:function(){return"micromessenger"==this.ua.match(/MicroMessenger/i)?1:0},isQq:function(){return this.ua.match(/MQQBrowser/i)?1:0},bs:function(){var e="",t=this.ua,n={whatchar:t.match(/MicroMessenger/i)?"微信":"",uc:t.match(/(UCBrowser)|(UCWEB)/i)?"UC浏览器":"",qq:t.match(/MQQBrowser/i)?"QQ浏览器":"",op:t.match(/oupeng/i)?"欧朋浏览器":"",ay:t.match(/MxBrowser/i)?"遨游浏览器":"",lb:t.match(/LieBao/i)?"猎豹浏览器":"",xm:t.match(/MiuiBrowser/i)?"小米浏览器":"",bd:t.match(/baidubrowser/i)?"百度浏览器":"",b360:t.match(/360 aphone/i)?"360浏览器":"",sg:t.match(/sogoumobilebrowser/i)?"搜狗浏览器":""};for(var i in n)if(""!=n[i]){e=n[i];break}return e},longFileNameAccept:function(){var e=!1,t=this.ua,n={qq:t.match(/MQQBrowser/i)?"QQ浏览器":"",ay:t.match(/MxBrowser/i)?"遨游浏览器":"",lb:t.match(/LieBao/i)?"猎豹浏览器":"",bd:t.match(/baidubrowser/i)?"百度浏览器":""};for(var i in n)if(""!=n[i]){e=!0;break}return e},getCurrentBs:function(){var e=this.bs();return""!=e?e:"浏览器"}},p={reqUrl:{index:"mm://index",launch:"mm://launchbrowser?url=",appdetail:"mm://appdetail?requestid=app_info_forward&contentid=",downloadUri:"http://zjw.mmarket.com/t.do?requestid=app_order&goodsid=999100008100930100001752138{contentid}&payMode=1",wetchartmm:"http://a.app.qq.com/o/simple.jsp?pkgname=com.aspire.mm",mmrelaapp:"http://zjw.mmarket.com/mmapk/{channelid}/mmarket-999100008100930100001752138{contentid}-180.apk",batchmmrelaapp:"http://zjw.mmarket.com/mmapk/{channelid}/mmarket-{contentid}-180.apk",MM_CONTENT_ID:"300000863435"},reqMethod:{queryapp:"queryapp&appname=",querydownprogress:"querydownprogress&contentid=",download:"download&url=",jump:"jump&url=",batchdownload:"batchdownload&contentids="},run:function(e,t){var n=this;t&&n.isChrome()?n.chrome(e):n.iframe(e)},isChrome:function(){var e=navigator.userAgent.toLowerCase();return e.match(/360 aphone /i)?!1:"chrome"==e.match(/Chrome/i)},downloadApp:function(e){window.location.href=e},chrome:function(e){var t=e.split("://"),n=t[0],e=t[1],i="intent://"+e+"#Intent;scheme="+n+("mm"==n?";package="+o.mmpkg:"")+";end";window.location.href=i},iframe:function(e){var t=document.createElement("iframe");t.style.display="none",t.src=e,document.body.appendChild(t),setTimeout(function(){document.body.removeChild(t)},2e3)},open:function(e,t){var n=this,i=l,a=d,t=t||s.showtitle,r=n.reqUrl,c=n.reqMethod,p=r.launch+encodeURIComponent(e),m=o.getBaseUrl();i.support(i.act.d)?(p=m+c.jump+encodeURIComponent(e)+(t?"&appname="+a.getCurrentBs():""),n.iframe(p)):n.run(p,!0)},batchDownload:function(e){this.download(e,l.act.b)},download:function(e,t){var n=this,i=l,t=t||i.act.dl,a=n.reqUrl,c=n.reqMethod,p=a.appdetail+encodeURIComponent(e),m=o.getBaseUrl();if(i.support(t))switch(t){case i.act.dl:p=m+c.download+encodeURIComponent(a.downloadUri.replace("{contentid}",e)),n.iframe(p);break;case i.act.b:p=m+c.batchdownload+e,n.iframe(p)}else if(i.act.dl===t)n.run(p,!0);else if(i.act.b==t){var u=function(){if(i.support(i.act.d)){var e=m+c.jump+encodeURIComponent(a.appdetail+a.MM_CONTENT_ID)+(s.showtitle?"&appname="+d.getCurrentBs():"");n.iframe(e)}else{var e=a.appdetail+encodeURIComponent(a.MM_CONTENT_ID);n.run(e,!0)}};r.one("dialog.after.show",function(){r.one("dialog.res.save",u)}),r.show({type:"alert",info:s.lowVersionAlert})}},detail:function(e,t){var n=this,i=l,a=d,r=n.reqUrl,t=t||s.showtitle,c=n.reqMethod,p=r.appdetail+encodeURIComponent(e),m=o.getBaseUrl();i.support(i.act.d)?(p=m+c.jump+encodeURIComponent(r.appdetail+e)+(t?"&appname="+a.getCurrentBs():""),n.iframe(p)):n.run(p,!0)},error:function(){var e=this,t=s.onIntent,n=e.reqUrl,o=d,a=o.ua.match(/(UCBrowser)|(UCWEB)/i)?3e3:900,l=c.call(arguments);if(o.isWechat()){var p=function(){e.downloadApp(n.wetchartmm)};r.one("dialog.after.show",function(){r.one("dialog.res.save",p)});var m="detail"===l[0]?"detail":"download";r.show({type:"weixin",flag:m})}else if(t){var u=Date.now();e.iframe(n.index);Date.now();setTimeout(function(){var e=Date.now();(!u||a+200>e-u)&&l.unshift("downloadmm"),l.unshift("server.check.start"),i.trigger.apply(i,l)},a)}else e.downloadmm.apply(e,arguments)},downloadmm:function(e){var t=this,n=l,o=d,a=c.call(arguments,1),s=a&&a[0]||"",p=o.bs(),m=o.longFileNameAccept();if(e){var u=function(){var t="";switch(e){case"download":t=n.act.dl;break;case"batchDownload":t=n.act.b;break;default:t=n.act.d}return t}(),h=t.getMMUrl(u);""==p||!m&&u==n.act.b||u==n.act.d?t.downloadApp(h.replace("{contentid}","")):t.downloadApp(h.replace("{contentid}",s));var f=u!=n.act.d?"download":"detail",v=c.call(arguments);v.unshift("server.check.start");var g=function(){i.trigger.apply(i,v)};setTimeout(function(){r.one("dialog.after.show",function(){r.one("dialog.res.save",g)}),r.show({type:"guid",flag:f})},1e3)}},getMMUrl:function(e){var t=this,n=l,i=t.reqUrl;return"undefined"!=typeof e&&e==n.act.b?i.batchmmrelaapp.replace("{channelid}",s.channelid):i.mmrelaapp.replace("{channelid}",s.channelid)}};l.init(),t.exports={execute:function(e){var t=p;return t[e]&&t[e].apply(t,c.call(arguments,1))}}},{"./Config":3,"./Dialog":4,"./Event":5,"./Params":6,"./Util":8}],3:[function(e,t,n){t.exports={batchMaxApps:"15",maxAlert:"批量下载超过最大下载数15个,请重新选择",lowVersionAlert:"抱歉,您的MM版本过低无法支持该功能,请升级新版客户端",showtitle:!0,channelid:"5410093632",onIntent:!0}},{}],4:[function(e,t,n){var i=e("./Event"),o=e("./Util"),a={cssloaded:0,el:{},options:{type:"alert",info:"",base:"",flag:"download",css:"mmapp.css"},infos:{guid:{detail:{info:'安装并启动MM商城<span class="__mm-wap-hint-link" id="__mm-wap-success">请点这里</span>即可打开目标页面'},download:{info:'安装并启动MM商场后将自动开始高速下载，如没开始高速下载，<span class="__mm-wap-hint-link" id="__mm-wap-success">请点这里</span>'}},weixin:{detail:{tit:"操作指引",tip:"请按以下步骤操作",second:"回到微信再次点击"},download:{tit:"高速下载指引",tip:"请按以下步骤操作完成高速下载：",second:"回到微信再次点击“高速下载”。"}}},movePrevent:function(e){this.preventDefault(e),this.stopPropagation(e)},set:function(e){var t=this;for(var n in t.options)"undefined"!=typeof e[n]&&(t.options[n]=e[n])},view:function(){var e=this,t="";if("guid"===e.options.type){var n=e.infos.guid[e.options.flag];t='<div class="__mm-wap-hint"><div class="__mm-wap-hint-msg">'+n.info+'</div><div class="__mm-wap-hint-close" id="__mm-wap-close"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC" /></div></div>'}else if("weixin"===e.options.type){var n=e.infos.weixin[e.options.flag];t='<div class="__mm-wap-dialog-mask"></div><div class="__mm-wap-dialog" id="__mm-wap-dialog"><div class="__mm-wap-dialog-close " id="__mm-wap-close"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC" /></div><div class="__mm-wap-hd">'+n.tit+'</div><div class="__mm-wap-bd"><p class="__mm-wap-guid-tit">'+n.tip+'</p><div class="__mm-wap-guid-step"><p>第<span class="__mm-wap-guid-step-num">1</span>步 </p><p>下载安装MM商场后<span class="__mm-wap-guid-step-hint">启动一次</span>或<span class="__mm-wap-guid-step-hint">打开一次</span></p></div><div class="__mm-wap-guid-step"><p>第<span class="__mm-wap-guid-step-num">2</span>步</p><p>'+n.second+'</p></div></div><div class="__mm-wap-ft"><div class="__mm-wap-btn  " id="__mm-wap-success">前往下载MM商场</div></div></div>'}else t='<div class="__mm-wap-dialog-mask"></div><div class="__mm-wap-dialog" id="__mm-wap-dialog"><div class="__mm-wap-dialog-close " id="__mm-wap-close"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC" /></div><div class="__mm-wap-bd"><div class="__mm-wap-bd-info"><p>'+e.options.info+'</p></div></div><div class="__mm-wap-ft"><div class="__mm-wap-btn  " id="__mm-wap-success">确定</div></div></div>';return t},onload:function(e,t){var n=this;e.attachEvent?e.attachEvent("onload",t):setTimeout(function(){n.poll(e,t)},0)},poll:function(e,t){var n=this;if(!t.isCalled){if(/webkit/i.test(navigator.userAgent))e.sheet&&(n.cssloaded=!0);else if(e.sheet)try{e.sheet.cssRules&&(n.cssloaded=!0)}catch(i){1e3===i.code&&(n.cssloaded=!0)}n.cssloaded?setTimeout(function(){t(),t.isCalled=!0},1):setTimeout(function(){n.poll(e,t)},1)}},loadcss:function(e,t){var n=this,i=document.createElement("link");i.setAttribute("rel","stylesheet"),i.setAttribute("type","text/css"),i.setAttribute("href",e),document.body.appendChild(i),n.onload(i,t)},show:function(e){var t=this;t.destroy(),t.set(e),t.loaded(t.create.bind(t))},create:function(){var e=this,t=e.view(),n=document.createElement("div");n.setAttribute("id","__mm-wap-toast"),n.style.display="none",n.innerHTML=t,e.trigger("dialog.before.show"),document.body.appendChild(n),e.el["__mm-wap-toast"]=[n],e.refresh(),e.addHandle(),e.trigger("dialog.after.show")},refresh:function(){var e=this,t=(e.el["__mm-wap-toast"]||(e.el["__mm-wap-toast"]=[e.query("__mm-wap-toast")]))[0];if(null!=t){t.style.display="block";var n=document.body.scrollTop||document.documentElement.scrollTop;"guid"!=e.options.type&&(t.style.height=Math.max(document.body.scrollHeight,document.body.clientHeight)-1+"px",t.setAttribute("class","__mm-wap-toast-cover"));var i=(document.body.offsetHeight||document.documentElement.offsetHeight,e.query("__mm-wap-dialog"));i&&(i.style.top=parseInt(n+(window.innerHeight-i.offsetHeight)/2,10)+"px",1)}},addHandle:function(){var e=this,t=e.el["__mm-wap-toast"]||(e.el["__mm-wap-toast"]=e.query("__mm-wap-toast"));t.push("touchmove"),t.push(e.movePrevent.bind(e)),e.addEvent.apply(e,t),e.resize=function(t){e.refresh()},e.addEvent(window,"resize",e.resize),e.addEvent(window,"scroll",e.resize);var n=e.el["__mm-wap-success"]||(e.el["__mm-wap-success"]=[e.query("__mm-wap-success")]),i=e.el["__mm-wap-close"]||(e.el["__mm-wap-close"]=[e.query("__mm-wap-close")]);null!=n&&n.length>0&&(n.push("click"),n.push(function(t){return e.preventDefault(t),e.stopPropagation(t),e.trigger("dialog.res.save"),e.destroy(),!1}),e.addEvent.apply(e,n)),null!=i&&i.length>0&&(i.push("click"),i.push(function(t){return e.preventDefault(t),e.stopPropagation(t),this.className+=" active",e.trigger("dialog.res.cancle"),e.destroy(),!1}),e.addEvent.apply(e,i))},loaded:function(e){var t=this,n=t.options;if(t.cssloaded)o.f(e)&&e();else{var i=n.base+n.css;t.loadcss(i,e)}},query:function(e){return document.querySelector?document.querySelector("#"+e):document.getElementById(e)},destroy:function(){var e=this;for(var t in e.el){var n=e.el[t];if(n){if(n[0])continue;"__mm-wap-toast"===t&&(n[0].style.display="none"),e.removeEvent.apply(e,n)}}if(e.removeEvent(window,"resize",e.resize),e.removeEvent(window,"scroll",e.resize),"undefined"!=typeof e.el["__mm-wap-toast"]){var i=e.el["__mm-wap-toast"][0];i&&i.parentNode&&i.parentNode.removeChild(i)}e.el={},e.off("dialog.res")},init:function(e){this.options.base=e},addEvent:function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent?e.attachEvent("on"+t,n):e["on"+t]=n},removeEvent:function(e,t,n){e.addEventListener?e.removeEventListener(t,n,!1):e.attachEvent?e.detachEvent("on"+t,n):e["on"+t]=null},getEvent:function(e){return e?e:window.event},getTarget:function(e){return e.target||e.srcElement},stopPropagation:function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},preventDefault:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},on:function(){i.on.apply(i,arguments)},off:function(){i.off.apply(i,arguments)},trigger:function(){i.trigger.apply(i,arguments)},one:function(){i.one.apply(i,arguments)}};t.exports=a},{"./Event":5,"./Util":8}],5:[function(e,t,n){function i(e,t,n){(e||"").split(l).forEach(function(e){n(e,t)})}function o(e){return new RegExp("(?:^| )"+e.replace(" "," .* ?")+"(?: |$)")}function a(e){var t=(""+e).split(".");return{e:t[0],ns:t.slice(1).sort().join(" ")}}function r(e,t,n,i){var r,s;return s=a(t),s.ns&&(r=o(s.ns)),e.filter(function(e){return e&&(!s.e||e.e===s.e)&&(!s.ns||r.test(e.ns))&&(!n||e.cb===n||e.cb._cb===n)&&(!i||e.ctx===i)})}function s(e,t){return this instanceof s?(t&&$.extend(this,t),this.type=e,this):new s(e,t)}var c=[].slice,l=/\s+/,d=function(){return!1},p=function(){return!0};s.prototype={isDefaultPrevented:d,isPropagationStopped:d,preventDefault:function(){this.isDefaultPrevented=p},stopPropagation:function(){this.isPropagationStopped=p}},t.exports={on:function(e,t,n){var o,r=this;return t?(o=this._events||(this._events=[]),i(e,t,function(e,t){var i=a(e);i.cb=t,i.ctx=n,i.ctx2=n||r,i.id=o.length,o.push(i)}),this):this},one:function(e,t,n){var o=this;return t?(i(e,t,function(e,t){var i=function(){return o.off(e,i),t.apply(n||o,arguments)};i._cb=t,o.on(e,i,n)}),this):this},off:function(e,t,n){var o=this._events;return o?e||t||n?(i(e,t,function(e,t){r(o,e,t,n).forEach(function(e){delete o[e.id]})}),this):(this._events=[],this):this},trigger:function(e){var t,n,i,o,a,l=-1;if(!this._events||!e)return this;if("string"==typeof e&&(e=new s(e)),t=c.call(arguments,1),e.args=t,t.unshift(e),n=r(this._events,e.type))for(o=n.length;++l<o;)if((i=e.isPropagationStopped())||!1===(a=n[l]).cb.apply(a.ctx2,t)){i||(e.stopPropagation(),e.preventDefault());break}return this}}},{}],6:[function(e,t,n){var i=e("./Util"),o="http://{adress}:{port}/moversion",a="http://{adress}:{port}/action=",r="wx.mm-img.com",s="127.0.0.1";navigator.userAgent.toLowerCase().match(/MicroMessenger|MQQBrowser/i)?(o=o.replace("{adress}",r),a=a.replace("{adress}",r)):(o=o.replace("{adress}",s),a=a.replace("{adress}",s)),t.exports={versionUrl:o,baseUrl:a,DAEMON:"mmcd",mmpkg:"com.aspire.mm",version:"mmversion",version_type:"mmversiontype",port:"mmport",getBaseUrl:function(){var e=this,t=i.getCookie(e.port);return a.replace("{port}",t)}}},{"./Util":8}],7:[function(e,t,n){function i(e){o(),M=A.call(e.args,1),u||(d.trigger("server.before.check"),f.forEach(function(e){var t=document.createElement("script");t.type="text/javascript",t.setAttribute("port",e),t.setAttribute("class","__js_load_mm"),t.onload=t.onerror=l,t.src=v.replace("{port}",e)+"?"+Date.now(),document.getElementsByTagName("head")[0].appendChild(t)}))}function o(){"undefined"!=typeof window.a&&"undefined"==typeof window.a.appname&&(b=window.a)}function a(){c(),u=!0,h="",g=0,m.setCookie(p.port,null),m.setCookie(p.version,null),m.setCookie(p.version_type,null)}function r(e){var t=e.args.slice(1),n=function(){M.unshift("server.check.error"),d.trigger.apply(d,M)};c(),"success"===t[0]?(m.setCookie(p.port,t[1]),"undefined"!=typeof window.a&&"undefined"!=typeof window.a.appname?(s(window.a),null===b?delete window.a:window.a=b,M.unshift("server.check.success"),d.trigger.apply(d,M)):n()):n(),u=!1,h="",g=0}function s(e){var t=e.appname;if(t&&t.length>0){var n=t.match(w);if(n){var i=n[1]||"MM";if(m.setCookie(p.version_type,i.toUpperCase()),n=n[0].replace(/(MMLite|MM)/i,""),n.length>0){var o=n.replace(/\./g,"");m.setCookie(p.version,o||0)}}}}function c(){var e=document.getElementsByClassName("__js_load_mm");if(e.length){var t=A.call(e);t.forEach(function(e){e.onload=e.onerror=null,e.remove&&(e.remove(),1)||e.parentNode&&(e.parentNode.removeChild(e),1)})}}function l(e){if(""===h)if("load"==e.type){var t=e.target;h=t.getAttribute("port"),d.trigger("server.after.check","success",h)}else g++,g==f.length&&d.trigger("server.after.check","error")}var d=e("./Event"),p=e("./Params"),m=e("./Util"),u=!1,h="",f=[9817,19817,29817,39817,49817,59817],v=p.versionUrl,g=0,w=/^(MMLite|MM)[0-9]+(\.[0-9]*|$)?(\.[0-9]*|$)?/i,A=[].slice,M=[],b=null,y=function(){d.on("server.before.check",a.bind(this)),d.on("server.after.check",r.bind(this)),d.on("server.check.start",i.bind(this))};t.exports={init:y}},{"./Event":5,"./Params":6,"./Util":8}],8:[function(e,t,n){var i={e:Object.prototype.toString,f:function(e){return"[object Function]"==this.e.call(e)},o:function(e){return"[object Object]"==this.e.call(e)},a:function(e){return"[object Array]"==this.e.call(e)},s:function(e){return"string"==typeof e},each:function(e,t){var n=this;if(n.f(t))if(n.o(e))for(var i in e)t(i,e[i]);else if(e&&e.length>0)for(var o=0;o<e.length;o++)t(e[o],o)},CHATSET:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",encode:function(e){var t=this,n="";if(!isNaN(e))for(var i=parseInt(e,10),o=t.CHATSET,a=o.length;i>0;i=parseInt(i/a,10))n+=o.charAt(parseInt(i%a,10));return n},decode:function(e){if("undefined"==typeof e||0==e.length)return 0;for(var t=this.CHATSET,n=t.length,i=0,o=0;o<e.length;o++){var a=e.charAt(o),r=t.indexOf(a);i+=r*Math.pow(n,o)}return i},setCookie:function(e,t,n){var i=e+"="+encodeURIComponent(t)+";path=/";if(null!=n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3),i+=";expires="+o.toGMTString()}document.cookie=i},getCookie:function(e){var t=document.cookie.match(new RegExp("(^| )"+e+"=([^;]*)(;|$)"));return null!=t?decodeURIComponent(t[2]):null}};t.exports=i},{}],9:[function(e,t,n){function i(e){e.mm={download:function(e){o.trigger("server.check.start","download",e)},detail:function(e){o.trigger("server.check.start","detail",e)},open:function(e,t){void 0===t&&(t=!0),o.trigger("server.check.start","open",e,t)},batchDownload:function(e){var t=this;if("undefined"!=typeof e&&""!=e){var n=new Array;if(a.s(e)){if(!/^[\d\/]*$/.test(e))return;n=e.split("/")}else if(a.a(e)){if(0==e.length)return;n=e}if(n.length>0){var i="",r=0;n.forEach(function(e){e&&/^(\d)*$/.test(e)&&(""===i?i=a.encode(e):i+="-"+a.encode(e),r++)}),r>t.get("batchMaxApps")?c.show({type:"alert",info:t.get("maxAlert")}):""!=i&&o.trigger("server.check.start","batchDownload",i)}}},set:function(e,t){var n=l;e in n&&(n[e]=t)},get:function(e){var t=l;return e in t?t[e]:void 0},init:function(e){if("undefined"!=typeof e&&a.o(e)){var t=l;for(var n in t)n in e&&(t[n]=e[n])}}}}var o=e("./Event"),a=e("./Util"),r=e("./Client"),s=e("./ServerManager"),c=e("./Dialog"),l=e("./Config"),d=[].slice;Function.prototype.bind||(Function.prototype.bind=function(e){var t=[].slice,n=t.call(arguments,1),i=this,o=function(){},a=function(){return i.apply(this instanceof o?this:e||{},n.concat(t.call(arguments)))};return o.prototype=i.prototype,a.prototype=new o,a}),s.init(),o.on("server.check.success",function(e){var t=e.args.slice(1),n=t&&t[0]||"";"downloadmm"==n&&t.shift(),r.execute.apply(r,t)}),o.on("server.check.error",function(e){var t=d.call(e.args,1),n=t&&t[0]||"";if("downloadmm"!==n)t.unshift("error");else{var i=t[1];if(4===t.length&&"open"===i&&!t[3])return}r.execute.apply(r,t)}),a.each(document.querySelectorAll("script"),function(e){var t=e.src;if(t){var n=t.match(/^(.*)mmapp.js/);n&&c.init(n[1])}}),t.exports={init:i}},{"./Client":2,"./Config":3,"./Dialog":4,"./Event":5,"./ServerManager":7,"./Util":8}]},{},[1]);