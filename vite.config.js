import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Permet au plugin React de traiter le JSX dans les fichiers .js
      include: /\.(js|jsx)$/,
    })
  ],
  esbuild: {
    // Force esbuild à parser le JSX dans les fichiers .js
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await import('fs').then(fs => fs.promises.readFile(args.path, 'utf8')),
            }));
          },
        },
      ],
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
