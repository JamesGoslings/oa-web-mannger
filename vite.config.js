import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    // 自动导入配置
    AutoImport({
      imports:['vue'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    vue()
  ],
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: "localhost", // 指定服务器应该监听哪个IP地址,默认：localhost
    port: 5173,        // 指定开发服务器端口,默认：5173
    proxy: {
      "/devApi": {
        target: "http://localhost:8800", // 目标地址
        changeOrigin: true,            // 是否换源
        rewrite: (path) => path.replace(/^\/devApi/, "")
      }
    }
  }
})
