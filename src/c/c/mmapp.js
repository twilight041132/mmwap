(function() {
var $m={
	s:{},	// 常量定义
	url:{},	// 常用url定义
	mm:{},	// 调起方法： close downloadMM css view start init
	a:{},	// 业务类 status 客户端是否开启	log 日志	mm 下载MM	isShow 是否关闭MM客户端调起
	web:{},	// detail 将页面中的详情页换成客户端打开
	u:{},	// 工具方法
	b:{},	// 浏览器方法
	c:{},	// cookie 
	n:{},	// 节点工具类
	o:{},	//提供给外部的调用方法
	v:{}	//不同版本支持的功能定义
};
$m.s={
	base:'',
	charSet:'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	maxAlert:'\u6279\u91cf\u4e0b\u8f7d\u8d85\u8fc7\u6700\u5927\u4e0b\u8f7d\u6570\u0031\u0035\u4e2a,\u8bf7\u91cd\u65b0\u9009\u62e9',
	batchAlert:'\u62b1\u6b49,\u60a8\u7684\u004d\u004d\u7248\u672c\u8fc7\u4f4e\u65e0\u6cd5\u652f\u6301\u8be5\u529f\u80fd,\u8bf7\u5347\u7ea7\u65b0\u7248\u5ba2\u6237\u7aef',
}
$m.url={
	mm:				"http://a.10086.cn/d?ua=8020",
	mmrelaapp:		"http://apk.mmarket.com/mmapk/{channelid}/mmarket-999100008100930100001752138{contentid}-180.apk",
	batchmmrelaapp: "http://apk.mmarket.com/mmapk/{channelid}/mmarket-{contentid}-180.apk",
	wetchartmm:		"http://a.app.qq.com/o/simple.jsp?pkgname=com.aspire.mm"
}
$m.mo={
	index:			"mm://index",
	appdetail:		"mm://appdetail?requestid=app_info_forward&contentid=",
	appdetail_reg:	"a.10086.cn/pams2/l/s.do?.*gId=[0-9]*(30[0-9]{10})([^0-9]|$)",
	versionUrl:		"http://{adress}:{port}/moversion",
	mmPort:[9817,19817,29817,39817,49817,59817],
	moapp_reg:		"^(.*)mmapp.js",	
	baseUrl:		"http://{adress}:{port}/action=",
	domain:			"wx.mm-img.com",
	remoteIp:		"127.0.0.1",
	method:			{
		queryapp:			'queryapp&appname=',//查询应用是否下载
		querydownprogress:	'querydownprogress&contentid=',//查询应用下载进度
		download:			'download&url=',//调起MM下载
		jump:				'jump&url=',//跳转指定页面 &appname=''
		batchdownload:		'batchdownload&contentids='
	},
	version_reg:	/^MM[0-9]+(\.[0-9]*|$)?(\.[0-9]*|$)?/i,
	downloadUri:	"http://odp.mmarket.com/t.do?requestid=app_order&goodsid=999100008100930100001752138{contentid}&payMode=1",
	mmcontentid:	"",
}
$m.id={
	DAEMON:	"mmcd", 
	package:"com.aspire.mm",
	url:	"url",
	version: "mmversion",
	port:	"port"
}
$m.a={ // mmc action
	status:	function ()	{return $m.c.get($m.id.DAEMON)==1;
	}
}
$m.u={ //util
	e:	Object.prototype.toString,
	f:	function(a){ return "[object Function]" == $m.u.e.call(a)  },
	o:	function(a){ return "[object Object]" == $m.u.e.call(a)   },
	s:	function(a){ return "string" == typeof a   },
	each:	function(list, act){ if ($m.u.f(act) ){
			if ($m.u.o(list)){	for (var k in list) {	act(k,list[k]);	}
			}else if (list && list.length>0){ for (var i=0; i<list.length ; i++ )act(list[i],i);	}
		}
	},
	encode:function(num){
		var codeStr = "";
		if(!isNaN(num)){
			var id=parseInt(num,10);
			var charSet = $m.s.charSet;
			var len = charSet.length;
			for(;id>0;id=parseInt(id/len,10)){
				codeStr+=charSet.charAt(parseInt(id%len,10));
			}
		}
		return codeStr;
	},
	decode:function(encodeStr){
		if(typeof encodeStr=='undefined'|| encodeStr.length==0){
			return 	0;
		}
		var charSet = $m.s.charSet;
		var len = charSet.length;
		var originalnumber = 0;
		for(var i=0;i<encodeStr.length;i++){
			var c = encodeStr.charAt(i);
			var number = charSet.indexOf(c);
			originalnumber += (number*Math.pow(len, i));
		}
		return originalnumber;
	}
}
$m.b={ //browser
	isChrome:	function()	{ return navigator.userAgent.match(/Chrome/i); },
	ua:			function()	{ var a = navigator.userAgent;	return a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? "ios" :	a.match(/Android/i) ? "android" :	""},
	query:		function(p)	{ var r = ''; for (var k in p) r += encodeURIComponent(k) + '=' + encodeURIComponent(p[k]) + '&'; return r;},
	webp:		function() {
		var h = $m.id.webpSupport;
		if ($m.c.get(h) == null) {
			var g = new Image();
			g.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
			g.onload = function() {
				if (g.height === 2) $m.c.set(h, true, 1728000)
				else $m.c.set(h, false, 432000)
			};
			g.onerror = function() {
				$m.c.set(h, false, 7200)
			}
		}
	},
	isWechat:function(){
		var ua = navigator.userAgent.toLowerCase();	return ua.match(/MicroMessenger/i)=="micromessenger"?1:0;
	},
	bs:function(){
		var appname ='',
		ua = window.navigator.userAgent.toLowerCase();
		var browser = {
			whatchar:ua.match(/MicroMessenger/i)?'微信':'',
			uc:ua.match(/(UCBrowser)|(UCWEB)/i)?'UC浏览器':'',
			qq:ua.match(/MQQBrowser/i)?'QQ浏览器':'',
			op:ua.match(/oupeng/i)?'欧朋浏览器':'',
			ay:ua.match(/MxBrowser/i)?'遨游浏览器':'',
			lb:ua.match(/LieBao/i)?'猎豹浏览器':'',
			xm:ua.match(/MiuiBrowser/i)?'小米浏览器':'',
			bd:ua.match(/baidubrowser/i)?'百度浏览器':'',
			b360:ua.match(/360 aphone browser/i)?'360浏览器':'',
			sg:ua.match(/sogoumobilebrowser/i)?'搜狗浏览器':''
		};
		for(var b in browser){
			if(browser[b]!=''){
				appname = browser[b];
				break;
			}
		}
		return appname;
	},
	getCurrentBs:function(){
		var bsName = $m.b.bs();
		return bsName!=''?bsName:'浏览器';
	}
}
$m.c={ //cookie
	set:	function(name,value, days){
		var c=name + "="+ escape (value) + ";path=/";
		if (days !=null){  var exp  = new Date();exp.setTime(exp.getTime() + days*24*60*60*1000);	c+=";expires=" + exp.toGMTString();	}
		document.cookie = c;
	},
	get:		function(name){
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		if(arr != null) return unescape(arr[2]); return null;
	}
}
$m.db={
	get:		function(name){
		if ("undefined" == typeof localStorage )  return false;
		else return localStorage.getItem(name);
	},
	set:		function(name,value){
		if ("undefined" == typeof localStorage ) return false;
		localStorage.setItem(name,value);
	}
}
$m.n={ //node
	attr:		function(e,k){	return e!=null?e.getAttribute(k):null;	},
	get:		function (key){	return document.querySelector(key);		},  
	create:	function (o){ // document.createElement
		if (!$m.u.o(o) || !$m.u.s(o.tag)) return ;
		if (o.replace&&o.attr&&o.attr.id){
			var a=document.getElementById(o.attr.id) ;
			if (a!=null)	{a.parentNode.removeChild(a);	}
		}
		var n=document.createElement(o.tag)
		if (o.child) 
			$m.u.each(o.child,function(c1,i){
					n.appendChild($m.n.create(c1))
				}
			);
		if ($m.u.s(o.html))	n.innerHTML=o.html;
		$m.u.each(o.attr ,function(k,v){ n.setAttribute(k, v); } );
		$m.u.each(o.event,function(k,v){ n.addEventListener(k,v); });
		var p=o.parent;
		if (p!=null) p.appendChild(n);
		return n;
	}
}
$m.v={
	act:{
		b:'batchdownload',
		dl:'download',
		d:'detail'
	},
	ls:{
	},
	init:function(){
		$m.v.ls[$m.v.act.b]=510;
		$m.v.ls[$m.v.act.dl]=501;
		$m.v.ls[$m.v.act.d]=500;
	},
	support:function(type){
		var v = $m.c.get($m.id.version);
		var rs = false;
		if(!!type){
			if($m.u.s(v)&&v.length>0){
				v = parseInt(v,10);
				var base = $m.v.ls[type];
				if(base&&v>=base){//高于或等于指定功能版本则支持
					rs= true;				
				}
			}
		}
		return rs;
	}
}
$m.client={
	$e:null,
	//<a app="mm://appdetail?requestid=app_info_forward&contentid=300000415654" url="http://a.10086.cn" href="#">
	run:	function (app, isOpen){
		if (isOpen && $m.b.isChrome())	$m.client.chrome(app); 		else $m.client.iframe(app);	
		// $m.client.iframe(app);	
		
	},
	download:	function(installUrl) {
		 window.location.href = installUrl
	},
	chrome:	function (url) {
		var b =  url.split("://"), scheme = b[0], url = b[1];
		var url1= "intent://" + url + "#Intent;scheme=" + scheme + (scheme=="mm" ? ";package=" + $m.id.package :	"") + ";end";
		window.location.href = url1;
	},
	iframe: function (url,call) {
		var e = document.createElement("iframe");
		e.style.display = "none";
		e.src = url;
		var d=document.body;
		d ? d.appendChild(e) :	setTimeout(function() {
			document.body.appendChild(e)
		}, 0);
		
		e.addEventListener("load",function(){
			setTimeout(function(){
				if($m.u.f(call))call(e.contentWindow.name);
				document.body.removeChild(e);
			},0);
		})
	},
 	forward:	function(installUrl) {
		 window.location.href= installUrl;
	 },
	open:function(app,url){
		var mmap=app;
		if($m.a.status()){
			if($m.server.checkVersion(500)){
				mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.jump+
				encodeURIComponent(app)+"&appname="+$m.b.bs();
				$m.client.iframe(mmap);
			}else{
				$m.client.run(app,true);
			}
		}else{
			if(!!url) $m.client.download(url);
		}
	 },
	downloadApp:function(id,type){
		var act=type||$m.v.act.dl;
  		if($m.a.status()){
			var mmap=$m.mo.appdetail+encodeURIComponent(id);
			console.log($m.v.support(type));
			if($m.v.support(type)){
				switch(type){
					case $m.v.act.dl:
								mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.download+
								encodeURIComponent($m.mo.downloadUri.replace("{contentid}",id));
								$m.client.iframe(mmap);
								break;
					case $m.v.act.b:
								mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.batchdownload+id;
								$m.client.iframe(mmap);
								break;
					default:break;
				}
			}else{
				if($m.v.act.dl===type){
					$m.client.run(mmap,true);
				}else if($m.v.act.b==type){
					if(window.confirm($m.s.batchAlert)){
						mmap=$m.mo.appdetail+encodeURIComponent(mmcontentid);
						$m.client.run(mmap,true);
					}
				}
			}
  		}
	  },
	detailApp:function(id,showtitle){
		if($m.a.status()){
			var mmap=$m.mo.appdetail+encodeURIComponent(id);
			if($m.server.checkVersion(500)){
				mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.jump+
				encodeURIComponent($m.mo.appdetail + id)+(showtitle?("&appname="+$m.b.getCurrentBs()):'');
				$m.client.iframe(mmap);
			}else{
				$m.client.run(mmap,true);
			}
		}
	},
	setRequestUrl:function(){
		if($m.b.isWechat()){
			$m.mo.versionUrl =$m.mo.versionUrl.replace("{adress}",$m.mo.domain);
			$m.mo.baseUrl =$m.mo.baseUrl.replace("{adress}",$m.mo.domain);
		}else{
			$m.mo.versionUrl =$m.mo.versionUrl.replace("{adress}",$m.mo.remoteIp);
			$m.mo.baseUrl =$m.mo.baseUrl.replace("{adress}",$m.mo.remoteIp);
		}
	}

}
$m.server={
/**
 * 
 * @param {Object} time:0 循环响应直到响应到端口；非0：其他时间范围内响应
 * @param {Object} act
 */
	longCheck: function (time,act){
		if(typeof time !='undefined'){
			var start =time ;
			if(start!=0){
				start = Date.now() +time*1000;
			}
			$m.server.check(0,0,act,start);
		}
	},
	checkOnce: function (act){
		$m.server.check(0,0,act);
	},
	/**
	 * b=1表示响应，停止继续响应duank
	 * num:端口列表的索引
	 * act：回调方法
	 * limit:执行时间，0无限制，非零表示毫秒（开始执行到结束的毫秒数）
	 */
	check: function (b,num,act,limit){
		//检测多个端口，回调函数最后一次加载执行，DAEMON成功以后不再设置
		var f=function (c){
			//传进来是1，说明某个端口已响应，不再处理
			if(b){
				var e =c.target;
				e.onload = e.onerror = null;
				e.remove&&(e.remove(),1)||e.parentNode&&(e.parentNode.removeChild(e),1);
				return;
			}
			//只有第一次b未改状态时才处理
			$m.c.set($m.id.DAEMON,c.type=="load"?1:0);
			b = (c.type=="load"?1:0);
			var e =c.target;
			e.onload = e.onerror = null;
			e.remove&&(e.remove(),1)||e.parentNode&&(e.parentNode.removeChild(e),1);
			if ((b||(!limit&&num==$m.mo.mmPort.length-1))&&$m.u.f(act)) {
				//成功响应不再尝试响应端口
				if(b){
					$m.c.set($m.id.port,$m.mo.mmPort[num]);
					if(typeof a !='undefined')$m.server.version(a);
				}
				act(c.type=="load");
			}
			if(!b){//成功响应不再尝试响应端口
				num++;
				if(typeof limit =='undefined'){
					if(num<$m.mo.mmPort.length){
						setTimeout(function(){$m.server.check(b,num,act);}, 0);
					}
				}else{
					var time = Date.now();
					if(limit==0||time<=limit){
						if(num>=$m.mo.mmPort.length){
							num=0;
						}
						setTimeout(function(){$m.server.check(b,num,act,limit);}, 0);
					}else{
						act(c.type=="load");
					}
				}
			}
			
		}
		$m.n.create({tag:	"script", parent:	document.head , attr:{ type:	"text/javascript", src:	$m.mo.versionUrl.replace('{port}',$m.mo.mmPort[num])+"?"+Date.now()}, event:	{
			load:	 f ,error:	f	}	});
		
	},
	version:function(a){
		if($m.u.o(a)){
			var appname = a.appname;
			if(appname&&appname.length>0){
				var v=appname.match( $m.mo.version_reg );
				if(!!v){
					v = v[0].replace(/MM/i,'');
					if(v.length>0){
						var vs = v.replace(/\./g,'');
						$m.c.set($m.id.version,vs||0);
					}
				}
			}
		}
	},
	/**
	 * 高于指定版本返回ture,否则返回false;
	 */
	checkVersion:function(b){
		var v = $m.c.get($m.id.version);
		var rs = false;
		if($m.u.s(v)&&v.length>0){
			v = parseInt(v,10);
			if(v>b){
				rs= true;				
			}
		}
		return rs;
	}
}
$m.o={
	showDetailTitle:true,
	defaultChannelId:'5410093632',
	channelid:"",
	mmapp:'',//下载单个应用，MM不存在时，下载MM地址
	batchmmapp:'',//批量下载应用，MM不存在时，下载MM地址
	init:function(params){
		if(typeof params=='undefined'){
			return;
		}
		if(typeof params.showtitle != 'undefined'){
			$m.o.showDetailTitle = params.showtitle;
		}
		var channelid  = params.channelid||$m.o.defaultChannelId;
		$m.o.mmapp = $m.url.mmrelaapp.replace("{channelid}",channelid);
		$m.o.batchmmapp = $m.url.batchmmrelaapp.replace("{channelid}",channelid);
	},
	getMMUri:function(type){
		if(typeof type !="undefined" && type==$m.v.act.b){
			if(!$m.o.batchmmapp){
				if($m.o.channelid===""){
					$m.o.batchmmapp=$m.url.batchmmrelaapp.replace("{channelid}",$m.o.defaultChannelId);
				}else{
					$m.o.batchmmapp=$m.url.batchmmrelaapp.replace("{channelid}",$m.o.channelid);
				}
			}

			return $m.o.batchmmapp;
		}else{
			if(!$m.o.mmapp){
				if($m.o.channelid===""){
					$m.o.mmapp=$m.url.mmrelaapp.replace("{channelid}",$m.o.defaultChannelId);
				}else{
					$m.o.mmapp=$m.url.mmrelaapp.replace("{channelid}",$m.o.channelid);
				}
			}
			return $m.o.mmapp;
		}
	},
	download: function(id,type){
		var t= type||$m.v.act.dl;
		$m.server.checkOnce(function(status){
			if(status){
				$m.client.downloadApp(id,t);
			}else{
				$m.o.downloadmm(id,t);
			}
		})
	},
	detail:function(id){
		$m.server.checkOnce(function(status){
			if(status){
				$m.client.detailApp(id,$m.o.showDetailTitle);
			}else{
				$m.o.downloadmm(id );
			}
		})
	},
	checkOnce:function(act){
		$m.server.checkOnce(act);
	},
	/**
	 * intent方式，运行应用
	 * @param {Object} app
	 */
	run:function(app){
		$m.client.run(app,true);
	},
	isAndroid:function(){
		return $m.b.ua()=="android"?1:0;
	},
	downloadmm:function(id,type){
		//微信
		if($m.b.isWechat()){
			$m.client.download($m.url.wetchartmm);
		}else{
			var mmapp=$m.o.getMMUri(type);
			//支持的浏览器直接下载MM并安装，启动时下载应用
			var bs = $m.b.bs();
			if(bs!=''){
				var url = mmapp.replace('{contentid}',id);
				$m.client.download(url);
			}else{
				//不支持浏览器处理（列表空，暂不处理）
//				$m.client.download($m.url.mm);
				var url = mmapp.replace('{contentid}',"");
				$m.client.download(mmapp);
				setTimeout(function(){
					$m.server.longCheck(120,function(a){
						if(a){
							$m.client.downloadApp(id,type);
						}
					});
				},0)
			}
		}
	},
	/**
	 * @param {Object} arg:字符串用“/”分隔应用ID
	 */
	batchDownload:function(arg){
		if(typeof arg=='undefined'||arg==""){
			return;
		}
		var ids = arg.split("/");
		if(ids.length>0){
			var str = "";
			var count =0;
			ids.forEach(function(item){
				if(item&&/^(\d)*$/.test(item)){
					str===""?str=$m.u.encode(item):str+="-"+$m.u.encode(item);
					count++;
				}
			})
			if(count>15){
				alert($m.s.maxAlert);
			}else if(str!=""){
				$m.server.checkOnce(function(status){
					if(status){
						$m.client.downloadApp(str,$m.v.act.b);
					}else{
						$m.o.downloadmm(str,$m.v.act.b);
					}
				})
			}
		}
	}
}
$m.init=function(){
	$m.v.init();
	$m.client.setRequestUrl();
	window.mm=$m.o;
}
$m.init();
})();