export default {
    gallery: {},

    // Lightbox options
    fullscreen: true,
    showCounter: true,
    download: true,
    captions: false,
    loop: false,

    // Bullets
    bullets: false,

    // Set image loader and amount of preload image
    loader: true,
    preload: 1,

    // Effects
    effect: 'default', // 'default' | 'Slide' | 'fade' | 'scale'

    // Right to left
    rtl: false,

    template: {
        enterFullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 3h2v6h-2V5h-4V3h4zM4 3h4v2H4v4H2V3h2zm16 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"/>
        </svg>`,
        exitFullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"/>
        </svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 19h18v2H3v-2zm10-5.828L19.071 7.1l1.414 1.414L12 17 3.515 8.515 4.929 7.1 11 13.17V2h2v11.172z"/>
        </svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
        </svg>`,
    }
}