/**
 * Created by linxiaojie on 2015/10/14.
 */
var Event = require('./Event'),
    Util = require('./Util'),
    Client = require('./Client'),
    ServerManager = require('./ServerManager'),
    Dialog = require('./Dialog'),
    Config = require('./Config'),
    slice = [].slice;

//���ܼ��
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

/*
    ע��У�����
 */
ServerManager.init();


/*
 *
 * ע�Ṧ���б�
 *
 */
Event.on("server.check.success", function(evt) {
    var args = evt.args.slice(1);
    var method = args&&args[0]||'';
    if(method == "downloadmm"){//���μ���ɹ�ʱ
        args.shift()
    }
    Client.execute.apply(Client, args);
});
Event.on("server.check.error", function(evt) {
    var args = slice.call(evt.args, 1);
    var method = args && args[0] || '';
    if (method === 'open') {
        return;
    }else if(method !== "downloadmm"){//���μ���ʧ��ʱ��ֱ������mm,����error����
        args.unshift("error");
    }
    Client.execute.apply(Client, args);
});


/*
 *
 * Dialog��ʼ��
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

//ָ�������ϱ�¶�ӿ�
function init(context){
    context.mm = {
        download: function(id) {
            Event.trigger("server.check.start", "download", id)
        },
        detail: function(id) {
            Event.trigger("server.check.start", "detail", id)
        },
        open: function(url) {
            Event.trigger("server.check.start", "open", url)
        },
        /**
         * @param {Object} arg:������ַ������ַ����á�/���ָ�Ӧ��ID
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
            var def = Config;
            if (key in def) {
                def[key] = value;
            }
        },
        get: function(key) {
            var def = Config;
            if (key in def) {
                return def[key];
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
        }
    }
}

module.exports = {
    init: init
};