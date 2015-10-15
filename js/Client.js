/**
 * Created by linxiaojie on 2015/10/14.
 * �ͻ����ṩ�汾����
 */
var Event = require('./Event'),
    Params = require('./Params'),
    Util = require('./Util'),
    Dialog = require('./Dialog'),
    Config = require('./Config');
var slice = [].slice,
    versionUtil = {
        act: {
            b: 'batchdownload', //��������
            dl: 'download', //��Ӧ������
            d: 'detail' //����
        },
        ls: {
            "MM": {},
            "MMLITE": {}
        },
        init: function() {
            //MM��ʽ�汾���汾���ܣ�
            var me = this;
            me.ls["MM"][me.act.b] = 510;
            me.ls["MM"][me.act.dl] = 501;
            me.ls["MM"][me.act.d] = 500;

            //MMLite�汾���汾���ܣ�
            me.ls["MMLITE"][me.act.b] = 200;
            me.ls["MMLITE"][me.act.dl] = 200;
            me.ls["MMLITE"][me.act.d] = 200;
        },
        support: function(type) {
            var me = this,
                v = Util.getCookie(Params.version),
                vtype = Util.getCookie(Params.version_type),
                rs = false;
            if (!!type) {
                if (Util.s(v) && v.length > 0) {
                    v = parseInt(v, 10);
                    //debug.log(vtype)
                    var base = me.ls[vtype][type];
                    if (base && v >= base) { //���ڻ����ָ�����ܰ汾��֧��
                        rs = true;
                    }
                }
            }
            return rs;
        },
        /**
         * ����ָ���汾����ture,���򷵻�false;
         */
        checkVersion: function(b) {
            var me = this,
                v = Util.getCookie(Params.version),
                rs = false;
            if (Util.s(v) && v.length > 0) {
                v = parseInt(v, 10);
                if (v > b) {
                    rs = true;
                }
            }
            return rs;
        }
    },
    browserUtil = {
        ua: navigator.userAgent.toLowerCase(),
        isChrome: function() {
            var ua = this.ua;
            return ua.match(/360 aphone /i) ? false : (ua.match(/Chrome/i) == "chrome");
        },
//				ua: function() {
//					var a = navigator.userAgent;
//					return a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? "ios" : a.match(/Android/i) ? "android" : ""
//				},
        query: function(p) {
            var r = '';
            for (var k in p) r += encodeURIComponent(k) + '=' + encodeURIComponent(p[k]) + '&';
            return r;
        },
        isWechat: function() {
            return this.ua.match(/MicroMessenger/i) == "micromessenger" ? 1 : 0;
        },
        isQq: function() {
            return this.ua.match(/MQQBrowser/i) ? 1 : 0;
        },
        bs: function() {
            var appname = '',
                ua = this.ua;
            var browser = {
                whatchar: ua.match(/MicroMessenger/i) ? '΢��' : '',
                uc: ua.match(/(UCBrowser)|(UCWEB)/i) ? 'UC�����' : '',
                qq: ua.match(/MQQBrowser/i) ? 'QQ�����' : '',
                op: ua.match(/oupeng/i) ? 'ŷ�������' : '',
                ay: ua.match(/MxBrowser/i) ? '���������' : '',
                lb: ua.match(/LieBao/i) ? '�Ա������' : '',
                xm: ua.match(/MiuiBrowser/i) ? 'С�������' : '',
                bd: ua.match(/baidubrowser/i) ? '�ٶ������' : '',
                b360: ua.match(/360 aphone/i) ? '360�����' : '',
                sg: ua.match(/sogoumobilebrowser/i) ? '�ѹ������' : ''
            };
            for (var b in browser) {
                if (browser[b] != '') {
                    appname = browser[b];
                    break;
                }
            }
            return appname;
        },
        longFileNameAccept: function() {
            var result = false,
                ua = this.ua;
            var browser = {
                //			whatchar:ua.match(/MicroMessenger/i)?'΢��':'',
                //			uc:ua.match(/(UCBrowser)|(UCWEB)/i)?'UC�����':'',
                qq: ua.match(/MQQBrowser/i) ? 'QQ�����' : '',
                //			op:ua.match(/oupeng/i)?'ŷ�������':'',
                ay: ua.match(/MxBrowser/i) ? '���������' : '',
                lb: ua.match(/LieBao/i) ? '�Ա������' : '',
                //			xm:ua.match(/MiuiBrowser/i)?'С�������':'',
                bd: ua.match(/baidubrowser/i) ? '�ٶ������' : '',
                //			b360:ua.match(/360 aphone browser/i)?'360�����':'',
                //			sg:ua.match(/sogoumobilebrowser/i)?'�ѹ������':''
            };
            for (var b in browser) {
                if (browser[b] != '') {
                    result = true;
                    break;
                }
            }
            return result;
        },
        getCurrentBs: function() {
            var me = this,
                bsName = this.bs();
            return bsName != '' ? bsName : '�����';
        }
    },
    client = {
        reqUrl: {
            index: "mm://index",
            launch: "mm://launchbrowser?url=",
            appdetail: "mm://appdetail?requestid=app_info_forward&contentid=",
            downloadUri: "http://odp.mmarket.com/t.do?requestid=app_order&goodsid=999100008100930100001752138{contentid}&payMode=1",
            wetchartmm: "http://a.app.qq.com/o/simple.jsp?pkgname=com.aspire.mm",
            mmrelaapp: "http://zjw.mmarket.com/mmapk/{channelid}/mmarket-999100008100930100001752138{contentid}-180.apk",
            batchmmrelaapp: "http://zjw.mmarket.com/mmapk/{channelid}/mmarket-{contentid}-180.apk",
            MM_CONTENT_ID: "300000863435"
        },
        reqMethod: {
            queryapp: 'queryapp&appname=', //��ѯӦ���Ƿ�����
            querydownprogress: 'querydownprogress&contentid=', //��ѯӦ�����ؽ���
            download: 'download&url=', //����MM����
            jump: 'jump&url=', //��תָ��ҳ�� &appname=''
            batchdownload: 'batchdownload&contentids='
        },
        run: function(app, isOpen) {
            var me = this;
            if (isOpen && me.isChrome()) me.chrome(app);
            else me.iframe(app);
        },
        isChrome: function() {
            var ua = navigator.userAgent.toLowerCase();
            return ua.match(/360 aphone /i) ? false : (ua.match(/Chrome/i) == "chrome");
        },
        downloadApp: function(installUrl) {
            window.location.href = installUrl
        },
        chrome: function(url) {
            var b = url.split("://"),
                scheme = b[0],
                url = b[1],
                url1 = "intent://" + url + "#Intent;scheme=" + scheme + (scheme == "mm" ? ";package=" + Params.mmpkg : "") + ";end";
            window.location.href = url1;
        },
        iframe: function(url) {
            var e = document.createElement("iframe");
            e.style.display = "none";
            e.src = url;
            document.body.appendChild(e);
            setTimeout(function() {
                document.body.removeChild(e);
            }, 2000);
        },
        open: function(url, showtitle) {
            var me = this,
                v = versionUtil,
                b = browserUtil,
                showtitle = showtitle || Config.showtitle,
                reqUrl = me.reqUrl,
                reqMethod = me.reqMethod,
                mmap = reqUrl.launch + encodeURIComponent(url),
                baseUrl = Params.getBaseUrl();
            if (v.support(v.act.d)) {
                mmap = baseUrl + reqMethod.jump +
                    encodeURIComponent(url) + (showtitle ? ("&appname=" + b.getCurrentBs()) : '');
                me.iframe(mmap);
            } else {
                me.run(mmap, true);
            }
        },
        batchDownload: function(id) {
            //debug.log(id);
            this.download(id, versionUtil.act.b)
        },
        download: function(id, type) {
            var me = this,
                v = versionUtil,
                type = type || v.act.dl,
                reqUrl = me.reqUrl,
                reqMethod = me.reqMethod,
                mmap = reqUrl.appdetail + encodeURIComponent(id),
                baseUrl = Params.getBaseUrl();
            //debug.log("download "+type+" is support "+v.support(type))
            if (v.support(type)) {
                switch (type) {
                    case v.act.dl:
                        mmap = baseUrl + reqMethod.download +
                            encodeURIComponent(reqUrl.downloadUri.replace("{contentid}", id));
                        me.iframe(mmap);
                        //debug.log(mmap);
                        break;
                    case v.act.b:
                        mmap = baseUrl + reqMethod.batchdownload + id;
                        me.iframe(mmap);
                        //debug.log(mmap);
                        break;
                    default:
                        break;
                }
            } else {
                if (v.act.dl === type) {
                    me.run(mmap, true);
                } else if (v.act.b == type) {
                    var dl = function() {
                        //						debug.log("Dialog save -------------"+Date.now())
                        if (v.support(v.act.d)) {
                            var mmap = baseUrl + reqMethod.jump +
                                encodeURIComponent(reqUrl.appdetail + reqUrl.MM_CONTENT_ID) + (Config["showtitle"] ? ("&appname=" + browserUtil.getCurrentBs()) : '');
                            me.iframe(mmap);
                        } else {
                            var mmap = reqUrl.appdetail + encodeURIComponent(reqUrl.MM_CONTENT_ID);
                            me.run(mmap, true);
                        }
                    };
                    Dialog.one("dialog.after.show", function() {
                        Dialog.one("dialog.res.save", dl)
                    });
                    Dialog.show({
                        type: "alert",
                        info: Config["lowVersionAlert"]
                    })
                }
            }
        },
        detail: function(id, showtitle) {
            var me = this,
                v = versionUtil,
                b = browserUtil,
                reqUrl = me.reqUrl,
                showtitle = showtitle || Config.showtitle,
                reqMethod = me.reqMethod,
                mmap = reqUrl.appdetail + encodeURIComponent(id),
                baseUrl = Params.getBaseUrl();
            //debug.log(v.act.d)
            if (v.support(v.act.d)) {
                mmap = baseUrl + reqMethod.jump +
                    encodeURIComponent(reqUrl.appdetail + id) + (showtitle ? ("&appname=" + b.getCurrentBs()) : '');
                me.iframe(mmap);
            } else {
                me.run(mmap, true);
            }
        },
        error: function() {
            var me = this,
                canIntent = Config["onIntent"],
                reqUrl = me.reqUrl,
                b = browserUtil,
                timeout = b.ua.match(/(UCBrowser)|(UCWEB)/i)?3000:900;
            if (b.isWechat()) {
                var dl = function() {
                    me.downloadApp(reqUrl.wetchartmm);
                };
                Dialog.one("dialog.after.show", function() {
                    Dialog.one("dialog.res.save", dl)
                });
                Dialog.show({
                    type: "weixin"
                })
            } else if (!canIntent) {
                me.downloadmm.apply(me, arguments);
            } else {
                var t = Date.now(),
                    args = slice.call(arguments);
                me.iframe(reqUrl.index);
                var d = Date.now();
                setTimeout(function() {
                    var e = Date.now();
                    //					debug.log(e - t);
                    //ʱ���жϷ��������������Ч����UC������js������
                    if (!t || e - t < timeout + 200) {
                        args.unshift("downloadmm");
                    }
                    args.unshift("server.check.start");
                    Event.trigger.apply(Event,args);
                }, timeout)
            }
        },
        downloadmm: function(method) {
            var me = this,
                v = versionUtil,
                b = browserUtil,
                args = slice.call(arguments, 1),
                ids = args && args[0] || '',
                bs = b.bs(),
                longFileNameAccept = b.longFileNameAccept();
            if (!!method) {
                var type = (function() {
                    var t = "";
                    switch (method) {
                        case "download":
                            t = v.act.dl;
                            break;
                        case "batchDownload":
                            t = v.act.b;
                            break;
                        default:
                            t = v.act.d;
                            break;

                    }

                    return t;
                })();
                var url = me.getMMUrl(type);
                if (bs == '' || (!longFileNameAccept && type == v.act.b) || type == v.act.d) {
                    me.downloadApp(url.replace('{contentid}', ""))
                } else {
                    me.downloadApp(url.replace('{contentid}', ids))
                }

                if (type != v.act.d) {
                    var gargs = slice.call(arguments);
                    gargs.unshift("server.check.start");
                    var save = function() {
                        Event.trigger.apply(Event, gargs);
                    };
                    setTimeout(function() {
                        Dialog.one("dialog.after.show", function() {
                            Dialog.one("dialog.res.save", save)
                        });
                        Dialog.show({
                            type: "guid"
                        })
                    }, 1000)
                }
            }
        },
        getMMUrl: function(type) {
            var me = this,
                v = versionUtil,
                reqUrl = me.reqUrl;
            //��������Ӧ�� mm����·��
            if (typeof type != "undefined" && type == v.act.b) {
                return reqUrl.batchmmrelaapp.replace("{channelid}", Config["channelid"]);
            } else { //��Ӧ������ mm����·��
                return reqUrl.mmrelaapp.replace("{channelid}", Config["channelid"]);
            }
        }

    };

versionUtil.init();

module.exports = {
    execute: function(method) {
        var me = client;
        return me[method] && me[method].apply(me, slice.call(arguments, 1))
    }
};