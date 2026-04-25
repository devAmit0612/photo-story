import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'PhotoStory',
      fileName: (format) => `photo-story.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const assetName = assetInfo.names?.[0];
          if (assetName === 'style.css') return 'photo-story.css';
          return assetName || 'asset';
        },
      },
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
