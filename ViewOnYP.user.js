// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT
/* eslint-env browser, greasemonkey */
/* jshint asi: true, esversion: 11 */

// ==UserScript==
// @name            ViewOnYP
// @name:de         ViewOnYP
// @name:en         ViewOnYP
// @namespace       https://github.com/TheLastZombie/
// @version         2.8.6
// @description     Links various membership platforms to Kemono and Coomer.
// @description:de  Vernetzt verschiedene Mitgliedschaftsplattformen mit Kemono und Coomer.
// @description:en  Links various membership platforms to Kemono and Coomer.
// @homepageURL     https://thelastzombie.github.io/userscripts/
// @supportURL      https://github.com/TheLastZombie/userscripts/issues/new?labels=ViewOnYP
// @contributionURL https://ko-fi.com/rcrsch
// @author          TheLastZombie <roesch.eric+userscripts@protonmail.com>
// @match           *://www.dlsite.com/*/circle/profile/=/maker_id/*
// @match           *://*.fanbox.cc/
// @match           *://www.fanbox.cc/@*
// @match           *://fantia.jp/fanclubs/*
// @match           *://gumroad.com/*
// @match           *://onlyfans.com/*
// @match           *://www.patreon.com/*
// @match           *://www.subscribestar.com/*
// @match           *://subscribestar.adult/*
// @connect         coomer.party
// @connect         kemono.party
// @connect         api.fanbox.cc
// @grant           GM.deleteValue
// @grant           GM_deleteValue
// @grant           GM.getValue
// @grant           GM_getValue
// @grant           GM.registerMenuCommand
// @grant           GM_registerMenuCommand
// @grant           GM.setValue
// @grant           GM_setValue
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon            https://raw.githubusercontent.com/TheLastZombie/userscripts/main/icons/ViewOnYP.ico
// @copyright       2020-2022, TheLastZombie (https://github.com/TheLastZombie/)
// @license         MIT; https://github.com/TheLastZombie/userscripts/blob/main/LICENSE
// ==/UserScript==

// ==OpenUserJS==
// @author          TheLastZombie
// ==/OpenUserJS==

(async function () {
  "use strict";

  if (!(await GM.getValue("cache2"))) await GM.setValue("cache2", {});
  const cache = await GM.getValue("cache2");

  if (await GM.getValue("cache")) {
    cache.Kemono = await GM.getValue("cache");
    await GM.deleteValue("cache");
  }

  const sites = [
    {
      name: "Coomer",
      check: "https://coomer.party/api/creators",
      cache: (response, x) => {
        JSON.parse(response.responseText).forEach((y) => {
          if (!cache[x.name]) cache[x.name] = {};
          if (!cache[x.name][y.service]) cache[x.name][y.service] = [];
          cache[x.name][y.service].push(y.id);
        });
        return cache;
      },
      get: (response, host, user) => {
        return Boolean(
          JSON.parse(response.responseText)
            .filter((x) => x.service === host)
            .filter((x) => x.id === user).length
        );
      },
      profile: "https://coomer.party/$HOST/user/$USER",
    },
    {
      name: "Kemono",
      check: "https://kemono.party/api/creators",
      cache: (response, x) => {
        JSON.parse(response.responseText).forEach((y) => {
          if (!cache[x.name]) cache[x.name] = {};
          if (!cache[x.name][y.service]) cache[x.name][y.service] = [];
          cache[x.name][y.service].push(y.id);
        });
        return cache;
      },
      get: (response, host, user) => {
        return Boolean(
          JSON.parse(response.responseText)
            .filter((x) => x.service === host)
            .filter((x) => x.id === user).length
        );
      },
      profile: "https://kemono.party/$HOST/user/$USER",
    },
  ];

  GM.registerMenuCommand("Populate cache", () => {
    sites.forEach((x) => {
      GM.xmlHttpRequest({
        url: x.check,
        method: "GET",
        onload: async (response) => {
          const cache = x.cache(response, x);
          await GM.setValue("cache2", cache);
          alert("Populated cache for " + x.name + ".");
        },
      });
    });
  });

  GM.registerMenuCommand("Clear cache", () => {
    GM.deleteValue("cache2").then(alert("Cache cleared successfully."));
  });

  document.getElementsByTagName("head")[0].insertAdjacentHTML(
    "beforeend",
    `
    <style>
      #voyp {
        background: white;
        position: fixed;
        top: calc(100vh - 25px);
        left: 50%;
        transform: translateX(-50%);
        border-radius: 5px 5px 0 0;
        padding: 25px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
        text-align: center;
        z-index: 9999;
      }
      #voyp:hover {
        top: initial;
        bottom: 0;
      }
      #voyp div {
        font-size: small;
        text-transform: uppercase;
        opacity: 0.5;
        text-align: center;
      }
    </style>
  `
  );

  document
    .getElementsByTagName("body")[0]
    .insertAdjacentHTML(
      "beforeend",
      '<div id="voyp"><div>ViewOnYP</div></div>'
    );

  const host = window.location.hostname.split(".").slice(-2, -1)[0];
  if (!host) return;

  const p = new Promise((resolve, reject) => {
    switch (host) {
      case "dlsite":
        resolve(document.location.pathname.split("/")[6].slice(0, -5));
        break;
      case "fanbox": {
        let creatorId = window.location.hostname.split(".").slice(-3, -2)[0];
        if (creatorId === "www")
          creatorId = window.location.pathname.split("/")[1].slice(1);

        GM.xmlHttpRequest({
          url: "https://api.fanbox.cc/creator.get?creatorId=" + creatorId,
          headers: { Origin: "https://fanbox.cc" },
          onload: (response) =>
            resolve(JSON.parse(response.responseText).body.user.userId),
        });
        break;
      }
      case "fantia":
        resolve(document.location.pathname.split("/")[2]);
        break;
      case "gumroad":
        resolve(
          document
            .querySelector(".creator-profile-wrapper")
            .getAttribute("data-username")
        );
        break;
      case "patreon":
        resolve(
          document.head.innerHTML
            .match(/https:\/\/www\.patreon\.com\/api\/user\/\d+/)[0]
            .slice(33)
        );
        break;
      case "onlyfans":
      case "subscribestar":
        resolve(document.location.pathname.split("/")[1]);
        break;
    }
  });

  p.then((user) => {
    sites.forEach((x) => {
      if (
        cache[x.name] &&
        cache[x.name][host] &&
        cache[x.name][host].includes(user)
      )
        return show(x, host, user);
      GM.xmlHttpRequest({
        url: x.check,
        method: "GET",
        onload: (response) => {
          if (x.get(response, host, user)) show(x, host, user);
        },
      });
    });
  });

  function show(site, host, user) {
    const name = site.name;
    const url = site.profile.replace("$HOST", host).replace("$USER", user);

    document
      .getElementById("voyp")
      .insertAdjacentHTML(
        "beforeend",
        "<br>" + name + ': <a href="' + url + '">' + url + "</a>"
      );

    if (!cache[site.name]) cache[site.name] = {};
    if (!cache[site.name][host]) cache[site.name][host] = [];
    if (!cache[site.name][host].includes(user))
      cache[site.name][host].push(user);
    GM.setValue("cache2", cache);
  }
})();

// @license-end
