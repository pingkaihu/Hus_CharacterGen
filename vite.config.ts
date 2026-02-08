import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Actions 部署需要 /Hus_CharacterGen/ 路徑
  // Vercel 部署使用根目錄 /
  base: process.env.GITHUB_ACTIONS ? "/Hus_CharacterGen/" : "/",
});

