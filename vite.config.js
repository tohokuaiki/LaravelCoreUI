import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '~coreui': resolve(__dirname, 'node_modules/@coreui/coreui'),
        }
    },
    plugins: [
        laravel({
            input: ['resources/js/app.tsx', 'resources/js/admin.tsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: true,
        hmr: {
            host: 'localhost',
        },
    }
});
