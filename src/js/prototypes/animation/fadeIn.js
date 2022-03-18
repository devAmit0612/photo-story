export default function fadeIn(el, cb, duration) {
    if (!el) {
        return false;
    }
    
    if (!duration) {
        duration = 300;
    }

    el.style.opacity = 0;
    el.style.display = 'block';
    
    const opacity = 1;
    const step = (16.66666 * opacity) / duration;

    const fade = () => {
        let currentOpacity = parseFloat(el.style.opacity);

        if (!((currentOpacity += step) > opacity)) {
            el.style.opacity = currentOpacity;
            requestAnimationFrame(fade);
        } else {
            el.style.opacity = opacity;
            cb && cb.call();
        }
    };

    fade();
}