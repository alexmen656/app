import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // By default Vite crawls every .html in the project to discover deps,
    // which here drags in website/, android|ios build output and the
    // barcode-scanner example-app (the latter imports a non-existent `Camera`
    // export and aborts the scan). Restrict scanning to the real app entry.
    entries: ['index.html'],
  },
})
