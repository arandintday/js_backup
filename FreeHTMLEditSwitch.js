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
    var disable_button = document.createElement("button");
    f_menu.setAttribute("class", "f_menu");
    f_menu.setAttribute("style", "position:fixed;left:-4.5rem;bottom:1em;opacity:0.3;position:fixed;height:50px;width:5rem;border:1px dashed #999;background:#eee;text-align:center;transition: 0.5s;");
    //f_menu.setAttribute("onmouseover", "document.getElementsByClassName("f_menu")[0].left="-0.5rem";document.getElementsByClassName("f_menu")[0].opacity="1";");
    //f_menu.setAttribute("onmouseout", "document.getElementsByClassName(\"f_menu\")[0].left=\"4.5rem\";document.getElementsByClassName(\"f_menu\")[0].opacity=\"0.3\";");
    var enable_txt=document.createTextNode("Enable");
    var disable_txt=document.createTextNode("Disable");
    enable_button.appendChild(enable_txt);
    disable_button.appendChild(disable_txt);
    enable_button.setAttribute("onclick", "document.body.contentEditable='true'");
    disable_button.setAttribute("onclick", "document.body.contentEditable='false'");
    document.body.appendChild(f_menu);
    document.getElementsByClassName("f_menu")[0].appendChild(enable_button);
    document.getElementsByClassName("f_menu")[0].appendChild(disable_button);
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