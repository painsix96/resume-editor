import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true'
  
  return {
    plugins: [react()],
    base: isGitHubPages ? '/resume-editor/' : '/',
  }
})