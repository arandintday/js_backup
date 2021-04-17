// ==UserScript==
// @name         知乎网页助手
// @namespace    zhihu_helper_tool
// @version      1.0.8
// @description  功能介绍：1、知乎站外链接直接跳转至目标网址；2、自动展开问题全部信息，同时展示所有回答；3、去除知乎网页中的广告；4、知乎网页中短视频下载；5、解除知乎复制限制-划词复制（鼠标左键划词自动添加到剪切板）；6、去除烦人的登录提示；7、自动高清图片显示【注：支持Tampermonke4.0以上版本】【这可能是功能最全面的知乎助手了】;8：增加优惠券查询功能
// @author       broom，王超
// @icon		 data:image/ico;base64,AAABAAIAEBAAAAEAIAAoBQAAJgAAACAgAAABACAAKBQAAE4FAAAoAAAAEAAAACAAAAABACAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAA6IYLxOuIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/6IYLxOuIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO//jWuP/xq2b/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64kQ/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7///////bJn//riA7/64gO//GrZv/riA7/64kQ///////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO//CoX//+/fz/64gO/++gUP//////64oX///////riA7/////////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7///////bQrf//////8rFx/+uKF///////64kT/+uIDv/riA7//////+uIDv/riA7/64gO/+uIDv/riA7/64gO//K3fv//////8rV7/+uIDv/rihf//////+uJE//riA7/64gO///////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7//////+uIDv/riA7/64oX///////riRD/64gO/+uJEP//////64gO/+uIDv/riA7/64gO//vo2P///////////////////////////+uKF///////64kQ/+uIDv/riRD//////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv//////64gO/+uIDv/rihf//////+uIDv/riA7/64kT///////riA7/64gO/+uIDv/riA7/7ZU1/+uMHf/riRP//////+uJE//riA7/64oX///////riA7/64gO/+uKFf//////64gO/+uIDv/riA7/64gO//3z6//xrWv/64sY///////riA7/64gO/+uKF///////64oV/+uKFf/rjBv//////+uIDv/riA7/64gO/+uIDv/0wZD//v39//7+/v/+/v7//v7+///////rihf////////////////////////////riA7/64gO/+uIDv/riA7/7ZU1///////wp17/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/voVH/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/6IYLxOuIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/6IYLxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAIAAAAEAAAAABACAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAA5oQGSemGC+PriA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/6YYL4+aEBknphgvj64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/6YYL4+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/9cec//76+P/76tv/87yH/+uJEP/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/++dRv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/9suk////////////9tCu/+uIDv/riA7/64gO/+uIDv/riA7/64gO/++iU//riA7/64gO/+uIDv/riA7/+uLM//rizP/tlTT/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/99W2////////////8a1r/+uIDv/riA7/64gO/+uIDv/zvIf/+d7G/+uIDv/riA7/64gO/+uLGv/++/n///////328f/xsG7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/rjB3/++ze///////87uL/64kQ/+uIDv/riA7/8Kdd//79/P/64Mn/64gO/+uMH//////////////////76dn/////////////////////////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/vpFj//v7+///////xsG7/64gO/+6XO//99vD///////TClP/riA7/64wf/////////////////+2WOf/wqF///O/j///////////////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/42sD///////ncwv/sjSH/++rb///////64Mr/64kT/+uIDv/rjB/////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv///////////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/++kVf///////vr4//nbwP//////++zf/+yPJf/riA7/64gO/+uMH////////////+uIDv/riA7/64gO/+uIDv/riA7/64gO////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO//zu4v//////+uDJ//3z6//ulzv/64gO/+uIDv/riA7/64wf////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/9s2o///////2yJ7/7I0h/+uIDv/riA7/64gO/+uIDv/rjB/////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv///////////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/ysXP///////rgyf/riA7/64gO/+uIDv/riA7/64gO/+uMH////////////+uIDv/riA7/64gO/+uIDv/riA7/64gO////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/++gUP///////PDl/+uIDv/riA7/64gO/+uIDv/riA7/64wf////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO//K3ff////////////////////////////////////////////////////////////328P/rjB/////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv///////////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/7I4k//zx5///////////////////////////////////////////////////////+dzB/+uMH////////////+uIDv/riA7/64gO/+uIDv/riA7/64gO////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/++vj//////+yNIf/riA7/64gO/+uIDv/riA7/64wf////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO//338v//////7ZQy/+uIDv/riA7/64gO/+uIDv/rjB/////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv///////////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/751I/+2TL//riA7/64gO/+uIDv/riA7//fXt///////umD7/64gO/+uIDv/riA7/64gO/+uMH////////////+uIDv/riA7/64gO/+uIDv/riA7/64gO////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/xrm3//v38//XEl//riA7/64gO/+uIDv/98un//////++dRv/riA7/64gO/+uIDv/riA7/64wf////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uJEP/87+P///////GrZv/riA7/64gO//zv5P//////755L/+uIDv/riA7/64gO/+uIDv/rjB/////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv///////////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO//TAj///////+Ne5/+uKFf/rihX//O7h///////volP/64oV/+uKFf/rihX/64gO/+uMH////////////+uIDv/riA7/64gO/+uIDv/riA7/64gO////////////64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/7ZQy//79/f/////////////////////////////////////////////////yt37/64wf///////////////////////////////////////////////////////riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/+uHL/////////////////////////////////////////////v38/++fTP/rjB///////////////////////////////////////////////////////+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/zuYP///////bOqv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+yPJ//99/L//fPr/+uJE//riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/++kVf/65tb/8Kpk/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/6YYL4+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+mGC+PmhAZJ6YYL4+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/riA7/64gO/+uIDv/phgvj5oQGSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @match        https://*.zhihu.com/*
// @match        https://v.vzuu.com/video/*
// @match        https://video.zhihu.com/video/*
// @match        *://item.taobao.com/*
// @match        *://*detail.tmall.com/*
// @match        *://*detail.tmall.hk/*
// @match        *://*product.suning.com/*
// @match        *://*item.jd.com/*
// @match        *://*detail.vip.com/*
// @match        *://*mobile.yangkeduo.com/goods*
// @connect      zhihu.com
// @connect      vzuu.com
// @connect      t.mimixiaoke.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @run-at       document-end
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @charset		 UTF-8
// ==/UserScript==

(function() {
    'use strict';
    if(window.top != window.self){
		return;
	}
	var window_url = window.location.href;
    var website_host = window.location.host;
    
   	var zhihuHelper={};
   	zhihuHelper.start = function(){
   	    if(website_host == "link.zhihu.com"){  //直接跳转到目标网页
   	    	var regRet = location.search.match(/target=(.+?)(&|$)/);
   	    	if(regRet && regRet.length==3){
   	    		location.href = decodeURIComponent(regRet[1]);
   	    	}
   		}
   	    //知乎正文
   	    else if(website_host.indexOf("zhihu.com")!=-1){
   	    	//问题全部展开
   		    function autoExpandQuestionInfo() {
   		        //展开问题描述
   		        const s4 = document.querySelector('.QuestionRichText-more');
   		        if (s4) {
   		            s4.click();
   		        }
   		        const s0 = document.querySelector('.SignContainer-content');
   			    if (s0) {
   			        const s1 = document.querySelector('.Modal-backdrop');
   			        if (s1) {
   			            s1.click();
   			        }
   			        const s2 = document.querySelector('.Modal-closeButton');
   			        if (s2) {
   			            s2.click();
   			        }
   		        }
   		    }
   		    
   		    //去除广告，可能造成误伤，用最小策略
   		    function clearAdvert() {
   		    	const ad1 = document.querySelector('.AppBanner');
   		        if (ad1) {
   		            ad1.style.display = "none";
   		        }
   		        const ad2 = document.querySelector('.AdblockBanner');
   		        if (ad2) {
   		            ad2.style.display = "none";
   		        }
   		    }
   	        
   	        //去除登录提示
   	        function noLoginBox(){
   				var IntervalUnit = 20;
   				var totalIntervalMs = 0;
   				var loginInterval = setInterval(function(){
   					$(".Modal-wrapper").hide();
   					$(".signFlowModal").children(".Modal-closeButton").click();
   					totalIntervalMs += IntervalUnit;
   					if(totalIntervalMs >= 2000){  //循环多次，我就不信还显示
   						clearInterval(loginInterval);
   					}
   				}, IntervalUnit); 
   				$(".AppHeader-login").click(function(){
   					clearInterval(loginInterval);
   					$(".Modal-wrapper").show();
   				});
   	        }
   		    
   		    //更改为直接高清显示
   		    function changeHeightQualityPic(){
   		    	$("body").find("img").each(function(){
   		    		var dataoriginal = $(this).attr("data-original");
   		    		if(!!dataoriginal){
   		    			$(this).attr("src", dataoriginal);
   		    		}
   		    	});
   		    }
   		    
   		    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
   		    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
   		    function timeFormat(time, fmt) { //author: meizz 
   		        var o = {
   		            "M+": time.getMonth() + 1, //月份 
   		            "d+": time.getDate(), //日 
   		            "h+": time.getHours(), //小时 
   		            "m+": time.getMinutes(), //分 
   		            "s+": time.getSeconds(), //秒 
   		            "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
   		            "S": time.getMilliseconds() //毫秒 
   		        };
   		        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
   		        for (var k in o)
   		            if (new RegExp("(" + k + ")").test(fmt))
   		                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
   		        return fmt;
   		    }
   		    
   		    function questiodate() {
   		        function QuestionPage() {
   		            const title = document.querySelector(".QuestionPage");
   		            if (title) {
   		                const dateCreated = title.querySelector("[itemprop~=dateCreated][content]").content;
   		                const dateModified = title.querySelector("[itemprop~=dateModified][content]").content;
   		
   		                const ctime = timeFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
   		                const mtime = timeFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");
   		                const side = title.querySelector(".QuestionHeader-side");
   		                var timediv = document.createElement('div');
   		                timediv.innerHTML = `<p>创建于:&nbsp;${ctime}</p><p>编辑于:&nbsp;${mtime}</p>`;
   		                timediv.style.cssText = 'color:#999;font-size:12;';
   		                side.appendChild(timediv);
   		            }
   		        }
   		
   		        let listnum = 0;
   		        function ContentItem() {
   		            const list = document.querySelectorAll(".ContentItem");
   		            if (listnum != list.length) {
   		                listnum = list.length;
   		                for (var i = 0; i < list.length; i++) {
   		                    const item = list[i];
   		                    if (item.getAttribute('zh_date_mk') != 'true') {
   		                        const dateCreated = item.querySelector("[itemprop~=dateCreated][content]").content;
   		                        const dateModified = item.querySelector("[itemprop~=dateModified][content]").content;
   		
   		                        const ctime = timeFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
   		                        const mtime = timeFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");
   		
   		                        const sideitem = item.querySelector(".css-h5al4j");
   		                        var timediv = document.createElement('span');
   		                        timediv.innerHTML = `<p>创建于:&nbsp;${ctime}&nbsp;&nbsp;&nbsp;编辑于:&nbsp;${mtime}</p>`;
   		                        timediv.class = "Voters";
   		                        timediv.style.cssText = 'color:#999;display:block;padding:5px 0px;';
   		                        sideitem.appendChild(timediv);
   		                        item.setAttribute('zh_date_mk', 'true');
   		                    }
   		                }
   		            }
   		        }
   		        QuestionPage();
   		        document.querySelector(".Question-main").addEventListener('DOMNodeInserted', ContentItem);
   		    }
   		     
   		    if(window_url.indexOf("https://www.zhihu.com/question/") != -1) {
   		        autoExpandQuestionInfo();     //问题全部展开
   	    		questiodate();     //问题日期
   		    }
   		   
   		    noLoginBox();   //去除登录框
   		    setInterval(clearAdvert, 1000);  //去除广告
   		   	setInterval(changeHeightQualityPic, 500);   //图片自动高清
   		}
   	};
   	zhihuHelper.start();
	
	var quanGoodsCouponHelper={};
	quanGoodsCouponHelper.getPlatform=function(){
		var couponUrl = window.location.href;
		var platform="";
		if(couponUrl.indexOf("suning.com")!=-1){
			platform = "suning";
		}else if(couponUrl.indexOf("detail.tmall")!=-1){
			platform = "tmall";
		}else if(couponUrl.indexOf("item.taobao.com")!=-1){
			platform = "taobao";
		}else if(couponUrl.indexOf("item.jd.com")!=-1){
			platform = "jd";
		}else if(couponUrl.indexOf("detail.vip.com")!=-1){
			platform = "vpinhui";
		}else if(couponUrl.indexOf("mobile.yangkeduo.com")!=-1){
			platform = "pdd";
		}
		return platform;
	}
	quanGoodsCouponHelper.filterStr = function(str){
		if(!str) return "";
		str = str.replace(/\t/g,"");
		str = str.replace(/\r/g,"");
		str = str.replace(/\n/g,"");
		str = str.replace(/\+/g,"%2B");//"+"
		str = str.replace(/\&/g,"%26");//"&"
		str = str.replace(/\#/g,"%23");//"#"
		return encodeURIComponent(str)
	};
	quanGoodsCouponHelper.getGoodsData=function(platform){
		var goodsId = "";
		var goodsName = "";
		var websiteUrl = window.location.href;
		if(platform=="taobao"){
			goodsId = this.getQueryString("id");
			goodsName=$(".tb-main-title").text();
			
		}else if(platform=="tmall"){
			goodsId = this.getQueryString("id");
			goodsName=$(".tb-detail-hd").text();
			
		}else if(platform=="jd"){
			goodsName=$("div.sku-name").text();
			goodsId = this.getQueryStringByUrl(websiteUrl);
			
		}else if(platform=="suning"){
			var text = $("#itemDisplayName").text();
			if(!!text){
				text = text.replace("苏宁超市","");
				text = text.replace("自营","");
			}
			goodsName=text;
			goodsId = this.getQueryStringByUrl(websiteUrl);
			
		}else if(platform=="vpinhui"){
			goodsId = this.getQueryStringByUrl(websiteUrl).replace("detail-","");
			goodsName = $(".pib-title-detail").text();
			
		}else if(platform=="pdd"){
			goodsId = this.getQueryString("goods_id");
			goodsName = $(".enable-select").text();
		}
		var data={"goodsId":goodsId, "goodsName":this.filterStr(goodsName)}
		return data;
	};
	quanGoodsCouponHelper.createHtml = function(platform, goodsId, goodsName){
		if(!platform || !goodsId) return;
		var quanGoodsCouponHelperUrl = "https://t.mimixiaoke.com/api/plugin/hit/v2?script=4&";
		if(platform!="vpinhui"){
			quanGoodsCouponHelperUrl = quanGoodsCouponHelperUrl+"platform="+platform+"&id="+goodsId+"&q="+goodsName;
		}else{
			var vip = goodsId.split("-");
			var vaddition = vip[0];
			var vid = vip[1];
			quanGoodsCouponHelperUrl = quanGoodsCouponHelperUrl+"platform="+platform+"&id="+vid+"&q="+goodsName+"&addition="+vaddition;
		}		
		GM_xmlhttpRequest({
			url: quanGoodsCouponHelperUrl,
		  	method: "GET",
		  	headers: {"Content-Type": "application/x-www-form-urlencoded"},
		  	onload: function(response) {
				var status = response.status;
				if(status==200||status=='200'){
					var serverResponseJson = JSON.parse(response.responseText);
					var data = serverResponseJson.data;
					var cssText = data.css;
					var htmlText = data.html;
					var handler = data.handler;
					if(!cssText || !htmlText || !handler){
						return;
					}
					$("body").prepend("<style>"+cssText+"</style>");
					var handlers = handler.split("@");
					for(var i=0; i<handlers.length; i++){
						var $handler = $(""+handlers[i]+"");
						if(platform=="taobao"){
							$handler.parent().after(htmlText);
						}else if(platform=="tmall"){
							$handler.parent().after(htmlText);
						}else if(platform=="jd"){
							$handler.after(htmlText);
						}else if(platform=="suning"){
							$handler.parent().after(htmlText);
						}else if(platform=="vpinhui"){
							$handler.parent().after(htmlText);
						}else if(platform=="pdd"){
							$handler.after(htmlText);
						}					
					}
				}
		  	}
		});
	};
	quanGoodsCouponHelper.getQueryString = function(tag) {
		var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
		var a = window.location.search.substr(1).match(t);
		if (a != null) return a[2];
		return "";
	};
	quanGoodsCouponHelper.getQueryStringByUrl = function(url) {
		if(url.indexOf("?")!=-1){
			url = url.split("?")[0]
		}
		if(url.indexOf("#")!=-1){
			url = url.split("#")[0]
		}
		var splitText = url.split("/");
		var idText = splitText[splitText.length-1];
		idText = idText.replace(".html","");
		return idText;
	};
	quanGoodsCouponHelper.start = function(){
		var platform = this.getPlatform();
		if(!platform) return;
		var delayMS = 0;
		if(platform=="vpinhui"){ //唯品会采用了异步加载
			var vipInterval = setInterval(function(){
				if($(".pib-title-detail").length!=0 || delayMS>=1200){
					var goodsData = quanGoodsCouponHelper.getGoodsData(platform);
					quanGoodsCouponHelper.createHtml(platform, goodsData.goodsId, goodsData.goodsName);
					clearInterval(vipInterval)
				}
				delayMS+=100;
			},100);
		}else{
			var goodsData = quanGoodsCouponHelper.getGoodsData(platform);
			quanGoodsCouponHelper.createHtml(platform, goodsData.goodsId, goodsData.goodsName);
		}
	};	
	quanGoodsCouponHelper.start();
})();
/**
 * 避免重复造轮子
 * 集成插件：下载知乎视频
 * greasyfork地址：https://greasyfork.org/zh-CN/scripts/39206
 * 版本：V1.18
 * */
(async () => {
    if (window.location.host == 'www.zhihu.com') return;

    const playlistBaseUrl = 'https://lens.zhihu.com/api/videos/';
    //const videoBaseUrl = 'https://video.zhihu.com/video/';
    const videoId = window.location.pathname.split('/').pop(); // 视频id
    const menuStyle = 'transform:none !important; left:auto !important; right:-0.5em !important;';
    const playerId = 'player';
    const coverSelector = '#' + playerId + ' > div:first-child > div:first-child > div:nth-of-type(2)';
    const controlBarSelector = '#' + playerId + ' > div:first-child > div:first-child > div:last-child > div:last-child > div:first-child';
    const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>';
    let player = document.getElementById(playerId);
    let resolutionMap = {'标清': 'sd', '高清': 'ld', '超清': 'hd'};
    let videos = []; // 存储各分辨率的视频信息
    let downloading = false;

    function getBrowerInfo() {
        let browser = (function (window) {
            let document = window.document;
            let navigator = window.navigator;
            let agent = navigator.userAgent.toLowerCase();
            // IE8+支持.返回浏览器渲染当前文档所用的模式
            // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
            // IE10:10(兼容模式7||8||9)
            let IEMode = document.documentMode;
            let chrome = window.chrome || false;
            let system = {
                // user-agent
                agent: agent,
                // 是否为IE
                isIE: /trident/.test(agent),
                // Gecko内核
                isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
                // webkit内核
                isWebkit: agent.indexOf('webkit') > 0,
                // 是否为标准模式
                isStrict: document.compatMode === 'CSS1Compat',
                // 是否支持subtitle
                supportSubTitle: function () {
                    return 'track' in document.createElement('track');
                },
                // 是否支持scoped
                supportScope: function () {
                    return 'scoped' in document.createElement('style');
                },

                // 获取IE的版本号
                ieVersion: function () {
                    let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
                    let match = rMsie.exec(agent);
                    try {
                        return match[2];
                    } catch (e) {
                        return IEMode;
                    }
                },
                // Opera版本号
                operaVersion: function () {
                    try {
                        if (window.opera) {
                            return agent.match(/opera.([\d.]+)/)[1];
                        }
                        else if (agent.indexOf('opr') > 0) {
                            return agent.match(/opr\/([\d.]+)/)[1];
                        }
                    } catch (e) {
                        return 0;
                    }
                }
            };

            try {
                // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
                system.type = system.isIE ? 'IE' :
                    window.opera || (agent.indexOf('opr') > 0) ? 'Opera' :
                        (agent.indexOf('chrome') > 0) ? 'Chrome' :
                            //safari也提供了专门的判定方式
                            window.openDatabase ? 'Safari' :
                                (agent.indexOf('firefox') > 0) ? 'Firefox' :
                                    'unknow';

                // 版本号
                system.version = (system.type === 'IE') ? system.ieVersion() :
                    (system.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[1] :
                        (system.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[1] :
                            (system.type === 'Opera') ? system.operaVersion() :
                                (system.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[1] :
                                    '0';

                // 浏览器外壳
                system.shell = function () {
                    if (agent.indexOf('edge') > 0) {
                        system.version = agent.match(/edge\/([\d.]+)/)[1] || system.version;
                        return 'Edge';
                    }
                    // 遨游浏览器
                    if (agent.indexOf('maxthon') > 0) {
                        system.version = agent.match(/maxthon\/([\d.]+)/)[1] || system.version;
                        return 'Maxthon';
                    }
                    // QQ浏览器
                    if (agent.indexOf('qqbrowser') > 0) {
                        system.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || system.version;
                        return 'QQBrowser';
                    }
                    // 搜狗浏览器
                    if (agent.indexOf('se 2.x') > 0) {
                        return '搜狗浏览器';
                    }

                    // Chrome:也可以使用window.chrome && window.chrome.webstore判断
                    if (chrome && system.type !== 'Opera') {
                        let external = window.external;
                        let clientInfo = window.clientInformation;
                        // 客户端语言:zh-cn,zh.360下面会返回undefined
                        let clientLanguage = clientInfo.languages;

                        // 猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                        if (external && 'LiebaoGetVersion' in external) {
                            return 'LBBrowser';
                        }
                        // 百度浏览器
                        if (agent.indexOf('bidubrowser') > 0) {
                            system.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                                agent.match(/chrome\/([\d.]+)/)[1];
                            return 'BaiDuBrowser';
                        }
                        // 360极速浏览器和360安全浏览器
                        if (system.supportSubTitle() && typeof clientLanguage === 'undefined') {
                            let storeKeyLen = Object.keys(chrome.webstore).length;
                            let v8Locale = 'v8Locale' in window;
                            return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                        }
                        return 'Chrome';
                    }
                    return system.type;
                };

                // 浏览器名称(如果是壳浏览器,则返回壳名称)
                system.name = system.shell();
                // 对版本号进行过滤过处理
                // System.version = System.versionFilter(System.version);

            } catch (e) {
                // console.log(e.message);
            }

            return system;

        })(window);

        if (browser.name == undefined || browser.name == '') {
            browser.name = 'Unknown';
            browser.version = 'Unknown';
        }
        else if (browser.version == undefined) {
            browser.version = 'Unknown';
        }
        return browser;
    }

    function fetchRetry(url, options = {}, times = 1, delay = 1000, checkStatus = true) {
        return new Promise((resolve, reject) => {
            // fetch 成功处理函数
            function success(res) {
                if (checkStatus && !res.ok) {
                    failure(res);
                }
                else {
                    resolve(res);
                }
            }

            // 单次失败处理函数
            function failure(error) {
                times--;

                if (times) {
                    setTimeout(fetchUrl, delay);
                }
                else {
                    reject(error);
                }
            }

            // 总体失败处理函数
            function finalHandler(error) {
                throw error;
            }

            function fetchUrl() {
                return fetch(url, options)
                    .then(success)
                    .catch(failure)
                    .catch(finalHandler);
            }

            fetchUrl();
        });
    }

    // 下载指定url的资源
    async function downloadUrl(url, name = (new Date()).valueOf() + '.mp4') {
        let browser = getBrowerInfo();

        // Greasemonkey 需要把 url 转为 blobUrl
        if (GM_info.scriptHandler == 'Greasemonkey') {
            let res = await fetchRetry(url);
            let blob = await res.blob();
            url = URL.createObjectURL(blob);
        }

        // Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
        if (window.GM_download) {
            GM_download({url, name});
        }
        else {
            // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
            let a = document.createElement('a');
            a.href = url;
            a.download = name;
            // a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 100);
        }
    }

    function humanSize(size) {
        let n = Math.log(size) / Math.log(1024) | 0;
        return (size / Math.pow(1024, n)).toFixed(0) + ' ' + (n ? 'KMGTPEZY'[--n] + 'B' : 'Bytes');
    }

    if (!player) return;

    // 获取视频信息
    const res = await fetchRetry(playlistBaseUrl + videoId, {
        headers: {
            'referer': 'refererBaseUrl + videoId',
            'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20' // in zplayer.min.js of zhihu
        }
    }, 3);
    const videoInfo = await res.json();

    // 获取不同分辨率视频的信息
    for (let [key, video] of Object.entries(videoInfo.playlist)) {
        video.name = key;

        if (!videos.find(v => v.width == video.width)) {
            videos.push(video);
        }
    }

    // 按分辨率大小排序
    videos = videos.sort(function (v1, v2) {
        return v1.width == v2.width ? 0 : (v1.width > v2.width ? 1 : -1);
    }).reverse();

    document.addEventListener('DOMNodeInserted', (evt) => {
        let domControlBar = evt.relatedNode.querySelector(':scope > div:last-child > div:first-child');
        if (!domControlBar || domControlBar.querySelector('.download')) return;

        let domFullScreenBtn = domControlBar.querySelector(':scope > div:nth-last-of-type(1)');
        let domResolutionBtn = domControlBar.querySelector(':scope > div:nth-last-of-type(3)');
        let domDownloadBtn, defaultResolution, buttons;
        if (!domFullScreenBtn || !domFullScreenBtn.querySelector('button')) return;

        // 克隆分辨率菜单或全屏按钮为下载按钮
        domDownloadBtn = (domResolutionBtn && (domResolutionBtn.className == domFullScreenBtn.className))
            ? domResolutionBtn.cloneNode(true)
            : domFullScreenBtn.cloneNode(true);

        defaultResolution = domDownloadBtn.querySelector('button').innerText;

        // 生成下载按钮图标
        domDownloadBtn.querySelector('button:first-child').outerHTML = domFullScreenBtn.cloneNode(true).querySelector('button').outerHTML;
        domDownloadBtn.querySelector('svg').innerHTML = svgDownload;
        domDownloadBtn.className = domDownloadBtn.className + ' download';

        buttons = domDownloadBtn.querySelectorAll('button');

        // button 元素添加对应的下载地址
        buttons.forEach(dom => {
            let video = videos.find(v => v.name == resolutionMap[dom.innerText || defaultResolution]);
            video = video || videos[0];
            dom.dataset.video = video.play_url;
            if (dom.innerText) {
                (dom.innerText = `${dom.innerText} (${humanSize(video.size)})`);
            }
            else if (buttons.length == 1) {
                dom.nextSibling.querySelector('div').innerText = humanSize(video.size);
            }
        });

        // 鼠标事件 - 显示菜单
        domDownloadBtn.addEventListener('pointerenter', () => {
            let domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
            if (domMenu) {
                domMenu.style.cssText = menuStyle + 'opacity:1 !important; visibility:visible !important';
            }
        });

        // 鼠标事件 - 隐藏菜单
        domDownloadBtn.addEventListener('pointerleave', () => {
            let domMenu = domDownloadBtn.querySelector('div:nth-of-type(1)');
            if (domMenu) {
                domMenu.style.cssText = menuStyle;
            }
        });

        // 鼠标事件 - 选择菜单项
        domDownloadBtn.addEventListener('pointerup', event => {
            if (downloading) {
                alert('当前正在执行下载任务，请等待任务完成。');
                return;
            }

            let e = event.srcElement || event.target;

            while (e.tagName != 'BUTTON') {
                e = e.parentNode;
            }

            downloadUrl(e.dataset.video);
        });

        // 显示下载按钮
        domControlBar.appendChild(domDownloadBtn);

    });
})();