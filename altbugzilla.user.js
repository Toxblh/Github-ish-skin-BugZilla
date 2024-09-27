// ==UserScript==
// @name           Github-ish skin BugZilla
// @name:ru        BugZilla скин под Github
// @description    Modernized visual update for Alt Bugzilla.
// @description:ru Предоставляет обновлённый современный визуальный стиль для Alt Bugzilla.
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js
// @require        https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/script.js
// @match          https://bugzilla.altlinux.org/*
// @namespace      altbugzilla
// @version        1.0.3
// @icon           https://bugzilla.altlinux.org/images/favicon.svg
// @author         Toxblh
// @homepageURL    https://github.com/Toxblh/Github-ish-skin-BugZilla
// @updateURL      https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/altbugzilla.user.js
// @downloadURL    https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/altbugzilla.user.js
// @supportURL     https://github.com/Toxblh/Github-ish-skin-BugZilla/issues
// ==/UserScript==

(function() {
    'use strict';

    // Загружаем и применяем CSS файл
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/Toxblh/Github-ish-skin-BugZilla/refs/heads/master/styles.css",
        onload: function(response) {
            GM_addStyle(response.responseText);
        }
    });

})();
