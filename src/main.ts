import { PhotoStory } from './index';

const lightbox = new PhotoStory('.gallery', {
  fullscreen: true,
  download: true,
  showCounter: true,
  reveal: {
    effect: 'scale',
  },
});

console.log('Light', lightbox);
