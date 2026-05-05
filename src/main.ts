import { PhotoStory } from './index';

const lightbox = new PhotoStory('.gallery', {
  fullscreen: true,
  download: true,
  showCounter: true,
});

console.log('Light', lightbox);
