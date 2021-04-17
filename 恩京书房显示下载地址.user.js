// ==UserScript==
// @name         恩京书房显示下载地址
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  在恩京书房显示被隐藏的下载地址
// @author       VoidReactor
// @include             *enjing.com/*
// @grant        none
// @license      GPL-3.0
// @Catch the koishi      https://reurl.cc/Y6noKL
// @passwd is koishi but in memory
// ==/UserScript==

(function() {
    'use strict';
var url = window.location.href;
var bookid = url.replace(/[^0-9]/ig,"");
var blk=document.createElement("div");
blk.setAttribute("class", "d_block");
blk.setAttribute("style", "position:relative;height:80px;width:100%;border:1px dashed #999;background:#eee;text-align:center;");
var text=document.createElement("a");
var textnode2=document.createTextNode("下载地址：");
text.appendChild(textnode2);
text.setAttribute("style", "position:relative;font-size:20px;color:#AB2524;TEXT-DECORATION:none;top:30%;");
var addr=document.createElement("button");
var textnode=document.createTextNode("点我下载");
addr.appendChild(textnode);
addr.setAttribute("onclick", "window.open('https://www.enjing.com/download.php?id="+bookid+"')");
addr.setAttribute("style", "position:relative;height:30px;width:80px;top:30%;");
document.getElementsByClassName("describe")[0].appendChild(blk);
document.getElementsByClassName("d_block")[0].appendChild(text);
document.getElementsByClassName("d_block")[0].appendChild(addr);
})();