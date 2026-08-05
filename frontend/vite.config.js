


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,        // Force port 5173
//     strictPort: true,  // Don't auto change to another port
//     host: true,        // Optional: Allow access from network
//   },
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/authx': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/complaints': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})