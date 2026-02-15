import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    // 部署到 GitHub Pages 的基础路径
    base: '/deci_data_collection/',

    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                calendar: resolve(__dirname, 'calendar.html'),
                collection: resolve(__dirname, 'collection.html'),
                download: resolve(__dirname, 'download.html'),
                trends: resolve(__dirname, 'trends.html'),
                resetPassword: resolve(__dirname, 'reset-password.html')
            }
        }
    },

    server: {
        port: 8080,
        strictPort: false
    }
})
