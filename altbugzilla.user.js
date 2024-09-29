// ==UserScript==
// @name           Github-ish skin BugZilla
// @name:ru        BugZilla скин под Github
// @description    Modernized visual update for Alt Bugzilla.
// @description:ru Предоставляет обновлённый современный визуальный стиль для Alt Bugzilla.
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @connect        raw.githubusercontent.com
// @require        https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js
// @require        https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/script.js
// @resource css   https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/styles.css
// @match          https://bugzilla.altlinux.org/*
// @match          https://bugzilla.altlinux.com/*
// @match          https://bugzilla.altlinux.ru/*
// @run-at         document-start
// @namespace      altbugzilla
// @version        1.1.0
// @icon           https://bugzilla.altlinux.org/images/favicon.svg
// @author         Toxblh
// @homepageURL    https://github.com/Toxblh/Github-ish-skin-BugZilla
// @updateURL      https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/altbugzilla.user.js
// @downloadURL    https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/altbugzilla.user.js
// @supportURL     https://github.com/Toxblh/Github-ish-skin-BugZilla/issues
// ==/UserScript==

GM_addStyle(GM_getResourceText("css"))
