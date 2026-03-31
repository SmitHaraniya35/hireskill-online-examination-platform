import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {                     
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   server: {
//     host: true,
//     port: 5173,
//     allowedHosts: [
//       "unsnouted-unescapably-mira.ngrok-free.dev"
//     ]
//   },
//   resolve: {                     
//     alias: {
//      "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })