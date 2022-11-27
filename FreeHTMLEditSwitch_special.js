// ==UserScript==
// @name         FreeHTMLEditSwitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sussybaka
// @include        http://*
// @include        https://*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var f_menu = document.createElement("div");
    var enable_button = document.createElement("button");
    var enable_button2 = document.createElement("button");
    var disable_button = document.createElement("button");
    var disable_button2 = document.createElement("button");
    f_menu.setAttribute("class", "f_menu");
    f_menu.setAttribute("style", "position:fixed;left:-4.5rem;bottom:1em;opacity:0.3;position:fixed;height:8rem;width:5rem;border:1px dashed #999;background:#eee;text-align:center;transition: 0.5s;");
    var enable_txt=document.createTextNode("Enable1");
    var enable_txt2=document.createTextNode("Enable2");
    var disable_txt=document.createTextNode("Disable");
    var disable_txt2=document.createTextNode("Disable2");
    enable_button.appendChild(enable_txt);
    enable_button2.appendChild(enable_txt2);
    disable_button.appendChild(disable_txt);
    disable_button2.appendChild(disable_txt2);
//    enable_button.setAttribute("onclick", "document.body.contentEditable='true'");
//    disable_button.setAttribute("onclick", "document.body.contentEditable='false'");
    document.body.appendChild(f_menu);
    document.getElementsByClassName("f_menu")[0].appendChild(enable_button);
    document.getElementsByClassName("f_menu")[0].appendChild(enable_button2);
    document.getElementsByClassName("f_menu")[0].appendChild(disable_button);
    document.getElementsByClassName("f_menu")[0].appendChild(disable_button2);
	enable_button.addEventListener('click', function(){
		document.getElementById("hs-list").contentEditable='true';
		document.getElementById("hs-content").contentEditable='true';
    });
    enable_button2.addEventListener('click', function(){
        document.getElementsByClassName("list-container")[0].setAttribute("contentEditable", "true");
    });
	disable_button.addEventListener('click', function(){
		document.getElementById("hs-list").contentEditable='false';
		document.getElementById("hs-content").contentEditable='false';
    });
    disable_button2.addEventListener('click', function(){
        document.getElementsByClassName("list-container")[0].setAttribute("contentEditable", "false");
    });
    f_menu.addEventListener('mouseover', function(){
        this.style.left="-0.5rem";
        this.style.opacity="1";
        console.log("movein!");
    });
    f_menu.addEventListener('mouseout', function(){
        this.style.left="-4.5rem";
        this.style.opacity="0.3";
        console.log("moveout!");
    });
    // Your code here...
})();