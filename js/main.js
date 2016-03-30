/**
 * Created by linxiaojie on 2015/10/14.
 */
var Event = require('./Event'),
    Util = require('./Util'),
    Client = require('./Client'),
    ServerManager = require('./ServerManager'),
    Dialog = require('./Dialog'),
    Config = require('./Config'),
    slice = [].slice,
    toString = Object.prototype.toString;

//功能检测
if (!Function.prototype.bind) {
    Function.prototype.bind = function(obj) {
        var slice = [].slice,
            args = slice.call(arguments, 1),
            me = this,
            nop = function() {},
            bound = function() {
                return me.apply(this instanceof nop ? this : (obj || {}),
                    args.concat(slice.call(arguments)))
            };
        nop.prototype = me.prototype;
        bound.prototype = new nop();

        return bound
    }
}

function ofType(obj){
    return {
        f: toString.call(obj) === "[object Function]",
        o: toString.call(obj) === "[object Object]",
        a: toString.call(obj) === "[object Array]",
    }
}

/*
 注册校验服务
 */
ServerManager.init();


/*
 *
 * 注册功能列表
 * MM检测结果会触发success/error事件，
 * evt.arg为触发MM检测的参数，arg[0]为Client.method 名称，
 * 通过Client.execute进行回调
 *
 * 注意： 20151217 bug修复：杀死MM，如果是调起页面，调起MM时不开首页，直接开具体页面
 * UC二次校验成功，不二次打开页面
 */
Event.on("server.check.success", function(evt) {
    console.log('success');
    var args = evt.args.slice(1);
    var method = args&&args[0]||'';
    if(method == "downloadmm"){//二次激活成功时
        args.shift()
    }
    Client.execute.apply(Client, args);
});
Event.on("server.check.error", function(evt) {
    var args = slice.call(evt.args, 1);
    var method = args && args[0] || '';
    if(method !== "downloadmm"){//第一次激活失败，走二次激活流程；第二次激活失败method=="downloadmm"，直接下载mm,不走error流程
        args.unshift("error");//调用error方法，走二次激活流程
    }/*else { //放入error流程判断
        //如果是open方法(type=false)，二次激活失败不走MM下载流程
        var origMethod = args[1];
        if (args.length === 4 && origMethod === 'open' && !args[3] ){
            return;
        }
    }*/


    Client.execute.apply(Client, args);
});


/*
 *
 * Dialog初始化
 *
 */
Util.each(document.querySelectorAll("script"), function(a) {
    var s = a.src;
    if (!!s) {
        var b = s.match(/^(.*)mmapp.js/);
        if (b) {
            Dialog.init(b[1])
        }
    }
});

//指定环境上暴露接口
function init(context){
    context.mm = {
        download: function(id) {
            Event.trigger("server.check.start", "download", id);
        },
        detail: function(id) {
            Event.trigger("server.check.start", "detail", id);
        },
        /*
            使用MM打开指定url地址
            @param check {boolean} false:调起失败的时候，不跑MM下载流程
        */
        open: function(url, check) {
            check === undefined && (check = true);
            Event.trigger("server.check.start", "open", url, check);
        },
        /**
         * @param {Object} arg:数组或字符串；字符串用“/”分隔应用ID
         */
        batchDownload: function(arg) {
            var me = this;
            if (typeof arg == 'undefined' || arg == "") {
                return;
            }
            var ids = new Array();
            if (Util.s(arg)) {
                if (!/^[\d\/]*$/.test(arg)) {
                    return;
                }
                ids = arg.split("/");
            } else if (Util.a(arg)) {
                if (arg.length == 0) {
                    return;
                }
                ids = arg;
            }
            if (ids.length > 0) {
                var str = "";
                var count = 0;
                ids.forEach(function(item) {
                    if (item && /^(\d)*$/.test(item)) {
                        str === "" ? str = Util.encode(item) : str += "-" + Util.encode(item);
                        count++;
                    }
                });
                if (count > me.get("batchMaxApps")) {
                    Dialog.show({
                        type: "alert",
                        info: me.get("maxAlert")
                    })
                } else if (str != "") {
                    Event.trigger("server.check.start", "batchDownload", str)
                }
            }
        },
        set: function(key, value) {
            var def = Config, oldValue;
            if (key in def) {
                oldValue = def[key];
                if(ofType(oldValue).f){
                    def[key](value);
                }else{
                    def[key] = value;
                }
            }
            return this;
        },
        get: function(key) {
            var def = Config, value;
            if (key in def) {
                value = def[key];
                if(ofType(value).f && key === 'callOnlyVersion'){
                    return {
                        version_reg: Config.version_reg,
                        version_prefix: Config.version_prefix
                    }
                }
                return value;
            }
        },
        init: function(params) {
            if (typeof params == 'undefined' || !Util.o(params)) {
                return;
            }
            var def = Config;
            for (var prop in def) {
                if (prop in params) {
                    def[prop] = params[prop]
                }
            }
        },
        error: function(fn){
            if(ofType(fn).f){
                var cb = function(evt){
                    var args = slice.call(evt.args, 1);
                    var method = args && args[0] || '';
                    console.log(args);
                    fn.apply(this, arguments);
                };
                Event.on("server.over.error", cb);
            }
        }
    }
}

module.exports = {
    init: init
};