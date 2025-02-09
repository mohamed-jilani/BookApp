# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

📂 BookApp
 ┣ 📂 .expo  
 ┣ 📂 .vscode
 ┣ 📂 app
 ┣ ┣ 📂 (tabs)
 ┣ ┣ ┣ 📜 _layout.tsx
 ┣ ┣ ┣ 📜 explore.tsx
 ┣ ┣ ┣ 📜 index.tsx
 ┣ ┣ 📜 _layout.tsx
 ┣ ┣ 📜 +not-found.tsx
 ┣ 📂 assets    
 ┣ 📂 components
 ┣ 📂 constants
 ┣ 📂 hooks
 ┣ 📂 node_modules
 ┣ 📂 scripts
 ┣ 📜 app.json
 ┣ 📜 expo-env.d.ts
 ┣ 📜 package-lock.json
 ┣ 📜 package.json
 ┗ 📜 tsconfig.json



```bash
npx create-expo-app sqlapp

npx expo install expo-sqlite

npm i -D drizzle-kit
npm i drizzle-orm babel-plugin-inline-import
npm i expo-drizzle-studio-plugin

npx expo customize metro.config.js

npx expo customize babel.config.js

npx drizzle-kit generate


```
metro
      config.resolver.sourceExts.push('sql'); // <--- add this

bable
    plugins: [['inline-import', { extensions: ['.sql'] }]], // Add this line

