import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Цей параметр замінює 'process.env.API_KEY' у коді на реальне значення
    // зі змінних середовища (Vercel Environment Variables або файл .env)
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});