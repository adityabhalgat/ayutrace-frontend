import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Build configuration for production
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for debugging
    sourcemap: true,
    
    // Minimize code
    minify: 'esbuild',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Manual chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@heroicons/react'],
          'chart-vendor': ['recharts']
        }
      }
    },
    
    // Assets inline limit
    assetsInlineLimit: 4096,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // ESBuild options for minification
    target: 'es2020',
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    strictPort: false,
    
    // Hot module replacement
    hmr: {
      overlay: true
    },
    
    // Proxy for API calls in development
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Preview server configuration (for production build preview)
  preview: {
    port: 4173,
    host: true,
    strictPort: false,
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify('2.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    global: 'globalThis',
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@config': '/src/config',
      '@api': '/src/api',
    }
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  
  // Esbuild options
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: ['console', 'debugger'], // Remove console logs in production
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  
  // Base public path
  base: './',
  
  // Assets public path
  publicDir: 'public',
  
  // Environment variables prefix
  envPrefix: 'VITE_',
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@heroicons/react',
      'recharts'
    ],
    exclude: ['@vitejs/plugin-react']
  }
})
