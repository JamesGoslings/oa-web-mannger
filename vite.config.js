import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    // 自动导入配置
    AutoImport({
      imports:[
          // 预设
          'vue'
      ]
    }),
    vue()
  ],
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src')
    }
  }
})
