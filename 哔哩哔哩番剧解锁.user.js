// ==UserScript==
// @name              哔哩哔哩番剧解锁大会员,B站视频下载
// @namespace          mai
// @version            0.1
// @description       哔哩哔哩番剧解锁大会员,B站视频下载，集合了优酷、爱奇艺、腾讯等全网VIP视频免费破解去广告.
// @author            die
// @namespace         https://greasyfork.org/users/675916
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match             *://v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://www.iqiyi.com/v*
// @match             *://v.youku.com/v_show/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://video.tudou.com/v/*
// @match             *://v.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://www.fun.tv/vplay/*
// @match             *://www.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://vip.1905.com/play/*
// @match             *://www.wasu.cn/Play/show/*
// @match             *://www.56.com/*
// @match             *://www.zuidazy4.com/*
// @license           GPL License
// ==/UserScript==
 
(function () {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    function innerParse(url) {
        $("#iframe-player").attr("src", url);}
      var originalInterfaceList = [
        { name:"B站专线", type:"1", url:"https://jsap.attakids.com/?url="},
        { name:"B站专线", type:"1", url:"https://jx.yparse.com/index.php?url="},
        { name:"线路一", type:"1", url:"https://www.41478.net/?url="},
        { name:"线路二", type:"1", url:"https://z1.m1907.cn/?jx="},
        { name:"线路三", type:"1", url:"https://api.tv920.com/jx/?url="},
        { name:"线路四", type:"1", url:"https://jx.youyitv.com/?url="},
        { name:"线路五", type:"1", url:"https://jsap.attakids.com/?url="},
        { name:"线路六", type:"1", url:"https://jx.m3u8.tv/jiexi/?url="},
    ];
    var node = "";
    var player_nodes = [
        { url:"v.qq.com", node:"#mod_player"},
        { url:"www.iqiyi.com", node:"#flashbox"},
        { url:"v.youku.com", node:"#ykPlayer"},
        { url:"www.mgtv.com", node:"#mgtv-player-wrap container"},
        { url:"tv.sohu.com", node:"#player"},
        { url:"film.sohu.com", node:"#playerWrap"},
        { url:"www.le.com", node:"#le_playbox"},
        { url:"video.tudou.com", node:".td-playbox"},
        { url:"v.pptv.com", node:"#pptv_playpage_box"},
        { url:"vip.pptv.com", node:".w-video"},
        { url:"www.wasu.cn", node:"#flashContent"},
        { url:"www.fun.tv", node:"#html-video-player-layout"},
        { url:"www.acfun.cn", node:"#player"},
        { url:"www.bilibili.com", node:"#player_module"},
        { url:"vip.1905.com", node:"#player"},
        { url:"www.56.com", node:"#play_player"}
    ];
    for(var i in player_nodes) {
        if (player_nodes[i].url == host) {
            node = player_nodes[i].node;}}
    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
    var innerList = [];
    var innerli = "";
    originalInterfaceList.forEach((item, index) => {
        if (item.type == "1") {
            innerList.push(item);
            innerli += "<li>" + item.name + "</li>";}
    });
    parseInterfaceList = innerList.concat();
 
var html = $(`
<style>
  .s-list,
    .s-list {position: fixed;left: 0;top: 20%;z-index: 999999;border-radius: 0 4px 4px 0;transform: translate3d(-100%, -50%, 0);transition: 0.3s;background: #272931;}
    .s-list:hover {transform: translate3d(0, -50%, 0);}
    .s-item {font-size:14px;position: relative;display: flex;justify-content: center;align-items: center;height: 36px;color: #09aaff !important;}
    .s-title {position: absolute;right: 0;top: 50%;width: 1.5em;padding: 5px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, -50%, 0);background: #fc4273;}
    li{position: relative;justify-content: center;align-items: center;height: 20px;color: #FE2E9A !important; }
    .vip_mod_box_action li{display:flex;font-size:14px;border:1px solid gray; padding:0 4px; margin:4px 2px;}
    .add{background-color:#00ff00;}
</style>
<div class="s-list">
              <div class="s-title">解析</div>
               <div id="go";><button class="s-item">下载当前视频</button></div>
              <div>
              <div class='vip_mod_box_action' >
              <div style='width:80px; padding:3px 0;'>
              <ul style='margin:0 0px;'>` + innerli + `</ul>
            </div>
<script>$("ul").on("click","li",function(){$("ul li").removeClass("add");$(this).addClass("add");});</script>
</div>`);
    $("body").append(html);
    $(".vip_mod_box_action li").each((index, item) => {
        item.addEventListener("click", () => {
            if (parseInterfaceList[index].type == "1") {
                if (document.getElementById("iframe-player") == null) {
                    var player = $(node);
                    player.empty();
                    player.append(videoPlayer);
                }
                innerParse(parseInterfaceList[index].url + location.href);
            }
        });
    });
    (function(){$("body").append("");
                setTimeout(function(){$("#loading").remove();$("#player_module").after('<div class="bottom-page paging-box-big"></div>');
                $("#go").click(function(){var aaa =$(".media-title").attr("title");
                var tempwindow=window.open("_blank");tempwindow.location="http://www.zuidazy4.com/index.php?m=vod-search&wd="+aaa})},4000)})();
    switch (host) {
        case 'www.iqiyi.com':
            unsafeWindow.rate = 0;
            unsafeWindow.Date.now = () => {
                return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
            }
            setInterval(() => {
                unsafeWindow.rate = 0;
            }, 600000);
            setInterval(() => {
                if (document.getElementsByClassName("cupid-public-time")[0] != null) {
                    $(".skippable-after").css("display", "block");
                    document.getElementsByClassName("skippable-after")[0].click();
                }
                $(".qy-player-vippay-popup").css("display", "none");
                $(".black-screen").css("display", "none");
            }, 500);
            break
        case 'v.qq.com':
            setInterval(() => {
                $(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
                $(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
            }, 1000)
            setInterval(() => {
                var txp_btn_volume = $(".txp_btn_volume");
                if (txp_btn_volume.attr("data-status") === "mute") {
                    $(".txp_popup_volume").css("display", "block");
                    txp_btn_volume.click();
                    $(".txp_popup_volume").css("display", "none");
                }
                //$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none");
                $(".mod_vip_popup").css("display", "none");
                $(".tvip_layer").css("display", "none");
                $("#mask_layer").css("display", "none");
            }, 500);
            break
        case 'v.youku.com':
            window.onload = function () {
                if (!document.querySelectorAll('video')[0]) {
                    setInterval(() => {
                        document.querySelectorAll('video')[1].playbackRate = 16;
                    }, 100)
                }
            }
            setInterval(() => {
                var H5 = $(".h5-ext-layer").find("div")
                if(H5.length != 0){
                    $(".h5-ext-layer div").remove();
                    var control_btn_play = $(".control-left-grid .control-play-icon");
                    if (control_btn_play.attr("data-tip") === "播放") {
                        $(".h5player-dashboard").css("display", "block");
                        control_btn_play.click();
                        $(".h5player-dashboard").css("display", "none");
                    }
                }
                $(".information-tips").css("display", "none");
            }, 500);
            break
        case 'tv.sohu.com':
            setInterval(() => {
                $("#player").find("video")[1].currentTime = 1000;
            }, 1000);
            break
        case 'www.fun.tv':
            setTimeout(() => {
                var control_btn_play = $(".fxp-controlbar .btn-toggle");
                if (control_btn_play.is('.btn-play')) {
                    control_btn_play.click();
                }
            }, 500);
            setInterval(() => {
                $("#play-Panel-Wrap").css("display", "none");
            }, 500);
            break
        case 'www.bilibili.com':
            setInterval(() => {
                $(".player-limit-mask").remove();
            }, 500);
            break
        case 'www.zuidazy4.com':
            setInterval(() => {
                $(".xing_top").remove();
                $(".sddm").remove();
                $(".container").remove();
                $(".foot").remove();
                $("#play_1").remove();
                $("#play_2").remove();
                $(".liketitle").remove();
                $(".vodAd").remove();
                $("input").remove();
                $(".xing_vb4").find("a").attr("target","_top");
                $(".xing_vb4").find("a").attr("id","bbb");
                $("#bbb")[0].click();
            }, 500);
            break
    }
})();
 