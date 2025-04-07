import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})




// //TODO: 
// 1. have three types.normal, user who can comment and author who can post and admin who can do all + delete anyone's post 
// 2. so i need to make a client for admin.and i need to change some of these routes exitCode.I p[robably need an admin tag for me ?]

// note: good claude chat under the caching user dtaa for faster removeLocalizedDigits. use that as the basis for building this out. 