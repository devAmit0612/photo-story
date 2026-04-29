import { type Options } from './types';

const defaultOptions: Options = {
  gallery: {},

  // Lightbox options
  fullscreen: true,
  showCounter: true,
  download: true,
  captions: false,
  loop: false,

  // Bullets
  bullets: false,

  // Amount of preload image
  preload: 1,

  // Effects
  enterEffect: {
    name: 'scale',
    duration: 300,
    easing: 'ease',
  },
  exitEffect: {
    name: 'scale',
    duration: 300,
    easing: 'ease',
  },
  transitionEffect: {
    name: 'default',
  },

  backdrop: {
    duration: 250,
    easing: 'ease',
  },

  // Right to left
  rtl: false,

  template: {
    download: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>`,
  },
};

export default defaultOptions;
