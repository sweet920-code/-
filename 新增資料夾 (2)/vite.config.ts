import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 載入環境變數
  // process.cwd() is a Node.js method, but TypeScript might see the browser Process type which lacks cwd().
  // Casting to any resolves this build error.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // 使用相對路徑，解決 GitHub Pages 子路徑 404 問題
    define: {
      // 將編譯時的環境變數注入到前端程式碼中
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});