function main() {
    const TABLE = document.querySelector("#table");
    const STREAMER_TABLE = document.querySelector("#streamer-table");
    const TEMPLATE = document.querySelector("#template");
    const STREAMER_TEMPLATE = document.querySelector("#streamer-template");
    const Params = new URLSearchParams(window.location.search);

    var DATA;
    fetch("/codes.json").then(res => res.json()).then(data => {
        DATA = data;
        load_codes();
    });

    const game = Params.get("game");
    switch (game) {
    case "gi":
        document.querySelector("#toggle-gi").checked = true;
        break;
    case "sr":
        document.querySelector("#toggle-sr").checked = true;
        break;
    }

    document.querySelector("#game-toggle").addEventListener("click", function(){
        this.childNodes.forEach(elm => {
            if (elm.checked) {
                let gameid = elm.getAttribute("data-gameid");
                Params.set("game", gameid);
                let newurl = window.location.href.split('?')[0] + "?" + Params.toString();
                history.pushState({}, '', newurl);
                load_codes();
            }
        });
    });

    /**
     * 
     * @param {string} code 
     * @param {string} description 
     * @param {string | null} expire 
     * @param {string} link 
     * @param {boolean} can_enterd 
     */
    function clone_event(template, table, code, description, expire, media_url, base_link, can_enterd) {
        const elm = template.cloneNode(true);
        elm.removeAttribute("id");
        elm.toggleAttribute("hidden");

        elm.querySelector(".code-textbox").value = code;
        const button = elm.querySelector(".code-copy-button");
        button.setAttribute("data-code", code);
        button.onclick = function() {
            navigator.clipboard.writeText(this.getAttribute("data-code"));
            this.children[0].toggleAttribute("hidden");
            this.children[1].toggleAttribute("hidden");
            setTimeout(() => {
                this.children[0].toggleAttribute("hidden");
                this.children[1].toggleAttribute("hidden");
            }, 1500);
            console.log(this.children)
        }

        elm.querySelector(".code-description").innerText = description;
        elm.querySelector(".enterd-link").href = base_link + code;

        const expire_elm = elm.querySelector(".code-expire");
        if (expire_elm) {
            if (expire) expire_elm.setAttribute("data-expire", expire);
            set_countdown(expire_elm);
        }

        if (media_url) {
            const media_link = elm.querySelector(".media-link");
            media_link.href = media_url;
        } else {
            elm.querySelector(".media-link").classList.add("disabled")
        }

        table.appendChild(elm);
    }

    /**
     * @param {Element} elm 
     */
    function set_countdown(elm) {
        let expire_str = elm.getAttribute("data-expire");
        if (!expire_str) {
            elm.textContent = "無期限";
            return;
        }

        let expire = new Date(expire_str);
        function a(){
            let now = new Date();
            let remaining = Math.floor((expire.getTime() - now.getTime()) / 1000);
            let d = Math.floor(remaining / 86400);
            let h = Math.floor((remaining - d * 86400) / 3600);
            let m = Math.floor((remaining - d * 86400 - h * 3600) / 60);
            let s = Math.floor((remaining - d * 86400 - h * 3600 - m * 60));

            if (remaining < 0) {
                elm.style.color = "red";
                elm.textContent = "期限切れ";
            } else if (remaining < 60) {
                elm.textContent = s + "秒";
            } else if (remaining < 600) {
                elm.textContent = m + "分" + s + "秒";
            } else if (remaining < 3600) {
                elm.textContent = m + "分";
            } else if (remaining < 3600 * 4) {
                elm.textContent = h + "時間" + m + "分";
            } else if (remaining < 86400) {
                elm.textContent = h + "時間";
            } else if (remaining < 86400 * 4) {
                elm.textContent = d + "日" + h + "時間";
            } else {
                elm.textContent = d + "日";
            }
        }

        a();
        setInterval(a, 1000);
    }
    
    function load_codes() {
        Array.from(TABLE.childNodes).forEach(node => {
            if (!node.hidden) {
                node.remove();
            }
        });
        Array.from(STREAMER_TABLE.childNodes).forEach(node => {
            if (!node.hidden) {
                node.remove();
            }
        });

        var game = "gi";
        if (Params.has("game")) {
            game = Params.get("game");
        }

        switch (game) {
        case "gi":
            for (var i = 0; i < DATA.gi.event.length; i++) {
                clone_event(TEMPLATE, TABLE, DATA.gi.event[i][1], DATA.gi.event[i][2], DATA.gi.event[i][0], null,
                            'https://genshin.hoyoverse.com/ja/gift?code=', true);
            }
            for (var i = 0; i < DATA.gi.streamer.length; i++) {
                clone_event(STREAMER_TEMPLATE, STREAMER_TABLE, DATA.gi.streamer[i][0], DATA.gi.streamer[i][1], null, DATA.gi.streamer[i][2],
                            'https://genshin.hoyoverse.com/ja/gift?code=', true);
            }
            document.querySelector("#streamer_reward").innerText = DATA.gi.streamer_reward;
            break;
        case "sr":
            for (var i = 0; i < DATA.sr.event.length; i++) {
                clone_event(TEMPLATE, TABLE, DATA.sr.event[i][1], DATA.sr.event[i][2], DATA.sr.event[i][0], null,
                            'https://hsr.hoyoverse.com/gift?code=', true);
            }
            for (var i = 0; i < DATA.sr.streamer.length; i++) {
                clone_event(STREAMER_TEMPLATE, STREAMER_TABLE, DATA.sr.streamer[i][0], DATA.sr.streamer[i][1], null, DATA.sr.streamer[i][2],
                            'https://hsr.hoyoverse.com/gift?code=', true);
            }
            document.querySelector("#streamer_reward").innerText = DATA.sr.streamer_reward;
            break;
        }
    }
}

document.addEventListener("DOMContentLoaded", ev => {
    main();
})