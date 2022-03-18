export default {
    enterFullscreen() {
        const doc = document;
        const docEl = doc.documentElement;
        const enter = docEl.requestFullScreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;

        if (enter) {
            enter.call(docEl);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var shell = new ActiveXObject("WScript.Shell");
            if (shell !== null) {
                shell.SendKeys("{F11}");
            }
        }

        this.tools.fullscreen.innerHTML = this.options.template.exitFullscreen;
    },
    
    exitFullscreen() {
        const doc = document;
        const exit = doc.cancelFullScreen || doc.webkitCancelFullScreen || doc.mozCancelFullScreen || doc.exitFullscreen || doc.webkitExitFullscreen;

        if (exit) {
            exit.call(doc);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            const shell = new ActiveXObject("WScript.Shell");
            if (shell !== null) {
                shell.SendKeys("{F11}");
            }
        }

        this.tools.fullscreen.innerHTML = this.options.template.enterFullscreen;
    },

    fullscreen() {
        const isEnter = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);

        if (isEnter) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
}