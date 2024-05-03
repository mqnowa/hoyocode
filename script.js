function main() {
    const TABLE = document.querySelector("#table");
    const TEMPLATE = document.querySelector("#template");
    clone("AAAAAAAAAA", "サンプルテキスト\nサンプルテキスト");

    function clone(code, description) {
        const elm = TEMPLATE.cloneNode(true);
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
        elm.querySelector(".enterd-link").onclick = function() {
            window.open('https://genshin.hoyoverse.com/ja/gift?code=' + code);
        };

        TABLE.appendChild(elm);
    }
    
    function copy_code(elm) {
        document.querySelector("div").getAttribute("data-code")
    }
}

document.addEventListener("DOMContentLoaded", ev => {
    main();
})