(function() {
var $m={
	s:{},	// 常量定义
	url:{},	// 常用url定义
	mm:{},	// 调起方法： close downloadMM css view start init
	//a:{},	// 业务类 status 客户端是否开启	log 日志	mm 下载MM	isShow 是否关闭MM客户端调起
	web:{},	// detail 将页面中的详情页换成客户端打开
	u:{},	// 工具方法
	b:{},	// 浏览器方法
	c:{},	// cookie 
	n:{},	// 节点工具类
	o:{},	//提供给外部的调用方法
	v:{},	//版本能力检测
	server:{}, //激活端口服务
	client:{}, //浏览器调起方法
	alert:{}, //alert 插件
	event:{} //event
};
$m.s={
	base:'',
	MM_CONTENT_ID:'300000863435',
	CHATSET:'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
}
$m.url={
	css:	"mmapp.css",
	mm:				"http://a.10086.cn/d?ua=8020",
	mmrelaapp:		"http://apk.mmarket.com/mmapk/{channelid}/mmarket-999100008100930100001752138{contentid}-180.apk",
	batchmmrelaapp: "http://apk.mmarket.com/mmapk/{channelid}/mmarket-{contentid}-180.apk",
	wetchartmm:		"http://a.app.qq.com/o/simple.jsp?pkgname=com.aspire.mm"
}
$m.mo={
	index:			"mm://index",
	launch:			"mm://launchbrowser?url=",
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
	version_reg:	/^(MMLite|MM)[0-9]+(\.[0-9]*|$)?(\.[0-9]*|$)?/i,
	downloadUri:	"http://odp.mmarket.com/t.do?requestid=app_order&goodsid=999100008100930100001752138{contentid}&payMode=1",
}
$m.id={
	DAEMON:	"mmcd", 
	package:"com.aspire.mm",
	url:	"url",
	version: "mmversion",
	version_type: "mmversiontype",
	port:	"port"
}
$m.u={ //util
	e:	Object.prototype.toString,
	f:	function(a){ return "[object Function]" == $m.u.e.call(a)  },
	o:	function(a){ return "[object Object]" == $m.u.e.call(a)   },
	a:  function(a){ return "[object Array]" == $m.u.e.call(a) },
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
			var charSet = $m.s.CHATSET;
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
		var charSet = $m.s.CHATSET;
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
	isChrome:	function()	{
		var ua = navigator.userAgent.toLowerCase();
		return ua.match(/360 aphone /i)?false:(ua.match(/Chrome/i)=="chrome");
	},
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
	isQq:function(){
		var ua = navigator.userAgent.toLowerCase();	return ua.match(/MQQBrowser/i)?1:0;
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
			b360:ua.match(/360 aphone/i)?'360浏览器':'',
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
	longFileNameAccept:function(){
		var result =false,
		ua = window.navigator.userAgent.toLowerCase();
		var browser = {
//			whatchar:ua.match(/MicroMessenger/i)?'微信':'',
//			uc:ua.match(/(UCBrowser)|(UCWEB)/i)?'UC浏览器':'',
			qq:ua.match(/MQQBrowser/i)?'QQ浏览器':'',
//			op:ua.match(/oupeng/i)?'欧朋浏览器':'',
			ay:ua.match(/MxBrowser/i)?'遨游浏览器':'',
			lb:ua.match(/LieBao/i)?'猎豹浏览器':'',
//			xm:ua.match(/MiuiBrowser/i)?'小米浏览器':'',
			bd:ua.match(/baidubrowser/i)?'百度浏览器':'',
//			b360:ua.match(/360 aphone browser/i)?'360浏览器':'',
//			sg:ua.match(/sogoumobilebrowser/i)?'搜狗浏览器':''
		};
		for(var b in browser){
			if(browser[b]!=''){
				result = true;
				break;
			}
		}
		return result;
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
		$m.u.each(o.event,function(k,v){ $m.event.addHandle(n,k,v) ;//n.addEventListener(k,v); 
		});
		var p=o.parent;
		if (p!=null) p.appendChild(n);
		return n;
	}
}
$m.v={
	act:{
		b:'batchdownload', //批量下载
		dl:'download',//单应用下载
		d:'detail',//详情
	},
	ls:{
		"MM":{},
		"MMLITE":{}
	},
	init:function(){
		//MM正式版本，版本功能：
		
		$m.v.ls["MM"][$m.v.act.b]=510;
		$m.v.ls["MM"][$m.v.act.dl]=501;
		$m.v.ls["MM"][$m.v.act.d]=500;
		
		//MMLite版本，版本功能：
		$m.v.ls["MMLITE"][$m.v.act.b]=200;
		$m.v.ls["MMLITE"][$m.v.act.dl]=200;
		$m.v.ls["MMLITE"][$m.v.act.d]=200;
	},
	support:function(type){
		var v = $m.c.get($m.id.version);
		var vtype = $m.c.get($m.id.version_type);
//		alert(vtype);
		var rs = false;
		if(!!type){
			if($m.u.s(v)&&v.length>0){
				v = parseInt(v,10);
				var base = $m.v.ls[vtype][type];
				if(base&&v>=base){//高于或等于指定功能版本则支持
					rs= true;				
				}
			}
		}
		return rs;
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
$m.client={
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
		
//		e.addEventListener("load",function(){
			setTimeout(function(){
				if($m.u.f(call)){
					var ifdoc = e.contentDocument||e.contentWindow.document;
					call(ifdoc.name);
				}
				document.body.removeChild(e);
			},1000);
//		})
	},
	open:function(url,show){
		var showtitle = show||true;
		var mmap=$m.mo.launch+encodeURIComponent(url);
		if($m.server.status()){
			if($m.v.support($m.v.act.d)){
				mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.jump+
				encodeURIComponent(url)+(showtitle?("&appname="+$m.b.getCurrentBs()):'');
				$m.client.iframe(mmap);
			}else{
				$m.client.run(url,true);
			}
		}
	 },
	downloadApp:function(id,type){
		var act=type||$m.v.act.dl;
  		if($m.server.status()){
			var mmap=$m.mo.appdetail+encodeURIComponent(id);
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
					$m.alert.show({
						type:"alert",
						info:$m.o.get("lowVersionAlert"),
						save:function(){
							if($m.v.support($m.v.act.d)){
								var mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.jump+
								encodeURIComponent($m.mo.appdetail + $m.s.MM_CONTENT_ID)+($m.o.get("showtitle")?("&appname="+$m.b.getCurrentBs()):'');
								$m.client.iframe(mmap);
							}else{
							    var mmap=$m.mo.appdetail+encodeURIComponent($m.s.MM_CONTENT_ID);
								$m.client.run(mmap,true);
							}
						}
					})
				}
			}
  		}
	  },
	detailApp:function(id,showtitle){
		if($m.server.status()){
			var mmap=$m.mo.appdetail+encodeURIComponent(id);
			if($m.v.support($m.v.act.d)){
				mmap=$m.mo.baseUrl.replace("{port}",$m.c.get($m.id.port)+"")+$m.mo.method.jump+
				encodeURIComponent($m.mo.appdetail + id)+(showtitle?("&appname="+$m.b.getCurrentBs()):'');
				$m.client.iframe(mmap);
			}else{
				$m.client.run(mmap,true);
			}
		}
	},
	/**
	 * 使用域名或者IP
	 */
	setRequestUrl:function(){
		if($m.b.isWechat()||$m.b.isQq()){
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
 * @param {Object} options
 */
	longCheck: function (time,options){
//		console.log(this.checking);
		if(this.checking) return ;
		this.lockCheck();
		if(typeof time !='undefined'){
			var start =time ;
			if(start!=0){
				start = Date.now() +time*1000;
			}
			$m.server.check(0,0,options,start);
		}
	},
	checkOnce: function (options){
		if(this.checking) return ;
		this.lockCheck();
		$m.server.check(0,0,options);
	},
	/**
	 * b=1表示响应，停止继续响应duank
	 * num:端口列表的索引
	 * options：回调方法
	 * limit:执行时间，0无限制，非零表示毫秒（开始执行到结束的毫秒数）
	 */
	check: function (b,num,options,limit){
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
			if ((b||(!limit&&num==$m.mo.mmPort.length-1))&&$m.u.o(options)) {
				//成功响应不再尝试响应端口
				if(b){
					$m.c.set($m.id.port,$m.mo.mmPort[num]);
					if(typeof a !='undefined')$m.server.version(a);
				}
				if(c.type=="load"&&$m.u.f(options.success)){
					options.success();
					$m.server.unLockCheck();
				}else if(c.type!="load"&&$m.u.f(options.error)){
					options.error();
				}
			}
			if(!b){//成功响应不再尝试响应端口
				num++;
				if(typeof limit =='undefined'){
					if(num<$m.mo.mmPort.length){
						setTimeout(function(){$m.server.check(b,num,options);}, 0);
					}
				}else{
					var time = Date.now();
					if(limit==0||time<=limit){
						if(num>=$m.mo.mmPort.length){
							num=0;
						}
						setTimeout(function(){$m.server.check(b,num,options,limit);}, 0);
					}else{
						if(c.type=="load"&&$m.u.f(options.success)){
							options.success();
							$m.server.unLockCheck();
						}else if(c.type!="load"&&$m.u.f(options.error)){
							options.error();
						}
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
					//版本标志：lite or normal
					var vtype = v[1]||'MM';
					$m.c.set($m.id.version_type,vtype.toUpperCase());
						
					v = v[0].replace(/(MMLite|MM)/i,'');
					if(v.length>0){
						var vs = v.replace(/\./g,'');
						$m.c.set($m.id.version,vs||0);
					}
				}
			}
		}
	},
	status:	function ()	{return $m.c.get($m.id.DAEMON)==1;
	},
	checking:false,//调起MM功能加锁，避免短时间重复唤起
	lockCheck:function(){
		this.checking = true;
	},
	unLockCheck:function(){
		this.checking = false;
	}
}
$m.o={
	locked:false, //MM唤起加锁，避免短时间重复唤起
	defaults:{
		batchMaxApps:"15",
		maxAlert:'\u6279\u91cf\u4e0b\u8f7d\u8d85\u8fc7\u6700\u5927\u4e0b\u8f7d\u6570\u0031\u0035\u4e2a,\u8bf7\u91cd\u65b0\u9009\u62e9',
		lowVersionAlert:'\u62b1\u6b49,\u60a8\u7684\u004d\u004d\u7248\u672c\u8fc7\u4f4e\u65e0\u6cd5\u652f\u6301\u8be5\u529f\u80fd,\u8bf7\u5347\u7ea7\u65b0\u7248\u5ba2\u6237\u7aef',
		showtitle:true,
		channelid:'5410093632',
		onIntent:true,//开启intent调用
		reCall:2000,//端口激活失败，通过intent调用，指定reCall时间重新激活接口
		lockTime:2000 //MM唤起加锁时间，避免短时间重复唤起
	},
	init:function(params){
		if(typeof params=='undefined' || !$m.u.o(params)){
			return;
		}
		for (var prop in $m.o.defaults) {
	        if (prop in params) {
	            $m.o.defaults[prop] = params[prop]
	        }
	    }
	},
	getMMUri:function(type){
		//批量下载应用 mm下载路径
		if(typeof type !="undefined" && type==$m.v.act.b){
			return $m.url.batchmmrelaapp.replace("{channelid}",this.get("channelid"));
		}else{//单应用下载 mm下载路径
			return $m.url.mmrelaapp.replace("{channelid}",this.get("channelid"));
		}
	},
	initOptions:function(dely){
		var self = this;
		var duration = dely||self.get("reCall")||2000;
		var lockTime = self.get("lockTime")||2000;
		var options  = {
			success:function(){
				
			},
			error:function(){
				var _this = this;
				//不开启intent调启
				if(!self.get("onIntent")){
					_this.errorHood();
					return;
				}
				//微信:scheme调起无效，直接跳到应用宝下载MM
				if($m.b.isWechat()){
					_this.errorHood();
				}else{
//					var self = this;
					if($m.o.locked){
						return;
					}
					$m.o.locked = true;
					$m.client.iframe($m.mo.index);
//					$m.client.chrome($m.mo.index);
					//指定延时后，重新执行下载任务
					setTimeout(function(){
						$m.u.f($m.server.unLockCheck)&&$m.server.unLockCheck();
						var opts = {
							success:function(){
								_this.success();
							},
							error:function(){
								_this.errorHood();
							}
						};
						$m.o.exce(opts);
					},duration);
					
					//超过调起时间，去掉加锁
					setTimeout(function(){
						$m.o.locked = false;
					},lockTime);
				}
			},
			errorHood:function(){
				$m.o.downloadmm();
			}
		}
		return options;
	},
	download: function(id){
		var t= $m.v.act.dl;
		var options = this.initOptions();
		options.success=function(){
			$m.client.downloadApp(id,t);
		}			
		options.errorHood=function(){
			$m.o.downloadmm(id,t);
		}
		$m.o.exce(options);
	},
	detail:function(id){
		var options = this.initOptions();
		options.success=function(){
			$m.client.detailApp(id,$m.o.get("showtitle") );
		}	
		options.errorHood=function(){
			$m.o.downloadmm(id,$m.v.act.d);
		}
		$m.o.exce(options);
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
	//激活失败的最终触发方法，在这里做用户触发解锁
	downloadmm:function(id,type){
		//微信
		if($m.b.isWechat()){
			var start = Date.now();
			$m.alert.show({
				type:"weixin",
				save:function(){
					$m.client.download($m.url.wetchartmm);
				},
				ready:function(){
					$m.server.unLockCheck();
					alert(Date.now()-start);
				}
			})
		}else{
			var mmapp=$m.o.getMMUri(type);
			var contentid = id||"";
			var dt = type||$m.v.act.d;
			//支持的浏览器直接下载MM并安装，启动时下载应用
			var bs = $m.b.bs();
			if(bs =='' || (!$m.b.longFileNameAccept()&&dt===$m.v.act.b)){
				var url = mmapp.replace('{contentid}',"");
				$m.client.download(url);
				var options = this.initOptions();
				options.success=function(){
					if(contentid!=="")
					$m.client.downloadApp(contentid,type);
				}
				options.error = function(){
					$m.server.unLockCheck();
				}
				setTimeout(function(){
					$m.server.unLockCheck();
					$m.server.longCheck(2,options);
				},0)
			}else{
				var url = mmapp.replace('{contentid}',contentid);
				$m.client.download(url);
				$m.server.unLockCheck();
			}
			
			setTimeout(function(){
				$m.alert.show({
					type:"guid",
					save:function(){
						$m.o.callMMbyType(contentid,dt);
					},
					ready:function(){
						$m.server.unLockCheck();
					}
				})
			},0)
		}
	},
	/**
	 * @param {Object} arg:数组或字符串；字符串用“/”分隔应用ID
	 */
	batchDownload:function(arg){
		if(typeof arg=='undefined'||arg==""){
			return;
		}
		var ids = new Array();
		if($m.u.s(arg)){
			if(!/^[\d\/]*$/.test(arg)){
				return;
			}
			ids = arg.split("/");
		}else if($m.u.a(arg)){
			if(arg.length==0){
				return;
			}
			ids = arg;
		}
		if(ids.length>0){
			var str = "";
			var count =0;
			ids.forEach(function(item){
				if(item&&/^(\d)*$/.test(item)){
					str===""?str=$m.u.encode(item):str+="-"+$m.u.encode(item);
					count++;
				}
			});
			if(count>$m.o.get("batchMaxApps")){
//				alert($m.o.get("maxAlert"));
				$m.alert.show({
					type:"alert",
					info:$m.o.get("maxAlert")
				})
			}else if(str!=""){
				var options = this.initOptions();
				options.success=function(){
					$m.client.downloadApp(str,$m.v.act.b);
				}
				options.errorHood = function(){
						if(count==1){
							str = $m.u.decode(str);
						}
						$m.o.downloadmm(str,$m.v.act.b);
				}
				$m.o.exce(options);
			}
		}
	},
	//内部调用:str为页面经过加密的ids，单个时，为了兼容后台做了不加密id,对比batchDownload可看出区别
	__batchDownload:function(str){
		var count = 0;
		if(/^(\d)*$/.test(str)){
			conut = 1;
		}
		var options = this.initOptions();
		options.success=function(){
			if(count==1){
				str = $m.u.encode(str);
			}
			$m.client.downloadApp(str,$m.v.act.b);
		}
		options.errorHood = function(){
			$m.o.downloadmm(str,$m.v.act.b);
		}
		$m.o.exce(options);
	},
	//内部调用：批量调用比较特殊，失败的时候id不加密，成功ID加密，所以不能直接调用这个方法
	callMMbyType:function(id,type){
		var self = this;
//		console.log(id+"  "+type);
		switch (type){
			case $m.v.act.b: self.__batchDownload(id);
				break;
			case $m.v.act.dl: self.download(id)
				break;
			case $m.v.act.d: self.detail(id);
				break;
			default:
				break;
		}
	},
	open:function(url,url2){
		var options = this.initOptions();
		options.success=function(){
			$m.client.open(url,$m.o.get("showtitle"));
		}
		options.error = function(){
			$m.server.unLockCheck();
		}
		$m.o.exce(options);
	},
	set:function(key,value){
		if(key in $m.o.defaults){
			$m.o.defaults[key] = value;
		}
	},
	get:function(key){
		if(key in $m.o.defaults){
			return $m.o.defaults[key]
		}
	},
	exce:function(options,time){
		$m.server.checkOnce(options);
	}
}
$m.alert={
	cssloaded:0,
	creating:!1,
	el:{},
	options:{
		type:"alert",//"alert|confirm|guid|weixin|"
		info:"",
		save:function(){
			
		},
		cancle:function(){
			
		},
		ready:function(){}
	},
	clearOpts:function(){
		var self = this;
			self.options = {
			type:"alert",//"alert|confirm|guid|weixin|"
			info:"",
			save:function(){
				
			},
			cancle:function(){
				
			},
			ready:function(){}
		}
	},
	movePrevent:function(e){
		$m.event.preventDefault(e);
		$m.event.stopPropagation(e);
	},
	set:function(opts){
		var self = this;
		for(var i in self.options){
			typeof opts[i] != "undefined" && (self.options[i] = opts[i])
		}
	},
//	css:	function(){var h = document.getElementsByTagName("head")[0];
//		return { tag:"link",parent:	h , attr:	{rel:"stylesheet", type:	"text/css", href:	$m.s.base+$m.url.css },event:{}}},
	view:function (){
		var self = this;
		var res = "";
		if(self.options.type ==="guid"){
			res = "<div class=\"__mm-wap-hint\">\r\n\t<div class=\"__mm-wap-hint-msg\">\r\n\t\t\u5b89\u88c5\u5e76\u542f\u52a8\u004d\u004d\u5546\u573a\u540e\u5c06\u81ea\u52a8\u5f00\u59cb\u9ad8\u901f\u4e0b\u8f7d\uff0c\u5982\u6ca1\u5f00\u59cb\u9ad8\u901f\u4e0b\u8f7d\uff0c<span class=\"__mm-wap-hint-link\" id=\"__mm-wap-success\">\u8bf7\u70b9\u8fd9\u91cc</span>\r\n\t</div>\r\n\t<div class=\"__mm-wap-hint-close\" id=\"__mm-wap-close\">\r\n\t\t<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC\" />\r\n\t</div>\r\n</div>";
		}else if(self.options.type === "weixin"){
			res = "<div class=\"__mm-wap-dialog-mask\"></div>\r\n<div class=\"__mm-wap-dialog\" id=\"__mm-wap-dialog\">\r\n\t<div class=\"__mm-wap-dialog-close \" id=\"__mm-wap-close\">\r\n\t\t<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC\" />\r\n\t</div>\r\n\t<div class=\"__mm-wap-hd\">\r\n\t\t\u9ad8\u901f\u4e0b\u8f7d\u6307\u5f15\r\n\t</div>\r\n\t<div class=\"__mm-wap-bd\">\r\n\t\t<p class=\"__mm-wap-guid-tit\">\u8bf7\u6309\u4ee5\u4e0b\u6b65\u9aa4\u64cd\u4f5c\u5b8c\u6210\u9ad8\u901f\u4e0b\u8f7d\uff1a</p>\r\n\t\t<div class=\"__mm-wap-guid-step\">\r\n\t\t\t<p>\u7b2c<span class=\"__mm-wap-guid-step-num\">1</span>\u6b65 </p>\r\n\t\t\t<p>\u4e0b\u8f7d\u5b89\u88c5\u004d\u004d\u5546\u573a\u540e<span class=\"__mm-wap-guid-step-hint\">\u542f\u52a8\u4e00\u6b21</span>\u6216<span class=\"__mm-wap-guid-step-hint\">\u6253\u5f00\u4e00\u6b21</span></p>\r\n\t\t</div>\r\n\t\t<div class=\"__mm-wap-guid-step\">\r\n\t\t\t<p>\u7b2c<span class=\"__mm-wap-guid-step-num\">2</span>\u6b65</p>\r\n\t\t\t<p>\u56de\u5230\u5fae\u4fe1\u518d\u6b21\u70b9\u51fb\u201c\u9ad8\u901f\u4e0b\u8f7d\u201d\u3002</p>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"__mm-wap-ft\">\r\n\t\t<div class=\"__mm-wap-btn  \" id=\"__mm-wap-success\">\r\n\t\t\t\u524d\u5f80\u4e0b\u8f7d\u004d\u004d\u5546\u573a\r\n\t\t</div>\r\n\t</div>\r\n</div>";
		}else {
			res = "<div class=\"__mm-wap-toast-cover\">\r\n\t<div class=\"__mm-wap-dialog-mask\"></div>\r\n\t<div class=\"__mm-wap-dialog\" id=\"__mm-wap-dialog\">\r\n\t\t<div class=\"__mm-wap-dialog-close \" id=\"__mm-wap-close\">\r\n\t\t\t<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC\" />\r\n\t\t</div>\r\n\t\t<div class=\"__mm-wap-bd\">\r\n\t\t\t<div class=\"__mm-wap-bd-info\">\r\n\t\t\t\t<p>"+self.options.info+"</p>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"__mm-wap-ft\">\r\n\t\t\t<div class=\"__mm-wap-btn  \" id=\"__mm-wap-success\">\r\n\t\t\t\t\u786e\u5b9a\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";
			
		}
		
		return res;
	},
	onload:function(node, callback) {
		var self = this;
	    if (node.attachEvent) {
	      node.attachEvent('onload', callback);
	    }
	    else {
	      setTimeout(function() {
	        self.poll(node, callback);
	      }, 0);
	    }
	},
	poll:function(node, callback) {
	  var self = this;
	  if (callback.isCalled) {
	    return;
	  }
	  if (/webkit/i.test(navigator.userAgent)) {//webkit
	    if (node['sheet']) {
	      self.cssloaded = !0;
	    }
	  }else if (node['sheet']) {
	    try {
	      if (node['sheet'].cssRules) {
	        self.cssloaded = !0;
	      }
	    } catch (ex) {
	      if (ex.code === 1000) {
	        self.cssloaded = !0;
	      }
	    }
	  }
	
	  if (self.cssloaded) {
	    setTimeout(function() {
	      callback();
	      callback.isCalled = !0;
	    }, 1);
	  }else {
	    setTimeout(function() {
	      self.poll(node, callback);
	    }, 1);
	  }
	},
	loadcss:function(href,fn){
	  var self = this;
	  var node = document.createElement("link");
	  node.setAttribute("rel","stylesheet");
	  node.setAttribute("type","text/css");
	  node.setAttribute("href",href);
	  document.body.appendChild(node);
	  self.onload(node,function(){
//	      fn.apply(self,arguments);
		  if($m.u.f(fn)){
				fn();
		  }
	  });
	},
	show:function(opts){
		var self = this;
		self.clearOpts();
		self.set(opts);
		self.loaded(function(){
			self.create();
		});
	},
	create:function(){
		var self = this;
		if(self.creating) return ;
		self.creating = !0;
		var n = self.query("__mm-wap-toast");
		if(n && n.parentNode){  
	        n.parentNode.removeChild(n);  
	    }
		var html = self.view();
		var d = document.createElement("div");
		d.setAttribute("id","__mm-wap-toast");
		d.style.display = "none";
		d.innerHTML = html;
		document.body.appendChild(d);
		self.el['__mm-wap-toast'] = [d];
		self.refresh();
		self.addHandle();
		setTimeout(function(){
			$m.u.f(self.options.ready)&&self.options.ready();
		},100)
	},
	refresh:function(){
		var self = this;
		var d = (self.el['__mm-wap-toast'] ||(self.el['__mm-wap-toast']=[self.query("__mm-wap-toast")]))[0];
		if(d != null ){
			d.style.display="block";
			var sTop =document.body.scrollTop || document.documentElement.scrollTop;
			if(self.options.type != "guid"){		
				d.style.height = Math.max(document.body.scrollHeight,document.body.clientHeight)-1+"px";
				d.setAttribute("class","__mm-wap-toast-cover");
			}
			var sH = document.body.offsetHeight || document.documentElement.offsetHeight;
			var alt = self.query("__mm-wap-dialog");
			alt&&(alt.style.top =parseInt(sTop+(window.innerHeight-alt.offsetHeight)/2,10) +"px",1);
		}
	},
	addHandle:function(){
		var self = this;
		var t = self.el['__mm-wap-toast'] ||(self.el['__mm-wap-toast']=self.query("__mm-wap-toast"));
		t.push("touchmove");
		t.push(self.movePrevent);
		//遮罩不能滑动
		$m.event.addHandle.apply($m.event,t);
		//window resize 调整弹窗布局
		self.resize = function(e){
			self.refresh()
		}
		$m.event.addHandle(window,"resize",self.resize)
		$m.event.addHandle(window,"scroll",self.resize)
		//关闭 确定 事件
		var success = self.el['__mm-wap-success'] ||(self.el['__mm-wap-success']=[self.query("__mm-wap-success")]);
		var close = self.el['__mm-wap-close'] ||(self.el['__mm-wap-close']=[self.query("__mm-wap-close")]);
		if(success != null && success.length>0){
			success.push("touchstart");
			success.push(function(e){
				$m.event.preventDefault(e);
				$m.event.stopPropagation(e);
				self.options.save();
				self.destory();
				return false;
			});
			$m.event.addHandle.apply($m.event,success);
		}
		if(close != null && close.length>0){
			close.push("touchstart");
			close.push(function(e){
				$m.event.preventDefault(e);
				$m.event.stopPropagation(e);
				this.className +=" active"; 
				self.options.cancle();
				self.destory();
				return false;
			});
			$m.event.addHandle.apply($m.event,close);
		}
	},
	loaded:function(fn){
		var self = this;
		if(!self.cssloaded){
//			var css = self.css();
//			css.event.load=function (){
//				self.cssloaded = 1;
//				if($m.u.f(fn)){
//					fn();
//				}
//			}
//			$m.n.create(css);
			var href = $m.s.base+$m.url.css;
			self.loadcss(href,fn)
		}else{
			if($m.u.f(fn)){
				fn();
			}
		}
	},
	query:function(id){
			return document.querySelector?document.querySelector("#"+id):document.getElementById(id);
	},
	hide:function(){
		var self = this;
		var alt = self.query("__mm-wap-toast");
		alt&&(alt.style.display = "none");
	},
	destory:function(){
		var self = this;
		for(var i in self.el){
			var e = self.el[i];
			if(!!e){
				if(!!e[0])continue;
				if(i === "__mm-wap-toast") e[0].style.display="none";
				$m.event.removeHandle.apply($m.event,e);
			}
		}
		self.creating = !1;
		$m.event.removeHandle(window,"resize",self.resize);
		$m.event.removeHandle(window,"scroll",self.resize);
		var n = self.el["__mm-wap-toast"][0];
		if(n && n.parentNode){  
	        n.parentNode.removeChild(n);  
	    }
		self.el = {};
	}
}
$m.event = {
	addHandle:function(el,type,handle){
		if(el.addEventListener){
			el.addEventListener(type,handle,false);
		}else if(el.attachEvent){
			el.attachEvent("on"+type,handle);
		}else{
			el["on"+type]=handle;
		}
	},
	removeHandle:function(el,type,handle){
		if(el.addEventListener){
			el.removeEventListener(type,handle,false);
		}else if(el.attachEvent){
			el.detachEvent("on"+type,handle);
		}else{
			el["on"+type]=null;
		}
		
	},
	getEvent:function(event){
		return event?event:window.event;
	},
	getTarget:function(event){
		return event.target|| event.srcElement;
	},
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},
	preventDefault:function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	getRelatedTarget:function(event){
		if(event.relatedTarget){
			return event.relatedTarget
		}else if(event.fromElement){
			return event.fromElement
		}else if(event.toElement){
			return event.toElement
		}else{
			return null
		}
	},
	getCharCode:function(event){
		if(event.charCode){
			return event.charCode;
		}else if(event.keyCode){
			return event.keyCode;
		}
	}
}
$m.init=function(){
	$m.v.init();
	$m.client.setRequestUrl();
	window.mm=$m.o;
	
	$m.u.each(document.querySelectorAll("script"),function(a){
		var b = a.src.match($m.mo.moapp_reg);
		if(b){ $m.s.base = b[1]}
	})
	
//	$m.alert.loaded();
//	setTimeout(function(){
//		$m.alert.show({
//			type:"weixin",
//			info:'44444',
//			save:function(){
//				alert('ok')
//			},
//			cancle:function(){
//				alert('cancle')
//			}
//		})
//	},1000)
	
}
$m.init();
})();