/**
 * Created by linxiaojie on 2015/10/14.
 * 检测客户端服务
 */
var Event = require('./Event'),
    Params = require('./Params'),
    Util = require('./Util'),
    Config = require('./Config'),
    versionReg = Config.versionReg();

var isCheck = false,
    port = '',//端口加载成功时记录
    mmPort = [9817, 19817, 29817, 39817, 49817, 59817],
    versionUrl = Params.versionUrl,
    errCount = 0, //已检测失败端口数
    version_reg = versionReg.version_reg,
    version_prefix = versionReg.version_prefix,
    slice = [].slice,
    check_args = [], //服务端校验传入的参数;
    temp = null;
/*    longCheckTime = 3000, //长轮训检测间隔时间
    longCheckNum = 3,//长轮训检测次数
    tempLongCheckNum = 0; //长轮训已检测次数*/

/*
    开始检测MM，下载、详情等调用MM功能都会触发次事件，
    evt参数为 method，其他参数；
    检测MM成功会把参数传给success事件回调
    检测MM失败会把参数传给error事件回调
 */
function check(evt) {
    //console.log('check' + isCheck);
    hasFlag();
    check_args = slice.call(evt.args, 1);
    if (isCheck) return;
    Event.trigger("server.before.check");
    commonCheck(load);
};

/*
    激活失败时，可以进行一个长时间的轮训操作
 */
/*function longCheck(evt){
    console.log('longCheck' + isCheck);
    hasFlag();
    check_args = slice.call(evt.args, 1);
    if (isCheck) return;
    Event.trigger("server.before.check");
    commonCheck(longCheckLoad);
}*/

/*
    check/longCheck校验的核心方法
 */
function commonCheck(fn){
    mmPort.forEach(function(p) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.setAttribute("port", p);
        script.setAttribute("class", "__js_load_mm");
        script.onload = script.onerror = fn;
        script.src = versionUrl.replace("{port}", p) + "?" + Date.now();
        document.getElementsByTagName("head")[0].appendChild(script)
    })
}


/*
 判断检测成功or失败，script监听事件
 一次性结果
 */
function load(e) {
    if (port !== '') return;//说明已有端口加载成功
    if (e.type == 'load') {
        var target = e.target;
        port = target.getAttribute("port");
        //debug.log("load success :"+port);
        Event.trigger("server.after.check", "success", port);
    } else {
        errCount++;
        if (errCount == mmPort.length) {
            Event.trigger("server.after.check", "error");
        }
    }
};
/*
 判断检测成功or失败，script监听事件
 指定时间内一直轮训直到成功
 */
/*function longCheckLoad(e){
    if (port !== '') return;
    if (e.type == 'load') {
        var target = e.target;
        port = target.getAttribute("port");
        //debug.log("load success :"+port);
        Event.trigger("server.after.check", "success", port);
    } else {
        errCount++;
        if(errCount == mmPort.length){
            tempLongCheckNum++;
            tempLongCheckNum == longCheckNum ? (console.log('longcheckover'), Event.trigger("server.after.check", "error"))
                : (errCount = 0, setTimeout(function(){commonCheck(longCheckLoad)}, longCheckTime));
        }
    }
}*/

//页面有a变量，需先存起来，避免被覆盖 ----历史预留问题
function hasFlag(){
    if(typeof window.a !== 'undefined' && typeof window.a.appname == 'undefined'){
        temp = window.a;
    }
};

function beforeCheck() {
    removeAll();
    isCheck = true;
    port = '';
    errCount = 0;
    //tempLongCheckNum = 0;
    Util.setCookie(Params.port, null);
    Util.setCookie(Params.version, null);
    Util.setCookie(Params.version_type, null);
};

function afterCheck(evt) {
    var args = evt.args.slice(1),
        e = function() {
            check_args.unshift("server.check.error");
            Event.trigger.apply(Event, check_args);
        };
    removeAll();
    //console.log('afterCheck');
    isCheck = false;
    port = '';
    errCount = 0;
    //tempLongCheckNum = 0;
    if ("success" === args[0]) {
        Util.setCookie(Params.port, args[1]);
        //历史问题，客户端连接校验直接返回了全局变量a，会有覆盖页面变量的风险
        if (typeof window.a != 'undefined' && typeof window.a.appname != 'undefined') {
            var res = setVersion(window.a);
            //页面本来没有定义a变量，删除
            if(temp === null){
                delete window.a;
            }else{//还原a变量
                window.a = temp;
            }
            if(res){
                check_args.unshift("server.check.success");
                Event.trigger.apply(Event, check_args);
                return;
            }
        } /*else {
            e();
        }*/
    } /*else {
        e();
    }*/
    e(); /*socket请求失败，或者版本对不上（MM|MMLite|MMOpen*/
};

function setVersion(a) {
    var appname = a.appname;
    var res = 0;
    if (appname && appname.length > 0) {
        var v = appname.match(version_reg);
        if (!!v) {
            //版本标志：lite or normal
            var vtype = v[1] || 'MM';
            Util.setCookie(Params.version_type, vtype.toUpperCase());

            v = v[0].replace(version_prefix, '');
            if (v.length > 0) {
                var vs = v.replace(/\./g, '');
                var vc = Config.versionCode()
                if (!vc || vc && parseInt(vs, 10) >= parseInt(vc, 10)){
                    Util.setCookie(Params.version, vs || 0);
                    //debug.log(vtype.toUpperCase()+"  "+vs)
                    res = 1;
                }
            }
        }
    }
    return res;
}



function removeAll() {
    var loads = document.getElementsByClassName("__js_load_mm");
    if (loads.length) {
        var els = slice.call(loads);
        els.forEach(function(el) {
            el.onload = el.onerror = null;
            el.remove && (el.remove(), 1) || el.parentNode && (el.parentNode.removeChild(el), 1);
        })
    }
};

var init = function (){
    Event.on("server.before.check", beforeCheck.bind(this));
    Event.on("server.after.check", afterCheck.bind(this));
    Event.on("server.check.start", check.bind(this));
    /*Event.on("server.longcheck.start", longCheck.bind(this));*/
}

module.exports = {init: init};
