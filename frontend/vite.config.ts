import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  // server: {
  //   https: {
  //     key: fs.readFileSync('/certs/localhost-key.pem'),
  //     cert: fs.readFileSync('/certs/localhost.pem'),
  //   },
  //   host: '0.0.0.0',
  //   port: 80,
  //   strictPort: true,
  //   origin: 'https://localhost:5173',
  //   hmr: {
  //     host: 'localhost',
  //     clientPort: 5173,
  //     protocol: 'wss',
  //   },
  //   watch: {
  //     usePolling: true,
  //     interval: 100,
  //   },
  // },
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
    origin: 'http://localhost:5173',
    hmr: {
      host: 'localhost',
      clientPort: 5173,
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
