/**
 * Created by linxiaojie on 2015/10/14.
 */

function newVersionReg(vStr){
    return {
        version_reg: new RegExp('^(' + vStr + ')[0-9]+(\\.[0-9]*|$)?(\\.[0-9]*|$)?', 'i'),
        version_prefix: new RegExp('^(' + vStr + ')', 'i')
    }
}

var versionRegStr  = 'MMLite|MMOpen|MM';
var initVersionReg = newVersionReg(versionRegStr);

//全局配置
module.exports = {
    batchMaxApps: "15",
    maxAlert: '\u6279\u91cf\u4e0b\u8f7d\u8d85\u8fc7\u6700\u5927\u4e0b\u8f7d\u6570\u0031\u0035\u4e2a,\u8bf7\u91cd\u65b0\u9009\u62e9',
    lowVersionAlert: '\u62b1\u6b49,\u60a8\u7684\u004d\u004d\u7248\u672c\u8fc7\u4f4e\u65e0\u6cd5\u652f\u6301\u8be5\u529f\u80fd,\u8bf7\u5347\u7ea7\u65b0\u7248\u5ba2\u6237\u7aef',
    showtitle: true,
    channelid: '5410093632',
    onIntent: true, //开启intent调用
    //	reCall:2000,//端口激活失败，通过intent调用，指定reCall时间重新激活接口
    //	lockTime:2000 //MM唤起加锁时间，避免短时间重复唤起
    useGuide: 1, //是否加引导
    wetchartmm: "http://a.app.qq.com/o/simple.jsp?pkgname=com.aspire.mm",//应用宝MM下载地址
    /*指定版本类型调用,禁止使用无版本的scheme调用，只通过socket调用，此方式MM进程不在时无法调起*/
    callOnlyVersion: function(vStr){/*'MMLite|MM|MMOpen'*/
        var me = this;
        me.onIntent = false;
        var attr = vStr.split('|'), i = 0, l = attr.length;
        attr.sort(function(a, b){
            return b.length - a.length;
        });
        vStr = attr.length > 0 ?  attr.join('|') : attr[0];
        var v = newVersionReg(vStr);
        me.version_reg = v.version_reg;
        me.version_prefix = v.version_prefix;
    },
    version_reg: initVersionReg.version_reg,
    version_prefix: initVersionReg.version_prefix,
    downloadmm: 1
};