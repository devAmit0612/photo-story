export default function fadeOut(el, cb, duration) {
    if (!el) {
        return false;
    }
    
    if (!duration) {
        duration = 300;
    }

    el.style.opacity = 1;
    const opacity = 0;
    const step = 16.66666 / duration;

    const fade = () => {
        let currentOpacity = parseFloat(el.style.opacity || 1);

        if ((currentOpacity -= step) < opacity) {
            el.style.opacity = opacity;
            el.style.display = 'none';
            cb && cb.call();

        } else {
            el.style.opacity = currentOpacity;
            requestAnimationFrame(fade);
        }
    };

    fade();
}