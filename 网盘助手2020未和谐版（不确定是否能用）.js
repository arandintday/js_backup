// ==UserScript==
// @name         网盘助手
// @namespace    http://pan.newday.me/
// @version      0.2.6
// @icon         http://pan.newday.me/pan/favicon.ico
// @author       哩呵
// @description  大概是最优雅好用的网盘助手了；支持百度网盘、腾讯微云、蓝奏云、微博微盘、城通网盘、皮皮盘和YunFile。
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://share.weiyun.com/*
// @match        *://*.lanzous.com/*
// @match        *://vdisk.weibo.com/*
// @match        *://*.ctfile.com/*
// @match        *://*.pipipan.com/*
// @match        *://*.dfpan.com/*
// @match        *://*.newday.me/*
// @connect      ctfile.com
// @connect      pipipan.com
// @connect      newday.me
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// @require      https://cdn.staticfile.org/vue/2.6.6/vue.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    var injectInfo = {
        enable: false
    };

    var container = (function () {
        var obj = {
            module_defines: {},
            module_objects: {}
        };

        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj.module_defines[name] = {
                requires: requires,
                callback: callback
            };
        };

        obj.require = function (name, cache) {
            if (typeof cache == "undefined") {
                cache = true;
            }

            name = obj.processName(name);
            if (cache && obj.module_objects.hasOwnProperty(name)) {
                return obj.module_objects[name];
            }
            else if (obj.module_defines.hasOwnProperty(name)) {
                var requires = obj.module_defines[name].requires;
                var callback = obj.module_defines[name].callback;

                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };

        obj.use = function (requires, callback) {
            var module = {
                exports: {}
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            }
            else {
                return module.exports;
            }
        };

        obj.register = function (name, module) {
            name = obj.processName(name);
            obj.module_objects[name] = module;
        };

        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };

        obj.processName = function (name) {
            return name.toLowerCase();
        };

        return {
            define: obj.define,
            use: obj.use,
            register: obj.register,
            modules: obj.module_objects
        };
    })();

    container.define("runtime", [], function () {
        var obj = {
            url: location.href,
            referer: document.referrer,
        };

        obj.getUrl = function () {
            return obj.url;
        };

        obj.setUrl = function (url) {
            obj.url = url;
        };

        obj.getReferer = function () {
            return obj.referer;
        };

        obj.setReferer = function (referer) {
            obj.referer = referer;
        };

        obj.getUrlParam = function (name) {
            var param = obj.parseUrlParam(obj.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };

        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };

        return obj;
    });

    container.define("object", [], function () {
        var obj = {};

        obj.keys = function (data) {
            var list = [];
            for (var key in data) {
                list.push(key);
            }
            return list;
        };

        obj.values = function (data) {
            var list = [];
            for (var key in data) {
                list.push(data[key]);
            }
            return list;
        };

        return obj;
    });

    container.define("storage", [], function () {
        var obj = {};

        obj.getValue = function (name, defaultValue) {
            name = obj.processName(name);
            return GM_getValue(name, defaultValue);
        };

        obj.setValue = function (name, value) {
            name = obj.processName(name);
            GM_setValue(name, value);
        };

        obj.getValueList = function () {
            var nameList = GM_listValues();
            var valueList = {};
            nameList.forEach(function (name) {
                if (injectInfo.enable) {
                    if (name.indexOf(injectInfo.name + "_") >= 0) {
                        name = name.replace(injectInfo.name + "_", "");
                        valueList[name] = obj.getValue(name);
                    }
                }
                else {
                    valueList[name] = obj.getValue(name);
                }
            });
            return valueList;
        };

        obj.processName = function (name) {
            if (injectInfo.enable) {
                return injectInfo.name + "_" + name;
            }
            else {
                return name;
            }
        };

        return obj;
    });

    container.define("config", ["storage"], function (storage) {
        var obj = {};

        obj.getConfig = function (name) {
            var configJson = storage.getValue("configJson");
            var configObject = obj.parseJson(configJson);
            if (name) {
                return configObject.hasOwnProperty(name) ? configObject[name] : null;
            }
            else {
                return configObject;
            }
        };

        obj.setConfig = function (name, value) {
            var configObject = obj.getConfig();
            configObject[name] = value;
            storage.setValue("configJson", JSON.stringify(configObject));
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("option", ["storage", "constant", "object"], function (storage, constant, object) {
        var obj = {
            constant: constant.option
        };

        obj.isOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };

        obj.setOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };

        obj.setOptionUnActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };

        obj.getOption = function () {
            var option = [];
            var optionJson = storage.getValue("optionJson");
            var optionObject = obj.parseJson(optionJson);
            object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (optionObject.hasOwnProperty(name)) {
                    if (optionObject[name] != "no") {
                        option.push(name);
                    }
                }
                else if (item.value != "no") {
                    option.push(name);
                }
            });
            return option;
        };

        obj.setOption = function (option) {
            var optionObject = {};
            object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (option.indexOf(name) >= 0) {
                    optionObject[name] = "yes";
                } else {
                    optionObject[name] = "no";
                }
            });
            storage.setValue("optionJson", JSON.stringify(optionObject));
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("mode", [], function () {
        var obj = {
            constant: {
                addon: "addon",
                script: "script"
            }
        };

        obj.getMode = function () {
            if (typeof GM_info == "undefined") {
                return obj.constant.addon;
            }
            else if (GM_info.scriptHandler) {
                return obj.constant.script;
            }
            else {
                return obj.constant.addon;
            }
        };

        return obj;
    });

    container.define("user", ["storage"], function (storage) {
        var obj = {};

        obj.getUid = function () {
            var uid = storage.getValue("uid");
            if (!uid) {
                uid = obj.randString(32);
                storage.setValue("uid", uid);
            }
            return uid;
        };

        obj.randString = function (length) {
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            var text = "";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        return obj;
    });

    container.define("browser", [], function () {
        var obj = {
            constant: {
                firefox: "firefox",
                edge: "edge",
                baidu: "baidu",
                liebao: "liebao",
                uc: "uc",
                qq: "qq",
                sogou: "sogou",
                opera: "opera",
                maxthon: "maxthon",
                ie2345: "2345",
                se360: "360",
                chrome: "chrome",
                safari: "safari",
                other: "other"
            }
        };

        obj.getBrowser = function () {
            return obj.matchBrowserType(navigator.userAgent);
        };

        obj.matchBrowserType = function (userAgent) {
            var browser = obj.constant.other;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/firefox/) != null) {
                browser = obj.constant.firefox;
            } else if (userAgent.match(/edge/) != null) {
                browser = obj.constant.edge;
            } else if (userAgent.match(/bidubrowser/) != null) {
                browser = obj.constant.baidu;
            } else if (userAgent.match(/lbbrowser/) != null) {
                browser = obj.constant.liebao;
            } else if (userAgent.match(/ubrowser/) != null) {
                browser = obj.constant.uc;
            } else if (userAgent.match(/qqbrowse/) != null) {
                browser = obj.constant.qq;
            } else if (userAgent.match(/metasr/) != null) {
                browser = obj.constant.sogou;
            } else if (userAgent.match(/opr/) != null) {
                browser = obj.constant.opera;
            } else if (userAgent.match(/maxthon/) != null) {
                browser = obj.constant.maxthon;
            } else if (userAgent.match(/2345explorer/) != null) {
                browser = obj.constant.ie2345;
            } else if (userAgent.match(/chrome/) != null) {
                if (obj.existMime("type", "application/vnd.chromium.remoting-viewer")) {
                    browser = obj.constant.se360;
                } else {
                    browser = obj.constant.chrome;
                }
            } else if (userAgent.match(/safari/) != null) {
                browser = obj.constant.safari;
            }
            return browser;
        };

        obj.existMime = function (option, value) {
            if (typeof navigator != "undefined") {
                var mimeTypes = navigator.mimeTypes;
                for (var mt in mimeTypes) {
                    if (mimeTypes[mt][option] == value) {
                        return true;
                    }
                }
            }
            return false;
        };

        return obj;
    });

    container.define("env", ["mode", "user", "browser"], function (mode, user, browser) {
        var obj = {};

        obj.getMode = function () {
            return mode.getMode();
        };

        obj.getAid = function () {
            if (GM_info.addon && GM_info.addon.id) {
                return GM_info.addon.id;
            }
            else if (GM_info.scriptHandler) {
                return GM_info.scriptHandler.toLowerCase();
            }
            else {
                return "unknown";
            }
        };

        obj.getUid = function () {
            return user.getUid();
        };

        obj.getVersion = function () {
            if (injectInfo.enable) {
                return injectInfo.version;
            }
            else {
                return GM_info.script.version;
            }
        };

        obj.getBrowser = function () {
            return browser.getBrowser();
        };

        obj.getInfo = function () {
            return {
                mode: obj.getMode(),
                aid: obj.getAid(),
                uid: obj.getUid(),
                version: obj.getVersion(),
                browser: obj.getBrowser()
            };
        };

        return obj;
    });

    container.define("http", [], function () {
        var obj = {};

        obj.ajax = function (option) {
            var details = {
                method: option.type,
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    option.success && option.success(result.response);
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };

            // 提交数据
            if (option.data) {
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }

            // 自定义头
            if (option.headers) {
                details.headers = option.headers;
            }

            // 超时
            if (option.timeout) {
                details.timeout = option.timeout;
            }

            GM_xmlhttpRequest(details);
        };

        return obj;
    });

    container.define("router", [], function () {
        var obj = {};

        obj.goUrl = function (url) {
            obj.eval('location.href = "' + url + '";');
        };

        obj.openUrl = function (url) {
            obj.eval('window.open("' + url + '");');
        };

        obj.openTab = function (url, active) {
            GM_openInTab(url, !active);
        };

        obj.eval = function (script) {
            var node = document.createElementNS(document.lookupNamespaceURI(null) || "http://www.w3.org/1999/xhtml", "script");
            node.textContent = script;
            (document.head || document.body || document.documentElement || document).appendChild(node);
            node.parentNode.removeChild(node)
        };

        return obj;
    });

    container.define("logger", ["env", "constant"], function (env, constant) {
        var obj = {
            level: 3,
            constant: {
                debug: 0,
                info: 1,
                warn: 2,
                error: 3
            }
        };

        obj.debug = function (message) {
            obj.log(message, obj.constant.debug);
        };

        obj.info = function (message) {
            obj.log(message, obj.constant.info);
        };

        obj.warn = function (message) {
            obj.log(message, obj.constant.warn);
        };

        obj.error = function (message) {
            obj.log(message, obj.constant.error);
        };

        obj.log = function (message, level) {
            if (level < obj.level) {
                return false;
            }

            console.group("[" + constant.name + "]" + env.getMode());
            switch (level) {
                case obj.constant.debug:
                    console.log(message);
                    break;
                case obj.constant.info:
                    console.info(message);
                    break;
                case obj.constant.warn:
                    console.warn(message);
                    break;
                case obj.constant.error:
                    console.error(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
            console.groupEnd();
        };

        obj.setLevel = function (level) {
            obj.level = level;
        };

        return obj;
    });

    container.define("meta", ["constant", "$"], function (constant, $) {
        var obj = {};

        obj.existMeta = function (name) {
            name = obj.processName(name);
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.appendMeta = function (name, content) {
            name = obj.processName(name);
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };

        obj.processName = function (name) {
            return constant.name + "::" + name;
        };

        return obj;
    });

    container.define("unsafe_window", [], function () {
        if (typeof unsafeWindow == "undefined") {
            return window;
        }
        else {
            return unsafeWindow;
        }
    });

    /** custom start **/
    container.define("constant", ["mode", "browser"], function (mode, browser) {
        return {
            name: "wpzs",
            mode: mode.constant,
            browser: browser.constant,
            option: {
                send_usage: {
                    name: "send_usage",
                    value: "yes"
                },
                baidu_page_home: {
                    name: "baidu_page_home",
                    value: "yes"
                },
                baidu_page_share: {
                    name: "baidu_page_share",
                    value: "yes"
                },
                baidu_page_verify: {
                    name: "baidu_page_verify",
                    value: "yes"
                },
                baidu_share_status: {
                    name: "baidu_share_status",
                    value: "yes"
                },
                baidu_custom_password: {
                    name: "baidu_custom_password",
                    value: "yes"
                },
                baidu_show_origin: {
                    name: "baidu_show_origin",
                    value: "yes"
                },
                baidu_multi_link: {
                    name: "baidu_multi_link",
                    value: "no"
                },
                baidu_disable_client: {
                    name: "baidu_disable_client",
                    value: "yes"
                },
                baidu_auto_jump: {
                    name: "baidu_auto_jump",
                    value: "no"
                },
                weiyun_page_verify: {
                    name: "weiyun_page_verify",
                    value: "yes"
                },
                weiyun_share_status: {
                    name: "weiyun_share_status",
                    value: "yes"
                },
                weiyun_auto_jump: {
                    name: "weiyun_auto_jump",
                    value: "no"
                },
                lanzous_page_verify: {
                    name: "lanzous_page_verify",
                    value: "yes"
                },
                lanzous_share_status: {
                    name: "lanzous_share_status",
                    value: "yes"
                },
                lanzous_auto_jump: {
                    name: "lanzous_auto_jump",
                    value: "no"
                },
                weibo_page_download: {
                    name: "weibo_page_download",
                    value: "yes"
                },
                ctfile_page_list: {
                    name: "ctfile_page_list",
                    value: "yes"
                },
                ctfile_page_download: {
                    name: "ctfile_page_download",
                    value: "yes"
                },
                ctfile_multi_link: {
                    name: "ctfile_multi_link",
                    value: "no"
                },
                yunfile_page_download: {
                    name: "yunfile_page_download",
                    value: "yes"
                }
            },
            source: {
                baidu: "baidu",
                weiyun: "weiyun",
                lanzous: "lanzous"
            },
            router: {
                home: "http://pan.newday.me",
                option: "http://pan.newday.me/script/option.html"
            }
        };
    });

    container.define("share_log", ["object", "storage", "constant"], function (object, storage, constant) {
        var obj = {};

        obj.addShareLog = function (shareId, sharePwd, shareLink, shareSource) {
            var shareLogList = obj.getShareLogList();
            shareLogList[shareId] = {
                share_id: shareId,
                share_pwd: sharePwd,
                share_link: shareLink,
                share_source: shareSource,
                share_time: (new Date()).getTime()
            };
            storage.setValue("share_log_json", JSON.stringify(shareLogList));
        };

        obj.getShareLogList = function () {
            var shareLogJson = storage.getValue("share_log_json");
            return obj.parseJson(shareLogJson);
        };

        obj.buildShareLink = function (shareId, shareSource, shareLink) {
            if (shareSource == constant.source.baidu) {
                shareLink = "https://pan.baidu.com/s/1" + shareId;
            }
            else if (shareSource == constant.source.baidu) {
                shareLink = "https://share.weiyun.com/" + shareId;
            } else if (shareSource == constant.source.baidu) {
                shareLink = "https://www.lanzous.com/" + shareId;
            }
            return shareLink;
        };

        obj.buildShareTime = function (shareTime) {
            var date = new Date(shareTime);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return obj.replaceVars(vars, "Y-m-d H:i:s");
        };

        obj.replaceVars = function (vars, value) {
            object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("core", ["router", "constant"], function (router, constant) {
        var obj = {};

        obj.openPage = function (url, mode) {
            switch (mode) {
                case 9:
                    // self
                    router.goUrl(url);
                    break;
                case 6:
                    // new
                    router.openUrl(url);
                    break;
                case 3:
                    // new & not active
                    router.openTab(url, false);
                    break;
                case 1:
                    // new & active
                    router.openTab(url, true);
                    break;
            }
        };

        obj.openOptionPage = function () {
            if (injectInfo.enable) {
                if (env.getMode() == constant.mode.addon) {
                    router.openTab(injectInfo.router_addon.option, true);
                }
                else {
                    router.openTab(injectInfo.router_script.option, true);
                }
            }
            else if (GM_info.addon && GM_info.addon.options_page) {
                router.openTab(GM_info.addon.options_page, true);
            }
            else {
                router.openTab(constant.router.option, true);
            }
        };

        obj.ready = function (callback) {
            callback && callback();
        };

        return obj;
    });

    container.define("api", ["http", "env", "share_log", "snap"], function (http, env, shareLog, snap) {
        var obj = {
            base: "https://api.newday.me"
        };

        obj.queryShareOrigin = function (shareId, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/share/disk/origin",
                dataType: "json",
                data: {
                    share_id: shareId,
                    mode: env.getMode(),
                    aid: env.getAid(),
                    uid: env.getUid(),
                    version: env.getVersion(),
                    browser: env.getBrowser()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.querySharePwd = function (shareId, shareLink, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/share/disk/query",
                dataType: "json",
                data: {
                    share_id: shareId,
                    share_point: obj.getStrPoint(shareId),
                    share_link: shareLink,
                    mode: env.getMode(),
                    aid: env.getAid(),
                    uid: env.getUid(),
                    version: env.getVersion(),
                    browser: env.getBrowser()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.storeSharePwd = function (shareId, sharePwd, shareLink, shareSource, callback) {
            // 记录日志
            shareLog.addShareLog(shareId, sharePwd, shareLink, shareSource);

            http.ajax({
                type: "post",
                url: obj.base + "/share/disk/store",
                dataType: "json",
                data: {
                    share_id: shareId,
                    share_pwd: sharePwd,
                    share_point: obj.getStrPoint(shareId),
                    share_link: shareLink,
                    mode: env.getMode(),
                    aid: env.getAid(),
                    uid: env.getUid(),
                    version: env.getVersion(),
                    browser: env.getBrowser()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.logOption = function (option, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/share/disk/option",
                dataType: "json",
                data: {
                    option_json: JSON.stringify(option),
                    mode: env.getMode(),
                    aid: env.getAid(),
                    uid: env.getUid(),
                    version: env.getVersion(),
                    browser: env.getBrowser()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.sendUsage = function (url, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/share/disk/usage",
                dataType: "json",
                data: {
                    url: url,
                    mode: env.getMode(),
                    aid: env.getAid(),
                    uid: env.getUid(),
                    version: env.getVersion(),
                    browser: env.getBrowser()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };

        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }

            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };

        return obj;
    });

    /** app start **/
    container.define("app_baidu", ["runtime", "config", "option", "logger", "unsafe_window", "constant", "core", "api", "$"], function (runtime, config, option, logger, unsafeWindow, constant, core, api, $) {
        var obj = {
            app_id: 250528,
            yun_data: null,
            verify_page: {
                share_pwd: null,
                setPwd: null,
                backupPwd: null,
                restorePwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = runtime.getUrl();
            if (url.indexOf(".baidu.com/s/") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.baidu_page_share) && obj.initSharePage();
                });
                return true;
            }
            else if (url.indexOf(".baidu.com/disk/home") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.baidu_page_home) && obj.initHomePage();
                });
                return true;
            } else if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.baidu_page_home) && obj.initTimeLinePage();
                });
                return true;
            } else if (url.indexOf(".baidu.com/share/init") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.baidu_page_verify) && obj.initVerifyPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initSharePage = function () {
            obj.registerCustomAppId();

            obj.removeDownloadLimit();

            obj.removeVideoLimit();

            obj.prettySingleSharePage();

            obj.initButtonShare();

            obj.initButtonEvent();

            if (option.isOptionActive(option.constant.baidu_show_origin)) {
                obj.showShareOrigin();
            }
        };

        obj.initHomePage = function () {
            obj.registerCustomAppId();

            obj.registerCustomSharePwd();

            obj.removeDownloadLimit();

            obj.initButtonHome();

            obj.initButtonEvent();
        };

        obj.initTimeLinePage = function () {
            obj.registerCustomAppId();

            obj.registerCustomSharePwd();

            obj.removeDownloadLimit();

            obj.initButtonTimeLine();

            obj.initButtonEvent();
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".input-area input");
            if (shareId && $pwd.length) {
                // 设置提取码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 备份提取码
                obj.verify_page.backupPwd = function (pwd) {
                    $pwd.attr("data-pwd", pwd);
                };

                // 还原提取码
                obj.verify_page.restorePwd = function () {
                    $pwd.val($pwd.attr("data-pwd"));
                };

                // 提交提取码
                var $button = $(".input-area .g-button");
                if ($button.length) {
                    obj.verify_page.submit_pwd = function () {
                        $button.click();
                    };
                }

                return true;
            }
            else {
                return false;
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = runtime.getUrl();
            api.querySharePwd(shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充提取码成功");

                    if (option.isOptionActive(option.constant.baidu_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享提取码");
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".pickpw dt").html(`请输入提取码：<span style="float:right">
                <input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> 
                <a class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享提取码</a>
            </span>`);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.baidu_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.baidu_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                core.openOptionPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/share/verify") >= 0) {
                    var match = options.data.match(/pwd=([a-z0-9]+)/i);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }

                    // 拒绝*号
                    if (obj.verify_page.backupPwd) {
                        obj.verify_page.backupPwd(match[1]);
                        setTimeout(obj.verify_page.restorePwd, 500);
                    }

                    var response = xhr.responseJSON;
                    if (!(response && response.errno == 0)) {
                        return logger.warn("pwd share error");
                    }

                    var sharePwd = match[1];
                    if (sharePwd == obj.verify_page.share_pwd) {
                        return logger.warn("pwd share not change");
                    }

                    if (!obj.isPwdShareOpen()) {
                        return logger.warn("pwd share closed");
                    }

                    var shareId = obj.getShareId();
                    var shareLink = runtime.getUrl();
                    api.storeSharePwd(shareId, sharePwd, shareLink, constant.source.baidu);
                }
            });
        };

        obj.registerCustomAppId = function () {
            obj.getJquery()(document).ajaxSend(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/api/download") >= 0 || requestUrl.indexOf("/api/sharedownload") >= 0) {
                    var match = requestUrl.match(/app_id=(\d+)/);
                    if (match) {
                        options.url = requestUrl.replace(match[0], "app_id=" + obj.getAppId());
                    }
                }
            });
        };

        obj.registerCustomSharePwd = function () {
            // 功能开关
            if (!option.isOptionActive(option.constant.baidu_custom_password)) {
                return;
            }

            // 生成提取码
            obj.async("function-widget-1:share/util/shareFriend/createLinkShare.js", function (shareLink) {
                var makePrivatePassword = shareLink.prototype.makePrivatePassword;
                shareLink.prototype.makePrivatePassword = function () {
                    var sharePwd = config.getConfig("share_pwd");
                    return sharePwd ? sharePwd : makePrivatePassword();
                };
            });

            // 分享事件
            obj.async("function-widget-1:share/util/shareDialog.js", function (shareDialog) {
                var onVisibilityChange = shareDialog.prototype.onVisibilityChange;
                shareDialog.prototype.onVisibilityChange = function (status) {
                    if (status && !$(".nd-input-share-pwd").length) {
                        var sharePwd = config.getConfig("share_pwd");
                        var html = `<tr>
                            <td class="first-child">
                                <label>提取码</label>
                            </td>
                            <td>
                                <input type="text" class="nd-input-share-pwd" value="`+ (sharePwd ? sharePwd : "") + `" placeholder="为空则随机四位" style="padding: 6px; width: 100px;border: 1px solid #e9e9e9;">
                            </td>
                        </tr>`;
                        $("#share .dialog-body table").append(html);
                    }
                    onVisibilityChange.call(status);
                };
            });

            // 提取码更改事件
            $(document).on("change", ".nd-input-share-pwd", function () {
                var value = this.value;
                if (value && !value.match(/^[0-9a-z]{4}$/i)) {
                    obj.showTipError("提取码只能是四位数字或字母");
                }
                config.setConfig("share_pwd", value);
            });
        };

        obj.removeDownloadLimit = function () {
            if (option.isOptionActive(option.constant.baidu_disable_client)) {
                obj.async("function-widget-1:download/config.js", function (config) {
                    [].push.apply(config.directDownloadkeysConfig, config.guanjiaDownloadkeysConig);
                    config.guanjiaDownloadkeysConig = [];
                });
            }
        };

        obj.removeVideoLimit = function () {
            var message = obj.getSystemContext().message;
            if (message) {
                message.trigger("share-video-after-transfer");
            }
            else {
                logger.warn("wait removeVideoLimit...");
                obj.setTimeout(obj.removeVideoLimit, 500);
            }
        };

        obj.prettySingleSharePage = function () {
            if (!obj.isSharePageMulti()) {
                $("#layoutMain").css({
                    "width": "auto",
                    "min-width": "1180px",
                    "margin": "88px 30px"
                });
            }
        };

        obj.showShareOrigin = function () {
            var shareId = obj.getShareId();
            api.queryShareOrigin(shareId, function (response) {
                if (response && response.code == 1) {
                    var data = response.data;
                    if (data.list && data.list.length) {
                        var html = `<div style="padding: 10px 5px; border-bottom: 1px solid #f6f6f6; line-height: 30px;">`;
                        var item = data.list[0];
                        if (data.list.length > 1) {
                            html += `<p>分享来源：<a target="_blank" href="` + item.url + `">` + item.title + `</a> [<a class="show-origin-dialog" href="javascript:;" style="color:#ff0000;"> 查看更多 </a>]</p>`;
                        }
                        else {
                            html += `<p>分享来源：<a target="_blank" href="` + item.url + `">` + item.title + `</a></p>`;
                        }
                        html += `</div>`;
                        $(".module-share-header").after(html);

                        $(document).on("click", ".show-origin-dialog", function () {
                            var title = "分享来源";
                            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto;">';

                            data.list.forEach(function (item, index) {
                                body += `<p>` + (++index) + `：<a target="_blank" href="` + item.url + `">` + item.title + `</a></p>`;
                            });

                            body += `</div>`;
                            var footer = obj.renderFooterAppId();
                            obj.showDialog(title, body, footer);
                        });
                    }
                    else {
                        obj.showTipError("暂未查询到分享的来源");
                    }
                }
            });
        };

        obj.initButtonShare = function () {
            if ($(".x-button-box").length) {
                var html = `<a class="g-button nd-button-build">
                    <span class="g-button-right">
                        <em class="icon icon-disk" title="下载"></em>
                        <span class="text">生成链接</span>
                    </span>
                </a>`;
                $(".x-button-box").append(html);
            }
            else {
                logger.warn("wait initButtonShare...");
                setTimeout(obj.initButtonShare, 500);
            }
        };

        obj.initButtonHome = function () {
            var listTools = obj.getSystemContext().Broker.getButtonBroker("listTools");
            if (listTools && listTools.$box) {
                var html = `<a class="g-button nd-button-build">
                    <span class="g-button-right">
                        <em class="icon icon-disk" title="下载"></em>
                        <span class="text">生成链接</span>
                    </span>
                </a>`;
                $(listTools.$box).prepend(html);
            }
            else {
                logger.warn("wait initButtonHome...");
                setTimeout(obj.initButtonHome, 500);
            }
        };

        obj.initButtonTimeLine = function () {
            if ($(".module-operateBtn .group-button").length) {
                var html = `<span class="button">
                    <a class="g-v-button g-v-button-middle nd-button-build">
                        <span class="g-v-button-right">
                            <em class="icon icon-disk"></em>
                            <span class="text">生成链接</span>
                        </span>
                    </a>
                </span> `;
                $(".module-operateBtn .group-button").prepend(html);
            }
            else {
                logger.warn("wait initButtonTimeLine...");
                setTimeout(obj.initButtonTimeLine, 500);
            }
        };

        obj.initButtonEvent = function () {
            // 生成链接
            $(document).on("click", ".nd-button-build", function () {
                var yunData = obj.getYunData();
                if (yunData.MYUK) {
                    var fileList = obj.getSelectedFileList();
                    var fileStat = obj.getFileListStat(fileList);
                    if (fileList.length) {
                        if (fileList.length > 1 && fileStat.file_num) {
                            obj.showDownloadSelect(fileList, fileStat);
                        }
                        else {
                            var pack = fileStat.file_num ? false : true;
                            if (obj.isHomePage()) {
                                obj.showDownloadInfoHome(fileList, pack);
                            }
                            else {
                                obj.showDownloadInfoShare(fileList, pack);
                            }
                        }
                    }
                    else {
                        obj.showTipError("请至少选择一个文件或文件夹");
                    }
                }
                else {
                    obj.showLogin();
                }
            });

            // 压缩包
            $(document).on("click", ".nd-button-pack", function () {
                var fileList = obj.getSelectedFileList();
                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, true);
                }
                else {
                    obj.showDownloadInfoShare(fileList, true);
                }
            });

            // 多文件
            $(document).on("click", ".nd-button-multi", function () {
                var fileList = obj.getSelectedFileList();

                // 过滤文件夹
                fileList = obj.filterFileListDir(fileList);

                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, false);
                }
                else {
                    obj.showDownloadInfoShare(fileList, false);
                }
            });

            // 应用ID
            $(document).on("click", ".nd-change-app-id", function () {
                obj.showAppIdChange();
            });
            $(document).on("change", ".nd-input-app-id", function () {
                obj.setAppId(this.value);
            });

            // 打开配置页
            $(document).on("click", ".nd-open-page-option", function () {
                core.openOptionPage();
            });
        };

        obj.showLogin = function () {
            obj.getJquery()("[node-type='header-login-btn']").click();
        };

        obj.showDownloadInfoShare = function (fileList, pack) {
            logger.info(fileList);
            obj.getDownloadShare(fileList, pack, function (response) {
                obj.hideTip();
                logger.info(response);

                if (response.list && response.list.length) {
                    // 文件
                    obj.showDownloadLinkFile(response.list);
                }
                else if (response.dlink) {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };

        obj.showDownloadInfoHome = function (fileList, pack) {
            logger.info(fileList);
            obj.getDownloadHome(fileList, pack, function (response) {
                obj.hideTip();
                logger.info(response);

                if (response.dlink && typeof response.dlink == "object" && response.dlink.length) {
                    // 文件
                    var dlinkMapping = {};
                    response.dlink.forEach(function (item) {
                        dlinkMapping[item.fs_id] = item.dlink;
                    });

                    fileList.forEach(function (item) {
                        item.dlink = dlinkMapping[item.fs_id];
                        item.dlink_api = obj.buildDownloadUrl(item.path);
                    });
                    obj.showDownloadLinkFile(fileList);
                }
                else if (response.dlink && typeof response.dlink == "string") {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };

        obj.showDownloadLinkFile = function (fileList) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';

            if (fileList.length > 1 && option.isOptionActive(option.constant.baidu_multi_link)) {
                var dlinkList = [];
                var dlinkApiList = [];
                fileList.forEach(function (item) {
                    dlinkList.push(item.dlink + "&filename=" + encodeURIComponent(item.server_filename));
                    item.dlink_api && dlinkApiList.push(item.dlink_api);
                });
                body += `<div style="margin-bottom: 10px;">`;
                body += `<div>[官方] 批量链接</div>
                <div style="height: 80px; overflow: auto;">
                    <textarea name="dlink_offical" style="width:2500px; border: 1px solid #f2f2f2;" rows="`+ dlinkList.length + `">` + dlinkList.join("\n") + `</textarea>
                </div>`;
                if (dlinkApiList.length) {
                    body += `<div>[接口] 批量链接</div>
                    <div style="height: 80px; overflow: auto;">
                        <textarea name="dlink_api" style="width:2500px; border: 1px solid #f2f2f2;" rows="`+ dlinkApiList.length + `">` + dlinkApiList.join("\n") + `</textarea>
                    </div>`;
                }
                body += `</div>`;
            }

            fileList.forEach(function (item, index) {
                body += `<div style="margin-bottom: 10px;">`;

                body += `<div>` + (index + 1) + `：` + item.server_filename + `</div>`;

                body += `<div><a href="` + item.dlink + `&filename=` + encodeURIComponent(item.server_filename) + `" title="` + item.dlink + `" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                    [官方] `+ item.dlink + `
                </a></div>`;

                if (item.dlink_api) {
                    body += `<div><a href="` + item.dlink_api + `" title="` + item.dlink_api + `" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                        [接口] `+ item.dlink_api + `
                    </a></div>`;
                }

                body += `</div>`;
            });
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showDownloadLinkPack = function (fileList, data) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';

            var packName = obj.getDownloadPackName(fileList);
            body += `<div>` + packName + `</div>
            <div><a href="`+ data.dlink + `&zipname=` + encodeURIComponent(packName) + `" title="` + data.dlink + `" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                [官方] `+ data.dlink + `
            </a></div>`;

            body += `<div style="margin-top: 15px;">打包的文件/文件夹列表</div>`;
            fileList.forEach(function (item, index) {
                body += `<div title="` + item.path + `" style="color: ` + (item.isdir ? "blue" : "inherit") + `;">[` + (index + 1) + `] ` + item.server_filename + `</div>`;
            });

            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.getDownloadPackName = function (fileList) {
            return fileList[0].server_filename + " 等" + fileList.length + "个文件.zip";
        };

        obj.buildDownloadUrl = function (path) {
            return "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=" + obj.getAppId() + "&path=" + encodeURIComponent(path);
        };

        obj.showDownloadSelect = function (fileList, fileStat) {
            var title = "链接类型";
            var body = `<div style="padding: 40px 20px; max-height: 300px; overflow-y: auto;">`;

            body += `<div class="normalBtnBox g-center">
                <a class="g-button g-button-large g-button-gray-large nd-button-pack">
                    <span class="g-button-right">
                        <em class="icon icon-download"></em> 压缩包
                    </span>
                </a>
                <a class="g-button g-button-large g-button-gray-large nd-button-multi" style="margin-left:50px;">
                    <span class="g-button-right">
                        <em class="icon icon-poly"></em> 多文件
                    </span>
                </a>
            </div>`;

            if (fileStat.dir_num) {
                body += `<div style="margin-top: 40px; padding-top: 10px; margin-bottom: -20px; border-top: 1px solid #D0DFE7;">
                <p class="g-center">选择 [多文件] 会过滤当前选中的 <span style="color: red">`+ fileStat.dir_num + `</span> 个文件夹</p>`;

                var index = 1;
                fileList.forEach(function (item) {
                    if (item.isdir) {
                        body += `<p title="` + item.path + `" style="color: blue;">[` + index + `] ` + item.server_filename + `</p>`;
                        index++;
                    }
                });
                body += `</div>`;
            }

            body += `</div>`;
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.showAppIdChange = function () {
            var title = "应用ID";
            var body = `<div style="padding: 60px 20px; max-height: 300px; overflow-y: auto;">
                <div class="g-center" style="margin-bottom: 10px;">
                    当前应用ID：<input type="text" class="nd-input-app-id" style="border: 1px solid #f2f2f2; padding: 4px 5px;" value="`+ obj.getAppId() + `">
                </div>
                <div class="g-center">
                    <p>如生成链接或者下载文件异常，请尝试修改为官方应用ID【` + obj.app_id + `】</p>
                    <p>修改应用ID可能存在未知的风险，请慎重使用，更多应用ID请查看<a target="_blank" href="https://greasyfork.org/zh-CN/scripts/378301"> 脚本主页 </a></p>
                </div>
            </div>`;
            var footer = '';
            obj.showDialog(title, body, footer);
        };

        obj.showDialogUnKnownResponse = function (response) {
            var title = "未知结果";
            var body = `<div style="padding: 20px 20px; max-height: 300px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; word-wrap: break-word; word-break: break-all;">` + JSON.stringify(response, null, 4) + `</pre>
            </div>`;
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };

        obj.renderFooterAppId = function () {
            return `<p style="padding-top: 10px; border-top: 1px solid #D0DFE7;">
                当前应用ID：` + obj.getAppId() + ` <a href="javascript:;" class="nd-change-app-id">修改</a>，其他设置请访问 <a class="nd-open-page-option" href="javascript:;">配置页面</a>
            </p > `;
        };

        obj.showDialog = function (title, body, footer) {
            var dialog = obj.require("system-core:system/uiService/dialog/dialog.js").verify({
                title: title,
                img: "img",
                vcode: "vcode"
            });

            // 内容
            $(dialog.$dialog).find(".dialog-body").html(body);

            // 底部
            $(dialog.$dialog).find(".dialog-footer").html(footer);

            dialog.show();
        };

        obj.showTipSuccess = function (msg, hasClose, autoClose) {
            obj.showTip("success", msg, hasClose, autoClose);
        };

        obj.showTipError = function (msg, hasClose, autoClose) {
            obj.showTip("failure", msg, hasClose, autoClose);
        };

        obj.showTipLoading = function (msg, hasClose, autoClose) {
            obj.showTip("loading", msg, hasClose, autoClose);
        };

        obj.showTip = function (mode, msg, hasClose, autoClose) {
            var option = {
                mode: mode,
                msg: msg
            };

            // 关闭按钮
            if (typeof hasClose != "undefined") {
                option.hasClose = hasClose;
            }

            // 自动关闭
            if (typeof autoClose != "undefined") {
                option.autoClose = autoClose;
            }

            obj.require("system-core:system/uiService/tip/tip.js").show(option);
        };

        obj.hideTip = function () {
            obj.require("system-core:system/uiService/tip/tip.js").hide({
                hideTipsAnimationFlag: 1
            });
        };

        obj.isHomePage = function () {
            var url = runtime.getUrl();
            if (url.indexOf(".baidu.com/disk") > 0) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isTimelinePage = function () {
            var url = runtime.getUrl();
            if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isSharePageMulti = function () {
            var yunData = obj.getYunData();
            if (yunData.SHAREPAGETYPE == "single_file_page") {
                return false;
            }
            else {
                return true;
            }
        };

        obj.getSelectedFileList = function () {
            if (obj.isHomePage()) {
                return obj.getSelectedFileListHome();
            }
            else {
                return obj.getSelectedFileListShare();
            }
        };

        obj.getSelectedFileListHome = function () {
            if (obj.isTimelinePage()) {
                return obj.require("pan-timeline:widget/store/index.js").getters.getChoosedItemArr;
            }
            else {
                return obj.require("disk-system:widget/pageModule/list/listInit.js").getCheckedItems();
            }
        };

        obj.getSelectedFileListShare = function () {
            if (obj.isSharePageMulti()) {
                return obj.require("disk-share:widget/pageModule/list/listInit.js").getCheckedItems();
            }
            else {
                var yunData = obj.getYunData();
                return yunData.FILEINFO;
            }
        };

        obj.getFileListStat = function (fileList) {
            var fileStat = {
                file_num: 0,
                dir_num: 0
            };
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileStat.file_num++;
                }
                else {
                    fileStat.dir_num++;
                }
            });
            return fileStat;
        };

        obj.filterFileListDir = function (fileList) {
            var fileListFilter = [];
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileListFilter.push(item);
                }
            });
            return fileListFilter;
        };

        obj.parseFidList = function (fileList) {
            var fidList = [];
            fileList.forEach(function (item) {
                fidList.push(item.fs_id);
            });
            return fidList;
        };

        obj.getDownloadShare = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var yunData = obj.getYunData();
                var data = {
                    list: fileList,
                    share_uk: yunData.SHARE_UK,
                    share_id: yunData.SHARE_ID,
                    sign: yunData.SIGN,
                    timestamp: yunData.TIMESTAMP,
                    type: pack ? "batch" : "nolimit"
                };
                dl.getDlinkShare(data, callback);
            });
        };

        obj.getDownloadHome = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var fidList = obj.parseFidList(fileList);
                var type = pack ? "batch" : "nolimit";
                dl.getDlinkPan(JSON.stringify(fidList), type, callback);
            });
        };

        obj.getShareId = function () {
            var shareId = runtime.getUrlParam("surl");
            if (shareId) {
                return shareId;
            }
            else {
                var match = location.pathname.match(/\/s\/1(\S+)/);
                return match ? match[1] : null;
            }
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.baidu_share_status);
        };

        obj.getYunData = function () {
            if (!obj.yun_data) {
                obj.yun_data = unsafeWindow.yunData;
            }
            return obj.yun_data;
        };

        obj.getAppId = function () {
            var appId = config.getConfig("app_id");
            if (appId) {
                return appId;
            }
            else {
                return obj.app_id;
            }
        };

        obj.setAppId = function (appId) {
            config.setConfig("app_id", appId);
            api.logOption({
                app_id: appId
            });
        };

        obj.initWidgetContext = function (name, callback) {
            var initFunc = function (widget) {
                if (!widget.getContext()) {
                    widget.setContext(obj.getSystemContext());
                }
                callback && callback();
            };
            if (callback) {
                obj.async(name, initFunc);
            }
            else {
                initFunc(obj.require(name));
            }
        };

        obj.ajax = function (option) {
            obj.getJquery().ajax(option);
        };

        obj.getSystemContext = function () {
            return obj.require("system-core:context/context.js").instanceForSystem;
        };

        obj.getJquery = function () {
            return obj.require("base:widget/libs/jquerypacket.js");
        };

        obj.require = function (name) {
            return unsafeWindow.require(name);
        };

        obj.async = function (name, callback) {
            unsafeWindow.require.async(name, callback);
        };

        return obj;
    });

    container.define("app_weiyun", ["runtime", "object", "option", "logger", "unsafe_window", "constant", "core", "api", "$"], function (runtime, object, option, logger, unsafeWindow, constant, core, api, $) {
        var obj = {
            axios: null,
            modal: null,
            store: null,
            inject_name: "_nd_inject_",
            webpack_require: null,
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = runtime.getUrl();
            if (url.indexOf("share.weiyun.com") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.weiyun_page_verify) && obj.initVerifyPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.initWebpackRequire(function () {
                obj.registerStoreSharePwd();
            });

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".card-inner .input-txt[type='password']");
            var $button = $(".card-inner .btn-main");
            if (shareId && $pwd.length && $button.length) {

                // 显示分享密码
                $pwd.attr("type", "text");

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 重造按钮
                var $itemButton = $button.parent();
                $itemButton.html($button.prop("outerHTML"));
                $button = $itemButton.find(".btn-main");

                // 按钮事件
                $button.on("click", function () {
                    obj.getStore() && obj.getStore().default.dispatch("shareInfo/loadShareInfoWithoutLogin", $pwd.val());
                });

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $button.click();
                };

                return true;
            }
            else {
                return false;
            }
        };

        obj.initWebpackRequire = function (callback) {
            var moreModules = {};
            moreModules[obj.inject_name] = function (module, exports, __webpack_require__) {
                obj.webpack_require = __webpack_require__;
                callback && callback();
            };
            unsafeWindow.webpackJsonp([obj.inject_name], moreModules, [obj.inject_name]);
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充密码成功");

                    if (option.isOptionActive(option.constant.weiyun_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享密码");
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".card-inner .form-item-label .form-item-tit").html(`<span class="form-item-tit">
                请输入分享密码
                <span style="margin-left: 45px;">
                    <input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> 
                    <a class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享密码</a>
                </span>
            </span>`);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.weiyun_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.weiyun_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                core.openOptionPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            obj.addResponseInterceptor(function (request, response) {
                var requestUrl = request.responseURL;
                if (requestUrl.indexOf("weiyunShareNoLogin/WeiyunShareView") > 0) {
                    if (response.data.data.rsp_header.retcode == 0) {
                        var match = response.config.data.match(/\\"share_pwd\\":\\"([\w]+)\\"/);
                        if (!match) {
                            return logger.warn("pwd share not match");
                        }

                        var sharePwd = match[1];
                        if (sharePwd == obj.verify_page.share_pwd) {
                            return logger.warn("pwd share not change");
                        }

                        if (!obj.isPwdShareOpen()) {
                            return logger.warn("pwd share closed");
                        }

                        var shareId = obj.getShareId();
                        var shareLink = obj.getShareLink();
                        api.storeSharePwd(shareId, sharePwd, shareLink, constant.source.weiyun);
                    }
                    else {
                        return logger.warn("pwd share error");
                    }
                }
            });
        };

        obj.addResponseInterceptor = function (callback) {
            var success = function (response) {
                try {
                    callback && callback(response.request, response);
                }
                catch (e) {
                    logger.warn(e);
                }
                return response;
            };
            var error = function () {
                return Promise.reject(error);
            };
            obj.getAxios() && obj.getAxios().interceptors.response.use(success, error);
        };

        obj.showTipSuccess = function (msg) {
            obj.getModal() && obj.getModal().success(msg);
        };

        obj.showTipError = function (msg) {
            obj.getModal() && obj.getModal().error(msg);
        };

        obj.getShareId = function () {
            var url = runtime.getUrl();
            var match = url.match(/share.weiyun.com\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };

        obj.getShareLink = function () {
            return runtime.getUrl();
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.weiyun_share_status);
        };

        obj.getAxios = function () {
            if (!obj.axios) {
                obj.axios = obj.matchWebpackModule(function (module, name) {
                    if (module && module.Axios) {
                        return module;
                    }
                });
            }
            return obj.axios;
        };

        obj.getModal = function () {
            if (!obj.modal) {
                obj.modal = obj.matchWebpackModule(function (module, name) {
                    if (module && module.confirm && module.success) {
                        return module;
                    }
                });
            }
            return obj.modal;
        };

        obj.getStore = function () {
            if (!obj.store) {
                obj.store = obj.matchWebpackModule(function (module, name) {
                    if (module && module.default && module.default._modulesNamespaceMap) {
                        return module;
                    }
                });
            }
            return obj.store;
        };

        obj.matchWebpackModule = function (matchFunc) {
            var names = object.keys(obj.webpack_require.c);
            for (var i in names) {
                var name = names[i];
                var match = matchFunc(obj.webpack_require(name), name);
                if (match) {
                    return match;
                }
            }
        };

        return obj;
    });

    container.define("app_lanzous", ["runtime", "option", "logger", "unsafe_window", "constant", "core", "api", "$"], function (runtime, option, logger, unsafeWindow, constant, core, api, $) {
        var obj = {
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };

        obj.run = function () {
            var url = runtime.getUrl();
            if (url.indexOf("www.lanzous.com/fn") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.lanzous_page_verify) && obj.initVerifyPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();

            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();

                obj.registerPwdShareSwitch();
            }
        };

        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $("#pwd");
            if (shareId && $pwd.length) {

                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };

                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $("#sub").click();
                };

                return true;
            }
            else {
                return false;
            }
        };

        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTip(1, "填充密码成功", 2000);

                    if (option.isOptionActive(option.constant.lanzous_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTip(0, "暂无人分享密码", 2000);
                }
            });
        };

        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".text").html(`<input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;" > 
            <a style="cursor: pointer;" class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享密码</a>`);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");

            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.lanzous_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.lanzous_share_status);
                }
            });

            // 打开配置页
            $(".nd-open-page-option").click(function () {
                core.openOptionPage();
            });
        };

        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var match = options.data.match(/p=(\w+)/);
                if (!match) {
                    return logger.warn("pwd share not match");
                }

                var sharePwd = match[1];
                if (sharePwd == obj.verify_page.share_pwd) {
                    return logger.warn("pwd share not change");
                }

                if (!obj.isPwdShareOpen()) {
                    return logger.warn("pwd share closed");
                }

                var shareId = obj.getShareId();
                var shareLink = obj.getShareLink();
                var response = obj.parseJson(xhr.response);
                if (response && response.zt == 1 && sharePwd) {
                    api.storeSharePwd(shareId, sharePwd, shareLink, constant.source.lanzous);
                }
                else {
                    logger.warn("pwd share error");
                }
            });
        };

        obj.showTip = function (code, msg, timeout) {
            if (code) {
                $("#info").html('<span style="color: green;">' + msg + '</span>');
            }
            else {
                $("#info").html('<span style="color: red;">' + msg + '</span>');
            }
            setTimeout(function () {
                $("#info").html("");
            }, timeout);
        };

        obj.getShareId = function () {
            return runtime.getUrlParam("f");
        };

        obj.getShareLink = function () {
            return top.location.href;
        };

        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.lanzous_share_status);
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("app_weibo", ["runtime", "option", "unsafe_window", "$"], function (runtime, option, unsafeWindow, $) {
        var obj = {};

        obj.run = function () {
            var url = runtime.getUrl();
            if (url.indexOf("vdisk.weibo.com") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.weibo_page_download) && obj.initDownloadPage();
                });
                return true;
            }
            return false;
        };

        obj.initDownloadPage = function () {
            unsafeWindow.seajs.use(["2/core", "2/widget/fileDownLayer"], function (http, widget) {
                // 取消未登录弹窗
                widget.init = function () { };

                // 请求下载链接
                var $button = $("#download_small_btn");
                var fileInfo = obj.parseJson($button.attr("data-info"));
                http.api({
                    url: "api/weipan/fileopsStatCount",
                    data: {
                        link: fileInfo.copy_ref,
                        ops: "download",
                        wpSign: unsafeWindow.SIGN
                    }
                }, function (response) {
                    var html = `<a style="color: red;" title="右键使用迅雷或者IDM进行下载" href="` + response.url + `"><i class="vd_pic_v2 ico_file_download"> 右键下载</i></a>`;
                    $button.after(html);
                    $button.hide();
                });
            });
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("app_[ctfile|pipipan]", ["runtime", "object", "option", "http", "unsafe_window", "$"], function (runtime, object, option, http, unsafeWindow, $) {
        var obj = {
            base: "",
            url_list: {},
            response_cache: {}
        };

        obj.getBase = function () {
            return obj.base;
        };

        obj.setBase = function (base) {
            obj.base = base;
        };

        obj.run = function () {
            var url = runtime.getUrl();
            if (url.indexOf("ctfile.com") > 0) {
                obj.setBase("https://qihuanmp3.ctfile.com");
                $(function () {
                    obj.initDownloadInfo();
                });
                return true;
            }
            else if (url.indexOf("pipipan.com") > 0) {
                obj.setBase("https://www.pipipan.com");
                $(function () {
                    obj.initDownloadInfo();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.isSingleFilePage = function () {
            return $("#free_down_link").length > 0;
        };

        obj.isMultiFilePage = function () {
            return $("#table_files").length > 0;
        };

        obj.initDownloadInfo = function () {
            var url = runtime.getUrl();
            if (obj.isMultiFilePage()) {
                option.isOptionActive(option.constant.ctfile_page_list) && obj.initAlbumPage();
            }
            else if (obj.isSingleFilePage()) {
                $(function () {
                    option.isOptionActive(option.constant.ctfile_page_download) && obj.initDownloadPage();
                });
            }
        };

        obj.initAlbumPage = function () {
            // 禁用广告
            unsafeWindow._popup_ispoped = true;

            obj.initTableFile();
        };

        obj.initTableFile = function () {
            if ($("#table_files td a").not(".active").length) {
                var selector = $("#table_files td a").not(".active")[0];
                obj.queryTableFile(selector);

                if (option.isOptionActive(option.constant.ctfile_multi_link) && !$("#nd-links-container").length) {
                    $("#table_files_wrapper").prepend(`<div id="nd-links-container">
                        <p>批量下载（注意：由于网盘限制，只能同时下载一个文件；请先将迅雷同时下载最大任务数设为1，再复制链接批量下载；不要合并为任务组）</p>
                        <div style="height: 300px; overflow: auto;">
                            <textarea style="width:3800px; border: 1px solid #f2f2f2;" id="nd-links-textarea"></textarea>
                        </div>
                    </div>`);
                }
            }
            else {
                setTimeout(obj.initTableFile, 2000);
            }
        };

        obj.queryTableFile = function (selector) {
            var initFunc = function (timeout) {
                setTimeout(obj.initTableFile, timeout);
            };

            var $selector = $(selector);
            if ($selector.hasClass("active")) {
                initFunc(0);
                return;
            }
            else {
                $selector.addClass("active");
            }

            var url = $selector.attr("href");
            if (url.indexOf("/u/") == 0 || url.indexOf("/dir/") == 0) {
                initFunc(0);
            }
            else {
                obj.queryFileUrlPage(url, function (response) {
                    initFunc(100);

                    if (response && response.downurl) {
                        obj.updateLinks(response.fid, response.downurl);
                        $selector.attr("href", response.downurl);
                        $selector.css("color", "red");
                        $selector.attr("title", "右键使用迅雷或者IDM进行下载");
                    }
                });
            }
        };

        obj.updateLinks = function (fid, downurl) {
            obj.url_list[fid] = downurl;
            if (option.isOptionActive(option.constant.ctfile_multi_link)) {
                $("#nd-links-textarea").attr("rows", object.values(obj.url_list).length);
                $("#nd-links-textarea").val(object.values(obj.url_list).join("\n"));
            }
        };

        obj.initDownloadPage = function () {
            // 禁用广告
            unsafeWindow._popup_ispoped = true;

            obj.queryFileUrl(document.body.innerHTML, function (response) {
                if (response && response.downurl) {
                    var $downLink = $("#free_down_link");
                    $downLink.attr("href", response.downurl);
                    $downLink.find("em").css("color", "red");
                    $downLink.attr("title", "右键使用迅雷或者IDM进行下载");

                    // 兼容另一个脚本
                    setTimeout(function () {
                        $downLink.removeAttr("onclick");
                    }, 1000);
                }
            });
        };

        obj.queryFileUrlPage = function (url, callback) {
            obj.pageQuery(url, function (response) {
                if (response) {
                    obj.queryFileUrl(response, callback);
                }
                else {
                    callback && callback("");
                }
            });
        };

        obj.queryFileUrl = function (html, callback) {
            var uid = obj.parseUid(html);
            var fid = obj.parseFid(html);
            var chk = obj.parseChk($(html).find("#free_down_link").attr("onclick"));
            var code = "";
            var referer = runtime.getUrl();
            obj.downloadQuery(uid, fid, chk, code, referer, callback);
        };

        obj.parseUid = function (html) {
            var match = html.match(/uid=(\d+)/)
            if (match) {
                return match[1];
            }
        };

        obj.parseFid = function (html) {
            var match = html.match(/fid=(\d+)/)
            if (match) {
                return match[1];
            }
        };

        obj.parseChk = function (html) {
            if (html) {
                var match = html.match(/, '(\S+)',/);
                if (match) {
                    return match[1];
                }
            }
        };

        obj.pageQuery = function (url, callback) {
            http.ajax({
                type: "get",
                url: obj.getBase() + url,
                dataType: "text",
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.downloadQuery = function (uid, fid, chk, code, referer, callback) {
            var key = [uid, fid, chk].join("_");
            if (obj.response_cache.hasOwnProperty(key)) {
                callback && callback(obj.response_cache[key]);
            }
            else {
                var url = obj.getBase() + "/get_file_url.php?uid=" + uid + "&fid=" + fid + "&file_chk=" + chk + "&verifycode=" + code;
                http.ajax({
                    type: "get",
                    url: url,
                    dataType: "json",
                    headers: {
                        "Referer": referer
                    },
                    success: function (response) {
                        if (response && response.downurl) {
                            response.fid = fid;
                            obj.response_cache[key] = response;
                        }

                        callback && callback(response);
                    },
                    error: function (error) {
                        callback && callback("");
                    }
                });
            }
        };

        return obj;
    });

    container.define("app_dfpan", ["runtime", "option", "unsafe_window", "$"], function (runtime, option, unsafeWindow, $) {
        var obj = {};

        obj.run = function () {
            var url = runtime.getUrl();
            if (url.indexOf("page2.dfpan.com") > 0) {
                $(function () {
                    option.isOptionActive(option.constant.yunfile_page_download) && obj.initDownloadPage();
                });
                return true;
            }
            else {
                return false;
            }
        };

        obj.initDownloadPage = function () {
            setInterval(function () {
                unsafeWindow.CTAMAT = {};
            }, 100);

            $(".ad-layer").remove();
            $("#common_speed_down").click();
        };

        return obj;
    });

    container.define("app_newday", ["object", "meta", "config", "option", "env", "api", "share_log", "core", "$", "vue"], function (object, meta, config, option, env, api, shareLog, core, $, vue) {
        var obj = {};

        obj.run = function () {
            if (meta.existMeta("info")) {
                obj.initInfoPage();
                return true;
            }
            else if (meta.existMeta("option")) {
                obj.initOptionPage();
                return true;
            }
            else if (meta.existMeta("share")) {
                obj.initSharePage();
                return true;
            }
            else if (meta.existMeta("dev")) {
                obj.initDevPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initInfoPage = function () {
            new vue({
                el: "#container",
                data: {
                    info: env.getInfo()
                },
                mounted: function () {
                    obj.initAddonReady();
                }
            });
        };

        obj.initOptionPage = function () {
            new vue({
                el: "#container",
                data: {
                    app_id: config.getConfig("app_id"),
                    info: env.getInfo(),
                    option: option.getOption()
                },
                mounted: function () {
                    obj.initAddonReady();
                },
                watch: {
                    option: function (value) {
                        option.setOption(value);
                        api.logOption(value);
                    },
                    app_id: function (value) {
                        config.setConfig("app_id", value);
                        api.logOption({
                            app_id: value
                        });
                    }
                }
            });
        };

        obj.initSharePage = function () {
            var shareLogList = shareLog.getShareLogList();
            new vue({
                el: "#container",
                data: {
                    info: env.getInfo(),
                    list: []
                },
                mounted: function () {
                    obj.initAddonReady();

                    this.loadShareLogList("all");
                },
                methods: {
                    showShareLogList: function (source) {
                        $(".am-nav-tabs .am-active").removeClass("am-active");
                        $(".source-" + source).addClass("am-active");
                        this.loadShareLogList(source);
                    },
                    loadShareLogList: function (source) {
                        this.list = this.processShareLogList(source);
                    },
                    processShareLogList: function (source) {
                        var filterShareLogList = [];
                        object.keys(shareLogList).forEach(function (shareId) {
                            var item = shareLogList[shareId];
                            if (source == "all" || source == item.share_source) {
                                filterShareLogList.push({
                                    share_id: shareId,
                                    share_pwd: item.share_pwd,
                                    share_link: shareLog.buildShareLink(shareId, item.share_source, item.share_link),
                                    share_time: shareLog.buildShareTime(item.share_time),
                                    create_time: item.share_time
                                });
                            }
                        });
                        return filterShareLogList.sort(function (a, b) {
                            return b.create_time - a.create_time;
                        });
                    }
                }
            });
        };

        obj.initDevPage = function () {
            $("#dev-addon-info").val(JSON.stringify(env.getInfo()));

            $(".dev-open-page-option").addClass("nd-open-page-option").removeClass("dev-open-page-option");
            $(document).on("click", ".nd-open-page-option", function () {
                core.openOptionPage();
            });
        };

        obj.initAddonReady = function () {
            $("body").addClass("nd-addon-ready");
        };

        return obj;
    });

    container.define("app", ["runtime", "option", "logger", "meta", "api"], function (runtime, option, logger, meta, api, require) {
        var obj = {};

        obj.run = function () {
            var metaName = "status";
            if (meta.existMeta(metaName)) {
                logger.warn("setup already");
            }
            else {
                logger.info("setup success");

                // 添加meta
                meta.appendMeta(metaName);

                // 运行应用
                obj.runApp();
            }
        };

        obj.runApp = function () {
            var url = runtime.getUrl();
            logger.info(url);

            // 发送使用数据，以便做功能改进
            option.isOptionActive(option.constant.send_usage) && api.sendUsage(url);

            var appList = [
                {
                    name: "app_baidu",
                    matchs: [
                        "baidu.com"
                    ]
                },
                {
                    name: "app_weiyun",
                    matchs: [
                        "weiyun.com"
                    ]
                },
                {
                    name: "app_lanzous",
                    matchs: [
                        "lanzous.com"
                    ]
                },
                {
                    name: "app_weibo",
                    matchs: [
                        "weibo.com"
                    ]
                },
                {
                    name: "app_[ctfile|pipipan]",
                    matchs: [
                        "ctfile.com",
                        "pipipan.com"
                    ]
                },
                {
                    name: "app_dfpan",
                    matchs: [
                        "dfpan.com"
                    ]
                },
                {
                    name: "app_newday",
                    matchs: [
                        "*"
                    ]
                }
            ];
            for (var i in appList) {
                var app = appList[i];
                logger.debug(app);

                var match = obj.matchApp(url, app);
                logger.debug("match " + (match ? "yes" : "no"));

                if (match == false) {
                    continue;
                }

                logger.info("run " + app.name);
                if (require(app.name).run() == true) {
                    break;
                }
            }
        };

        obj.matchApp = function (url, app) {
            var match = false;
            app.matchs.forEach(function (item) {
                if (url.indexOf(item) > 0 || item == "*") {
                    match = true;
                }
            });
            return match;
        };

        return obj;
    });

    // lib
    container.define("$", [], function () {
        return window.$;
    });
    container.define("snap", [], function () {
        if (typeof Snap != "undefined") {
            return Snap;
        }
        else {
            return window.Snap;
        }
    });
    container.define("vue", [], function () {
        return window.Vue;
    });

    container.use(["core", "app", "logger", "share_log"], function (core, app, logger, shareLog) {

        // 日志级别
        logger.setLevel(logger.constant.info);

        core.ready(function () {
            app.run();
        });
    });
})();