// ==UserScript==
// @name         百度文库（wenku）在线下载PDF格式文件
// @namespace    http://ekozhan.com
// @version      0.1.8
// @description  百度文库文档页面打印PDF，chrome浏览器最好能安装一下 adblock 插件，下载后的pdf文件可以在 https://pdf2docx.com/zh/ 上转换成docx
// @author       eko.zhan, HelloCodeMing
// @match        *://wenku.baidu.com/view/*
// @grant        unsafeWindow
// @license      GPL-2.0
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// ==/UserScript==

!function(e){var o={};function t(r){if(o[r])return o[r].exports;var n=o[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}t.m=e,t.c=o,t.d=function(e,o,r){t.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,o){if(1&o&&(e=t(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var n in e)t.d(r,n,function(o){return e[o]}.bind(null,n));return r},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},t.p="",t(t.s=0)}([function(e,o){!function(){"use strict";function e(){$("div.reader-pic-item").each((function(e,o){var t=$(o)[0].style,r='<img src="'+t.backgroundImage.substring(5,t.backgroundImage.length-2)+'"/>';$(o)[0].style.backgroundImage=null;var n=document.createElement("p");$($(o)[0].attributes).each((function(e,o){$(n).attr(o.nodeName,o.nodeValue)})),$(n).append(r),$(o).parent().html(n)}))}window.setTimeout((function(){!function(){0==$("#btnPrintStyle").length&&$("head").append(['<style id="btnPrintStyle">',".ez-btn{position:relative;border:1px solid #19A97B;border-radius: 3px;background: transparent;color:#19A97B;margin-left:10px;font-size: 14px;}",".ez-btn:hover{border: 1px solid #0F6649;color:#0F6649;}",".ez-btn[title]:hover:after {content: attr(_title);position: absolute;top: -4px;left: 105%;min-width: 100px;max-width: 300px; padding: 4px 10px;background: #000000;color: #ffffff;border-radius: 4px;text-align:left;z-index:2018;}",".ez-panel{z-index:2018;display:none;position: absolute;width: 300px;font-size:14px;background: #ffffff;color: #19A97B;  border-radius: 4px;  border: 1px solid #19A97B;  padding: 6px;  margin: 2px;}","#doc-header-test .doc-value{margin-right: 10px !important;padding-right: 10px;}","</style>"].join(" "));$(".qrHover").append('<button class="ez-btn">免费下载</button>'),$("body").append(['<div class="ez-panel">',"常见问题：<br/>",'1、<a href="https://greasyfork.org/zh-CN/forum/discussion/46222/x" target="_blank">点击免费下载后，如何打印成pdf文件？</a>','<br/>2、<a href="https://greasyfork.org/zh-CN/forum/discussion/44509/x" target="_blank">文字重叠重影该如何解决？</a>','<br/>3、<a href="https://greasyfork.org/zh-CN/forum/discussion/47744/x" target="_blank">图片空白，或者图片只有一半的情况如何处理？</a>','<br/>4、<a href="https://greasyfork.org/zh-CN/forum/discussion/46249/x" target="_blank">页数超过100页的文档该如何打印成pdf？</a>','<br/>5、<a href="https://greasyfork.org/zh-CN/forum/discussion/47743/x" target="_blank">打印出来的pdf文件里文字断裂，或者图片表格上下页分开如何处理？</a>',"<div>"].join(""));var o=null;$(".ez-btn").hover((function(){$(".ez-panel").css({top:$(".ez-btn").offset().top+"px",left:$(".ez-btn").offset().left+70+"px"}).show()}),(function(){o&&window.clearTimeout(o),o=window.setTimeout((function(){$(".ez-panel").hide()}),1e4)})),$(".ez-btn").click((function(){!function(){$(".ez-panel").remove(),$("head").find("link").each((e,o)=>{-1!=$(o).attr("href").indexOf("/common_toc/common/style/main")&&$(o).remove()}),$(".moreBtn").click(),$(".aside").remove(),$("#doc #hd").remove(),$(".crubms-wrap").remove(),$(".user-bar").remove(),$("#doc-header").remove(),$(".reader-tools-bar-wrap").remove(),$(".fix-searchbar-wrap").remove(),$("#bottom-doc-list-8").remove(),$(".ft").remove(),$("#ft").remove(),$("#docBubble").remove(),$(".hd").remove(),$(".wk-other-new-cntent").remove(),$("#html-reader-go-more").remove(),$(".new-wm").remove(),$("#bottom-download").remove(),$("#pay-page").remove(),$(".banner-wrap").remove(),$("#next_doc_box").remove(),$(".high-quality-doc").remove(),$(".new-ico-wkmember-free-doc").remove(),$(".doc-tag-pay-normal").remove(),$(".doc-tag-professional").remove(),$(".doc-tag-pay-discount").remove(),$(".doc-tag-ticket").remove(),$("#activity-tg").remove(),$("body").attr("margin","auto"),$(".bd").attr("style","height:1262.879px"),$(".reader-page").css({border:0}),$(".doc_bottom_wrap").remove(),jQuery.fn.extend({remove:function(){return!1}});var o=document.body.scrollHeight,t=0,r=window.setInterval((function(){$(window).scrollTop(t),t+=700,o=document.body.scrollHeight,t>o&&(window.clearInterval(r),e(),window.setTimeout((function(){window.print()}),3e3))}),300)}()})),$("body").mousedown((function(o){return 2==o.button&&e(),!0}))}()}),300)}()}]);