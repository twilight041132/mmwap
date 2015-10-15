(function() {
	var slice = [].slice;

	//全局配置
	var Config = {
		batchMaxApps: "15",
		maxAlert: '\u6279\u91cf\u4e0b\u8f7d\u8d85\u8fc7\u6700\u5927\u4e0b\u8f7d\u6570\u0031\u0035\u4e2a,\u8bf7\u91cd\u65b0\u9009\u62e9',
		lowVersionAlert: '\u62b1\u6b49,\u60a8\u7684\u004d\u004d\u7248\u672c\u8fc7\u4f4e\u65e0\u6cd5\u652f\u6301\u8be5\u529f\u80fd,\u8bf7\u5347\u7ea7\u65b0\u7248\u5ba2\u6237\u7aef',
		showtitle: true,
		channelid: '5410093632',
		onIntent: true, //开启intent调用
		//	reCall:2000,//端口激活失败，通过intent调用，指定reCall时间重新激活接口
		//	lockTime:2000 //MM唤起加锁时间，避免短时间重复唤起
	};

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

	var Event = function() {
		var slice = [].slice,
			separator = /\s+/,

			returnFalse = function() {
				return false;
			},

			returnTrue = function() {
				return true;
			};

		function eachEvent(events, callback, iterator) {

			// 不支持对象，只支持多个event用空格隔开
			(events || '').split(separator).forEach(function(type) {
				iterator(type, callback);
			});
		};

		// 生成匹配namespace正则
		function matcherFor(ns) {
			return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
		};

		// 分离event name和event namespace
		function parse(name) {
			var parts = ('' + name).split('.');

			return {
				e: parts[0],
				ns: parts.slice(1).sort().join(' ')
			};
		};

		function findHandlers(arr, name, callback, context) {
				var matcher,
					obj;

				obj = parse(name);
				obj.ns && (matcher = matcherFor(obj.ns));
				return arr.filter(function(handler) {
					return handler &&
						(!obj.e || handler.e === obj.e) &&
						(!obj.ns || matcher.test(handler.ns)) &&
						(!callback || handler.cb === callback ||
							handler.cb._cb === callback) &&
						(!context || handler.ctx === context);
				});
			};
			/**
			 * Event类，结合gmu.event一起使用, 可以使任何对象具有事件行为。包含基本`preventDefault()`, `stopPropagation()`方法。
			 * 考虑到此事件没有Dom冒泡概念，所以没有`stopImmediatePropagation()`方法。而`stopProgapation()`的作用就是
			 * 让之后的handler都不执行。
			 *
			 * @class Event
			 * @constructor
			 * ```javascript
			 * var obj = {};
			 *
			 * $.extend( obj, gmu.event );
			 *
			 * var etv = gmu.Event( 'beforeshow' );
			 * obj.trigger( etv );
			 *
			 * if ( etv.isDefaultPrevented() ) {
			 *     console.log( 'before show has been prevented!' );
			 * }
			 * ```
			 * @grammar new gmu.Event( name[, props]) => instance
			 * @param {String} type 事件名字
			 * @param {Object} [props] 属性对象，将被复制进event对象。
			 */

		function Event(type, props) {
			if (!(this instanceof Event)) {
				return new Event(type, props);
			}

			props && $.extend(this, props);
			this.type = type;

			return this;
		}

		Event.prototype = {

			/**
			 * @method isDefaultPrevented
			 * @grammar e.isDefaultPrevented() => Boolean
			 * @desc 判断此事件是否被阻止
			 */
			isDefaultPrevented: returnFalse,

			/**
			 * @method isPropagationStopped
			 * @grammar e.isPropagationStopped() => Boolean
			 * @desc 判断此事件是否被停止蔓延
			 */
			isPropagationStopped: returnFalse,

			/**
			 * @method preventDefault
			 * @grammar e.preventDefault() => undefined
			 * @desc 阻止事件默认行为
			 */
			preventDefault: function() {
				this.isDefaultPrevented = returnTrue;
			},

			/**
			 * @method stopPropagation
			 * @grammar e.stopPropagation() => undefined
			 * @desc 阻止事件蔓延
			 */
			stopPropagation: function() {
				this.isPropagationStopped = returnTrue;
			}
		};
		return {

			/**
			 * 绑定事件。
			 * @method on
			 * @grammar on( name, fn[, context] ) => me
			 * @param  {String}   name     事件名
			 * @param  {Function} callback 事件处理器
			 * @param  {Object}   context  事件处理器的上下文。
			 * @return {me} 返回自身，方便链式
			 * @chainable
			 */
			on: function(name, callback, context) {
				var me = this,
					set;

				if (!callback) {
					return this;
				}

				set = this._events || (this._events = []);

				eachEvent(name, callback, function(name, callback) {
					var handler = parse(name);

					handler.cb = callback;
					handler.ctx = context;
					handler.ctx2 = context || me;
					handler.id = set.length;
					set.push(handler);
				});

				return this;
			},

			/**
			 * 绑定事件，且当handler执行完后，自动解除绑定。
			 * @method one
			 * @grammar one( name, fn[, context] ) => me
			 * @param  {String}   name     事件名
			 * @param  {Function} callback 事件处理器
			 * @param  {Object}   context  事件处理器的上下文。
			 * @return {me} 返回自身，方便链式
			 * @chainable
			 */
			one: function(name, callback, context) {
				var me = this;

				if (!callback) {
					return this;
				}

				eachEvent(name, callback, function(name, callback) {
					var once = function() {
						me.off(name, once);
						return callback.apply(context || me, arguments);
					};

					once._cb = callback;
					me.on(name, once, context);
				});

				return this;
			},

			/**
			 * 解除事件绑定
			 * @method off
			 * @grammar off( name[, fn[, context] ] ) => me
			 * @param  {String}   name     事件名
			 * @param  {Function} callback 事件处理器
			 * @param  {Object}   context  事件处理器的上下文。
			 * @return {me} 返回自身，方便链式
			 * @chainable
			 */
			off: function(name, callback, context) {
				var events = this._events;

				if (!events) {
					return this;
				}

				if (!name && !callback && !context) {
					this._events = [];
					return this;
				}

				eachEvent(name, callback, function(name, callback) {
					findHandlers(events, name, callback, context)
						.forEach(function(handler) {
							delete events[handler.id];
						});
				});

				return this;
			},

			/**
			 * 触发事件
			 * @method trigger
			 * @grammar trigger( name[, ...] ) => me
			 * @param  {String | Event }   evt     事件名或gmu.Event对象实例
			 * @param  {*} * 任意参数
			 * @return {me} 返回自身，方便链式
			 * @chainable
			 */
			trigger: function(evt) {
				var i = -1,
					args,
					events,
					stoped,
					len,
					ev;

				if (!this._events || !evt) {
					return this;
				}

				typeof evt === 'string' && (evt = new Event(evt));

				args = slice.call(arguments, 1);
				evt.args = args; // handler中可以直接通过e.args获取trigger数据
				args.unshift(evt);

				events = findHandlers(this._events, evt.type);

				if (events) {
					len = events.length;

					while (++i < len) {
						if ((stoped = evt.isPropagationStopped()) || false ===
							(ev = events[i]).cb.apply(ev.ctx2, args)
						) {

							// 如果return false则相当于stopPropagation()和preventDefault();
							stoped || (evt.stopPropagation(), evt.preventDefault());
							break;
						}
					}
				}

				return this;
			}
		}
	}();


	var Util = { //util
		e: Object.prototype.toString,
		f: function(a) {
			return "[object Function]" == this.e.call(a)
		},
		o: function(a) {
			return "[object Object]" == this.e.call(a)
		},
		a: function(a) {
			return "[object Array]" == this.e.call(a)
		},
		s: function(a) {
			return "string" == typeof a
		},
		each: function(list, act) {
			var me = this;
			if (me.f(act)) {
				if (me.o(list)) {
					for (var k in list) {
						act(k, list[k]);
					}
				} else if (list && list.length > 0) {
					for (var i = 0; i < list.length; i++) act(list[i], i);
				}
			}
		},
		CHATSET: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		encode: function(num) {
			var me = this,
				codeStr = "";
			if (!isNaN(num)) {
				var id = parseInt(num, 10),
					charSet = me.CHATSET,
					len = charSet.length;
				for (; id > 0; id = parseInt(id / len, 10)) {
					codeStr += charSet.charAt(parseInt(id % len, 10));
				}
			}
			return codeStr;
		},
		decode: function(encodeStr) {
			if (typeof encodeStr == 'undefined' || encodeStr.length == 0) {
				return 0;
			}
			var charSet = this.CHATSET,
				len = charSet.length,
				originalnumber = 0;
			for (var i = 0; i < encodeStr.length; i++) {
				var c = encodeStr.charAt(i),
					number = charSet.indexOf(c);
				originalnumber += (number * Math.pow(len, i));
			}
			return originalnumber;
		},
		setCookie: function(name, value, days) {
			var c = name + "=" + escape(value) + ";path=/";
			if (days != null) {
				var exp = new Date();
				exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
				c += ";expires=" + exp.toGMTString();
			}
			document.cookie = c;
		},
		getCookie: function(name) {
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null) return unescape(arr[2]);
			return null;
		}
	};


	/*
	 * 功能操作相关参数
	 */
	var Params = (function(util) {
		var url = "http://{adress}:{port}/moversion",
			baseUrl = "http://{adress}:{port}/action=",
			domain = "wx.mm-img.com",
			remoteIp = "127.0.0.1";
		if (!!navigator.userAgent.toLowerCase().match(/MicroMessenger|MQQBrowser/i)) {
			url = url.replace("{adress}", domain);
			baseUrl = baseUrl.replace("{adress}", domain);
		} else {
			url = url.replace("{adress}", remoteIp);
			baseUrl = baseUrl.replace("{adress}", remoteIp);
		}


		return {
			versionUrl: url, //mm激活地址
			baseUrl: baseUrl, //mm功能操作地址
			DAEMON: "mmcd",
			mmpkg: "com.aspire.mm",
			version: "mmversion",
			version_type: "mmversiontype",
			port: "mmport",
			getBaseUrl: function() {
				var me = this,
					port = util.getCookie(me.port);
				return baseUrl.replace("{port}", port);
			}
		}
	})(Util);

	/*
	 * 检测客户端服务
	 *
	 */
	var ServerManager = function(event, params, util) {
		var isCheck = false,
			port = '',
			mmPort = [9817, 19817, 29817, 39817, 49817, 59817],
			versionUrl = params.versionUrl,
			errCount = 0,
			version_reg = /^(MMLite|MM)[0-9]+(\.[0-9]*|$)?(\.[0-9]*|$)?/i,
			slice = [].slice;

		function beforeCheck() {
			removeAll();
			isCheck = true;
			port = '';
			errCount = 0;
			util.setCookie(params.port, null);
			util.setCookie(params.version, null);
			util.setCookie(params.version_type, null);
		};

		function afterCheck(evt) {
			var args = evt.args.slice(1),
				e = function() {
					check_args.unshift("server.check.error");
					event.trigger.apply(event, check_args);
				};
			removeAll();
			if ("success" === args[0]) {
				util.setCookie(params.port, args[1]);
				if (typeof window.a != 'undefined' && typeof window.a.appname != 'undefined') {
					setVersion(window.a);
					delete window.a;
					check_args.unshift("server.check.success");
					event.trigger.apply(event, check_args);
				} else {
					e();
				}
			} else {
				e();
			}
			isCheck = false;
			port = '';
			errCount = 0;
		};

		function setVersion(a) {
			//		if(util.o(a)){
			var appname = a.appname;
			if (appname && appname.length > 0) {
				var v = appname.match(version_reg);
				if (!!v) {
					//版本标志：lite or normal
					var vtype = v[1] || 'MM';
					util.setCookie(params.version_type, vtype.toUpperCase());

					v = v[0].replace(/(MMLite|MM)/i, '');
					if (v.length > 0) {
						var vs = v.replace(/\./g, '');
						util.setCookie(params.version, vs || 0);
						//debug.log(vtype.toUpperCase()+"  "+vs)
					}
				}
			}
			//		}
		}
		event.on("server.before.check", beforeCheck.bind(this));
		event.on("server.after.check", afterCheck.bind(this));

		var check_args = [];

		function check(evt) {
			check_args = slice.call(evt.args, 1);
			if (isCheck) return;
			event.trigger("server.before.check");
			mmPort.forEach(function(p) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.setAttribute("port", p);
				script.setAttribute("class", "__js_load_mm");
				script.onload = script.onerror = load;
				script.src = versionUrl.replace("{port}", p) + "?" + Date.now();
				document.getElementsByTagName("head")[0].appendChild(script)
			})
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

		function load(e) {
			if (port !== '') return;
			if (e.type == 'load') {
				var target = e.target;
				port = target.getAttribute("port");
				//debug.log("load success :"+port);
				event.trigger("server.after.check", "success", port);
			} else {
				errCount++;
				if (errCount == mmPort.length) {
					event.trigger("server.after.check", "error");
				}
			}
		};

		event.on("server.check.start", check.bind(this))

	}(Event, Params, Util);


	/*
	 *提示引导组件
	 *
	 */

	var Dialog = (function(event, util) {
		var a = {
			cssloaded: 0,
			el: {},
			options: {
				type: "alert", //"alert|confirm|guid|weixin|"
				info: "",
				base: "",
				css: "mmapp.css"
			},
			movePrevent: function(e) {
				this.preventDefault(e);
				this.stopPropagation(e);
			},
			set: function(opts) {
				var me = this;
				for (var i in me.options) {
					typeof opts[i] != "undefined" && (me.options[i] = opts[i])
				}
			},
			view: function() {
				var me = this,
					res = "";
				if (me.options.type === "guid") {
					res = "<div class=\"__mm-wap-hint\"><div class=\"__mm-wap-hint-msg\">" + "\u5b89\u88c5\u5e76\u542f\u52a8\u004d\u004d\u5546\u573a\u540e\u5c06\u81ea\u52a8\u5f00\u59cb\u9ad8\u901f\u4e0b\u8f7d\uff0c\u5982\u6ca1\u5f00\u59cb\u9ad8\u901f\u4e0b\u8f7d\uff0c" + "<span class=\"__mm-wap-hint-link\" id=\"__mm-wap-success\">" + "\u8bf7\u70b9\u8fd9\u91cc" + "</span></div><div class=\"__mm-wap-hint-close\" id=\"__mm-wap-close\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC\" /></div></div>";
				} else if (me.options.type === "weixin") {
					res = "<div class=\"__mm-wap-dialog-mask\"></div><div class=\"__mm-wap-dialog\" id=\"__mm-wap-dialog\"><div class=\"__mm-wap-dialog-close \" id=\"__mm-wap-close\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC\" /></div><div class=\"__mm-wap-hd\">" + "\u9ad8\u901f\u4e0b\u8f7d\u6307\u5f15" + "</div><div class=\"__mm-wap-bd\"><p class=\"__mm-wap-guid-tit\">" + "\u8bf7\u6309\u4ee5\u4e0b\u6b65\u9aa4\u64cd\u4f5c\u5b8c\u6210\u9ad8\u901f\u4e0b\u8f7d\uff1a" + "</p><div class=\"__mm-wap-guid-step\"><p>\u7b2c<span class=\"__mm-wap-guid-step-num\">1</span>\u6b65 </p><p>" + "\u4e0b\u8f7d\u5b89\u88c5\u004d\u004d\u5546\u573a\u540e" + "<span class=\"__mm-wap-guid-step-hint\">" + "\u542f\u52a8\u4e00\u6b21</span>\u6216" + "<span class=\"__mm-wap-guid-step-hint\">" + "\u6253\u5f00\u4e00\u6b21" + "</span></p></div><div class=\"__mm-wap-guid-step\"><p>\u7b2c<span class=\"__mm-wap-guid-step-num\">2</span>\u6b65</p><p>" + "\u56de\u5230\u5fae\u4fe1\u518d\u6b21\u70b9\u51fb\u201c\u9ad8\u901f\u4e0b\u8f7d\u201d\u3002" + "</p></div></div><div class=\"__mm-wap-ft\"><div class=\"__mm-wap-btn  \" id=\"__mm-wap-success\">" + "\u524d\u5f80\u4e0b\u8f7d\u004d\u004d\u5546\u573a" + "</div></div></div>";
				} else {
					res = "<div class=\"__mm-wap-dialog-mask\"></div><div class=\"__mm-wap-dialog\" id=\"__mm-wap-dialog\"><div class=\"__mm-wap-dialog-close \" id=\"__mm-wap-close\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwMUY5NTEyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwMUY5NTIyQUJCMTFFNTg0MTQ5NzUyMzMyNDY2QjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjAxRjk0RjJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjAxRjk1MDJBQkIxMUU1ODQxNDk3NTIzMzI0NjZCMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpWGpx8AAAEwSURBVHjavJU9DoJAEEZh9Aja0FtZWHACDdaWFl7AwrvY6Q0sNF7AmHgDEwtbDyDUVib6bcImhPAz+zNs8goC4b0lMIRxHAdYa3AGadDhIrABe3ADww6cA3ABYyU/gqc66CBAia9gDrZK/gazDgK0eAIeYEX5CRUwFQwoi9XOUypckAoFVIr1CxcIBtSKq+Q+AxrFdXIfAa3iJrlLAEvcJrcJYIs5cpMAIzFXzgkoixPOf4IMXqK6gCpxxrlh3/Dz0QG3QsDXRmwjrwoIbMSmj724fvmOi5sIbf7nrpPLehKSozhxmYTkKM5cRjE5ip1GMXkQWweQJ7FVAHkUGweQZ7FRAAmI2QEkJGYFkKC4NYCExY0BWn4QFNcFLHtRFKkTdzACCyGxXh9wAi+w+wswAP5lpcbsuZqsAAAAAElFTkSuQmCC\" /></div><div class=\"__mm-wap-bd\"><div class=\"__mm-wap-bd-info\"><p>" + me.options.info + "</p></div></div><div class=\"__mm-wap-ft\"><div class=\"__mm-wap-btn  \" id=\"__mm-wap-success\">\u786e\u5b9a</div></div></div>";

				}

				return res;
			},
			onload: function(node, callback) {
				var me = this;
				if (node.attachEvent) {
					node.attachEvent('onload', callback);
				} else {
					setTimeout(function() {
						me.poll(node, callback);
					}, 0);
				}
			},
			poll: function(node, callback) {
				var me = this;
				if (callback.isCalled) {
					return;
				}
				//		  debug.log("loadcss---"+node['sheet']);
				if (/webkit/i.test(navigator.userAgent)) { //webkit
					if (node['sheet']) {
						me.cssloaded = !0;
					}
				} else if (node['sheet']) {
					try {
						if (node['sheet'].cssRules) {
							me.cssloaded = !0;
						}
					} catch (ex) {
						if (ex.code === 1000) {
							me.cssloaded = !0;
						}
					}
				}

				if (me.cssloaded) {
					setTimeout(function() {
						callback();
						callback.isCalled = !0;
					}, 1);
				} else {
					setTimeout(function() {
						me.poll(node, callback);
					}, 1);
				}
			},
			loadcss: function(href, fn) {
				var me = this;
				var node = document.createElement("link");
				node.setAttribute("rel", "stylesheet");
				node.setAttribute("type", "text/css");
				node.setAttribute("href", href);
				document.body.appendChild(node);
				me.onload(node, fn);
			},
			show: function(opts) {
				var me = this;
				me.destory();
				me.set(opts);
				me.loaded(me.create.bind(me));
			},
			create: function() {
				var me = this,
					html = me.view(),
					d = document.createElement("div");
				d.setAttribute("id", "__mm-wap-toast");
				d.style.display = "none";
				d.innerHTML = html;

				me.trigger("dialog.before.show");

				document.body.appendChild(d);
				me.el['__mm-wap-toast'] = [d];
				me.refresh();
				me.addHandle();
				me.trigger("dialog.after.show");
			},
			refresh: function() {
				var me = this;
				var d = (me.el['__mm-wap-toast'] || (me.el['__mm-wap-toast'] = [me.query("__mm-wap-toast")]))[0];
				if (d != null) {
					d.style.display = "block";
					var sTop = document.body.scrollTop || document.documentElement.scrollTop;
					if (me.options.type != "guid") {
						d.style.height = Math.max(document.body.scrollHeight, document.body.clientHeight) - 1 + "px";
						d.setAttribute("class", "__mm-wap-toast-cover");
					}
					var sH = document.body.offsetHeight || document.documentElement.offsetHeight;
					var alt = me.query("__mm-wap-dialog");
					alt && (alt.style.top = parseInt(sTop + (window.innerHeight - alt.offsetHeight) / 2, 10) + "px", 1);
				}
			},
			addHandle: function() {
				var me = this,
				t = me.el['__mm-wap-toast'] || (me.el['__mm-wap-toast'] = me.query("__mm-wap-toast"));
				t.push("touchmove");
				t.push(me.movePrevent.bind(me));
				//遮罩不能滑动
				me.addEvent.apply(me, t);
				//window resize 调整弹窗布局
				me.resize = function(e) {
					me.refresh()
				};
				me.addEvent(window, "resize", me.resize);
				me.addEvent(window, "scroll", me.resize);
				//关闭 确定 事件
				var success = me.el['__mm-wap-success'] || (me.el['__mm-wap-success'] = [me.query("__mm-wap-success")]);
				var close = me.el['__mm-wap-close'] || (me.el['__mm-wap-close'] = [me.query("__mm-wap-close")]);
				if (success != null && success.length > 0) {
					success.push("click");
					success.push(function(e) {
						me.preventDefault(e);
						me.stopPropagation(e);
						me.trigger("dialog.res.save");
						me.destory();
						return false;
					});
					me.addEvent.apply(me, success);
				}
				if (close != null && close.length > 0) {
					close.push("click");
					close.push(function(e) {
						me.preventDefault(e);
						me.stopPropagation(e);
						this.className += " active";
						me.trigger("dialog.res.cancle");
						me.destory();
						return false;
					});
					me.addEvent.apply(me, close);
				}
			},
			loaded: function(fn) {
				var me = this,
					opts = me.options;
				if (!me.cssloaded) {
					var href = opts.base + opts.css;
					me.loadcss(href, fn)
				} else {
					util.f(fn) && fn();
				}
			},
			query: function(id) {
				return document.querySelector ? document.querySelector("#" + id) : document.getElementById(id);
			},
			destroy: function() {
				var me = this;
				for (var i in me.el) {
					var e = me.el[i];
					if (!!e) {
						if (!!e[0]) continue;
						if (i === "__mm-wap-toast") e[0].style.display = "none";
						me.removeEvent.apply(me, e);
					}
				}
				me.removeEvent(window, "resize", me.resize);
				me.removeEvent(window, "scroll", me.resize);
				if (typeof me.el["__mm-wap-toast"] != 'undefined') {
					var n = me.el["__mm-wap-toast"][0];
					if (n && n.parentNode) {
						n.parentNode.removeChild(n);
					}
				}
				me.el = {};
				me.off("dialog.res");
			},
			init: function(base) {
				this.options.base = base;
			},
			addEvent: function(el, type, handle) {
				if (el.addEventListener) {
					el.addEventListener(type, handle, false);
				} else if (el.attachEvent) {
					el.attachEvent("on" + type, handle);
				} else {
					el["on" + type] = handle;
				}
			},
			removeEvent: function(el, type, handle) {
				if (el.addEventListener) {
					el.removeEventListener(type, handle, false);
				} else if (el.attachEvent) {
					el.detachEvent("on" + type, handle);
				} else {
					el["on" + type] = null;
				}

			},
			getEvent: function(event) {
				return event ? event : window.event;
			},
			getTarget: function(event) {
				return event.target || event.srcElement;
			},
			stopPropagation: function(event) {
				if (event.stopPropagation) {
					event.stopPropagation();
				} else {
					event.cancelBubble = true;
				}
			},
			preventDefault: function(event) {
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}
			},
			on: function() {
				event.on.apply(event, arguments)
			},
			off: function() {
				event.off.apply(event, arguments)
			},
			trigger: function() {
				event.trigger.apply(event, arguments)
			},
			one: function() {
				event.one.apply(event, arguments)
			}

			//		getRelatedTarget:function(event){
			//			if(event.relatedTarget){
			//				return event.relatedTarget
			//			}else if(event.fromElement){
			//				return event.fromElement
			//			}else if(event.toElement){
			//				return event.toElement
			//			}else{
			//				return null
			//			}
			//		},
			//		getCharCode:function(event){
			//			if(event.charCode){
			//				return event.charCode;
			//			}else if(event.keyCode){
			//				return event.keyCode;
			//			}
			//		}
		}

		return a;
	})(Event, Util);
	/*
	 *
	 * 客户端提供版本功能
	 *
	 */
	var Client = (function(params, util, config, event, dialog) {
		var slice = [].slice,
			versionUtil = {
				act: {
					b: 'batchdownload', //批量下载
					dl: 'download', //单应用下载
					d: 'detail' //详情
				},
				ls: {
					"MM": {},
					"MMLITE": {}
				},
				init: function() {
					//MM正式版本，版本功能：
					var me = this;
					me.ls["MM"][me.act.b] = 510;
					me.ls["MM"][me.act.dl] = 501;
					me.ls["MM"][me.act.d] = 500;

					//MMLite版本，版本功能：
					me.ls["MMLITE"][me.act.b] = 200;
					me.ls["MMLITE"][me.act.dl] = 200;
					me.ls["MMLITE"][me.act.d] = 200;
				},
				support: function(type) {
					var me = this,
						v = util.getCookie(params.version),
						vtype = util.getCookie(params.version_type),
						rs = false;
					if (!!type) {
						if (util.s(v) && v.length > 0) {
							v = parseInt(v, 10);
							//debug.log(vtype)
							var base = me.ls[vtype][type];
							if (base && v >= base) { //高于或等于指定功能版本则支持
								rs = true;
							}
						}
					}
					return rs;
				},
				/**
				 * 高于指定版本返回ture,否则返回false;
				 */
				checkVersion: function(b) {
					var me = this,
						v = util.getCookie(params.version),
						rs = false;
					if (util.s(v) && v.length > 0) {
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
						whatchar: ua.match(/MicroMessenger/i) ? '微信' : '',
						uc: ua.match(/(UCBrowser)|(UCWEB)/i) ? 'UC浏览器' : '',
						qq: ua.match(/MQQBrowser/i) ? 'QQ浏览器' : '',
						op: ua.match(/oupeng/i) ? '欧朋浏览器' : '',
						ay: ua.match(/MxBrowser/i) ? '遨游浏览器' : '',
						lb: ua.match(/LieBao/i) ? '猎豹浏览器' : '',
						xm: ua.match(/MiuiBrowser/i) ? '小米浏览器' : '',
						bd: ua.match(/baidubrowser/i) ? '百度浏览器' : '',
						b360: ua.match(/360 aphone/i) ? '360浏览器' : '',
						sg: ua.match(/sogoumobilebrowser/i) ? '搜狗浏览器' : ''
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
						//			whatchar:ua.match(/MicroMessenger/i)?'微信':'',
						//			uc:ua.match(/(UCBrowser)|(UCWEB)/i)?'UC浏览器':'',
						qq: ua.match(/MQQBrowser/i) ? 'QQ浏览器' : '',
						//			op:ua.match(/oupeng/i)?'欧朋浏览器':'',
						ay: ua.match(/MxBrowser/i) ? '遨游浏览器' : '',
						lb: ua.match(/LieBao/i) ? '猎豹浏览器' : '',
						//			xm:ua.match(/MiuiBrowser/i)?'小米浏览器':'',
						bd: ua.match(/baidubrowser/i) ? '百度浏览器' : '',
						//			b360:ua.match(/360 aphone browser/i)?'360浏览器':'',
						//			sg:ua.match(/sogoumobilebrowser/i)?'搜狗浏览器':''
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
					return bsName != '' ? bsName : '浏览器';
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
					queryapp: 'queryapp&appname=', //查询应用是否下载
					querydownprogress: 'querydownprogress&contentid=', //查询应用下载进度
					download: 'download&url=', //调起MM下载
					jump: 'jump&url=', //跳转指定页面 &appname=''
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
						url1 = "intent://" + url + "#Intent;scheme=" + scheme + (scheme == "mm" ? ";package=" + params.mmpkg : "") + ";end";
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
						showtitle = showtitle || config.showtitle,
						reqUrl = me.reqUrl,
						reqMethod = me.reqMethod,
						mmap = reqUrl.launch + encodeURIComponent(url),
						baseUrl = params.getBaseUrl();
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
						baseUrl = params.getBaseUrl();
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
								//						debug.log("dialog save -------------"+Date.now())
								if (v.support(v.act.d)) {
									var mmap = baseUrl + reqMethod.jump +
										encodeURIComponent(reqUrl.appdetail + reqUrl.MM_CONTENT_ID) + (config["showtitle"] ? ("&appname=" + browserUtil.getCurrentBs()) : '');
									me.iframe(mmap);
								} else {
									var mmap = reqUrl.appdetail + encodeURIComponent(reqUrl.MM_CONTENT_ID);
									me.run(mmap, true);
								}
							};
							dialog.one("dialog.after.show", function() {
								dialog.one("dialog.res.save", dl)
							});
							dialog.show({
								type: "alert",
								info: config["lowVersionAlert"]
							})
						}
					}
				},
				detail: function(id, showtitle) {
					var me = this,
						v = versionUtil,
						b = browserUtil,
						reqUrl = me.reqUrl,
						showtitle = showtitle || config.showtitle,
						reqMethod = me.reqMethod,
						mmap = reqUrl.appdetail + encodeURIComponent(id),
						baseUrl = params.getBaseUrl();
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
						canIntent = config["onIntent"],
						reqUrl = me.reqUrl,
						b = browserUtil,
						timeout = b.ua.match(/(UCBrowser)|(UCWEB)/i)?3000:900;
					if (b.isWechat()) {
						var dl = function() {
							me.downloadApp(reqUrl.wetchartmm);
						};
						dialog.one("dialog.after.show", function() {
							dialog.one("dialog.res.save", dl)
						});
						dialog.show({
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
							//时间判断方法个别浏览器无效，如UC，基本js不挂起
							if (!t || e - t < timeout + 200) {
								args.unshift("downloadmm");
							}
							args.unshift("server.check.start");
							event.trigger.apply(event,args);
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
								event.trigger.apply(event, gargs);
							};
							setTimeout(function() {
								dialog.one("dialog.after.show", function() {
									dialog.one("dialog.res.save", save)
								});
								dialog.show({
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
					//批量下载应用 mm下载路径
					if (typeof type != "undefined" && type == v.act.b) {
						return reqUrl.batchmmrelaapp.replace("{channelid}", config["channelid"]);
					} else { //单应用下载 mm下载路径
						return reqUrl.mmrelaapp.replace("{channelid}", config["channelid"]);
					}
				}

			};

		versionUtil.init();

		return {
			execute: function(method) {
				var me = client;
				return me[method] && me[method].apply(me, slice.call(arguments, 1))
			}
		}
	})(Params, Util, Config, Event, Dialog);

	/*
	 *
	 * 注册功能列表
	 *
	 */
	Event.on("server.check.success", function(evt) {
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
		if (method === 'open') {
			return;
		}else if(method !== "downloadmm"){//二次激活失败时，直接下载mm,不走error流程
			args.unshift("error");
		}
		Client.execute.apply(Client, args);
	});

	/*
	 *
	 * 暴露给全局环境
	 *
	 */

	(function(util, event, config, dialog) {
		util.each(document.querySelectorAll("script"), function(a) {
			var s = a.src;
			if (!!s) {
				var b = s.match(/^(.*)mmapp.js/);
				if (b) {
					dialog.init(b[1])
				}
			}
		});
		window.mm = {
			download: function(id) {
				event.trigger("server.check.start", "download", id)
			},
			detail: function(id) {
				event.trigger("server.check.start", "detail", id)
			},
			open: function(url) {
				event.trigger("server.check.start", "open", url)
			},
			/**
			 * @param {Object} arg:数组或字符串；字符串用“/”分隔应用ID
			 */
			batchDownload: function(arg) {
				var me = this,
					def = me.defaults;
				if (typeof arg == 'undefined' || arg == "") {
					return;
				}
				var ids = new Array();
				if (util.s(arg)) {
					if (!/^[\d\/]*$/.test(arg)) {
						return;
					}
					ids = arg.split("/");
				} else if (util.a(arg)) {
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
							str === "" ? str = util.encode(item) : str += "-" + util.encode(item);
							count++;
						}
					});
					if (count > me.get("batchMaxApps")) {
						dialog.show({
							type: "alert",
							info: me.get("maxAlert")
						})
					} else if (str != "") {
						event.trigger("server.check.start", "batchDownload", str)
					}
				}
			},
			set: function(key, value) {
				var def = config;
				if (key in def) {
					def[key] = value;
				}
			},
			get: function(key) {
				var def = config;
				if (key in def) {
					return def[key];
				}
			},
			init: function(params) {
				if (typeof params == 'undefined' || !util.o(params)) {
					return;
				}
				var def = config;
				for (var prop in def) {
					if (prop in params) {
						def[prop] = params[prop]
					}
				}
			}
		}

	})(Util, Event, Config, Dialog)
})();