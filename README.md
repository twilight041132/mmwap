# mmwap

wap调起jssdk

1. Wap环境调起MM，使用场景：
   1. 第三方浏览器调起MM应用来打开详情页、下载APP、批量下载APP
   2. 微信页调起MM应用来打开详情页、下载APP、批量下载APP
   
2. 基本流程
    MM客户端提供socket监听，页面通过jssdk调起客户端的时候，首先尝试socket去调起，
    如果socket请求被客户端接收，则判断客户端存活，调用客户端接口进行页面打开，
    应用下载等操作；如果socket不同，则页面通过scheme的方式打开客户端，判断是否打
    开成功，如果成功则继续调用客户端的流程；如果上述两种方式都不同，则去下载MM应用包。



##使用方法

1. 本地开发

    安装依赖<code>npm install</code>
    
    启动编译并预览<code> gulp preview </code>， 预览地址`http://localhost:3000/doc/index.html`
    
    打包<code>gulp zip</code>

2. 线上部署

    mmwap.js,mmwap.css 放置在同一目录层次
    
    导入js`<script src='mmwap.js'></script>`
    
3. [DEMO](http://mmdm.aspire-tech.com/fx/wap/wap6.1/c/doc/index.html)

## API

1. mm.set(key, value)：设置默认配置项，提供以下配置项

    * channelid： 渠道号，默认渠道号（5410093632），默认下载的MM渠道包。
    * onIntent： 配置是否允许schema调起，schema调起不能区分MM版本类型，能提高调起概率。默认打开，默认值为true
    * useGuide： 是否允许展示用户引导弹窗，默认允许，默认值为1； 配置0，可关闭引导，关闭引导之后程序直接做MM下载或跳转应用宝。
    * wetchartmm： 配置微信下载MM的应用宝地址。
    * downloadmm： 调起失败是否下载MM，默认下载，如不允许下载，配置为0。
    * callOnlyVersion： 配置检查的MM版本，~~如果检查失败会使用schema调起~~ 强制不使用schema调起，默认值（'MM|MMLite|MMOpen');
    * setVersionLimit: 配置检查的应用版本号，强制不使用schema调起

    eg:配置只调起MM版本，不使用无版本的schema调起

    `   mm.set('onIntent', false);
        mm.set('callOnlyVersion', 'MMOpen');`

2. mm.get(key)：获取当前配置项

    eg:获取当前配置的渠道号

    `   mm.get('channelid');  `

3. MM调起方法：

    * mm.download(id, check) : 调起MM下载指定id的应用；check为false,静默调起，不做MM下载；默认为true,调起失败，走MM下载流程。
    * mm.detail(id, check): 调起MM打开指定id的应用详情；check为false,静默调起，不做MM下载；默认为true,调起失败，走MM下载流程。
    * mm.batchdownlaod(ids, check)： 调起MM批量下载指定的ID应用, ids为数组或字符串，字符串用“/”分隔应用ID；check为false,静默调起，不做MM下载；默认为true,调起失败，走MM下载流程。。
    * mm.open(url, check): 调用MM打开指定URL地址，可配置是否调起失败时是否做MM下载流程。check为false,静默调起，不做MM下载；默认为true,调起失败，走MM下载流程。
    * mm.error(cb):　MM调起失败回调cb进行处理

4. MM调起方法的统一处理流程：

    <pre>1. 首次激活，使用版本相关的socket激活方法（可通过callOnlyVersion配置感兴趣的版本），判断MM是否激活（只有MM启动的时候才能激活成功）
        1.1 激活失败，按具体场景做二次激活处理
            1.1.1 微信： 弹窗引导用户跳转应用宝下载地址（可通过useGuide配置是否弹窗）
            1.1.2 非微信： 是否支持schema调起（通过onIntent配置）,schema是无版本状态的调起MM
                1.1.2.1 支持，schema调起，走二次激活流程（流程2）
                1.1.2.2 不支持，直接下载MM
        1.2 激活成功， 直接调起MM做相应功能处理和程序
    2. 二次激活（程序内部调起）
        2.1 激活失败， 下载MM
        2.2 激活成功， 直接调起MM做相应功能处理和程序
    </pre>
    

##注意

因为微信的调起拦截和不同浏览器环境兼容性不同意，此版本的WAP调起实际上并不能保证100%正确的处理回调结果。特别是以下几个流程需要注意：

1. 微信环境调起：MM杀死之后，是不能通过此js进行调起的，可通过配置应用宝链接进行跳转
2. 浏览器环境： MM杀死之后，默认是通过schema调起，schema调起是无状态化的，前端不能很精确的判断所有浏览器的调起情况，所以只能前端按照特定规则判断是否调起。这样就可能会出现已经调起MM，而前端页面依然提示调起失败的情况。

