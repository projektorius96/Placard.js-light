import { defineConfig } from 'vite';
import { writeFileSync } from 'node:fs';
import { start_url } from './manifest.json'/*  with {type: 'json'} */;

const GITHUB_READY = process.env.GITHUB_READY || 0;
const outDir = 'site';
export default defineConfig({
    resolve: {
        alias: [
            {find: "@namespace", replacement: "/path/to/namespace"},
        ]
    }
    ,
    base: './'
    ,
    build: {
        outDir,
        rollupOptions: {
            preserveEntrySignatures: true, /* <=== set this to true, in order the `output.preserveModules = true` set below, would take action */
            output: {
                preserveModules: true,
            }
        },
    }
    ,
    plugins: [
        {
            name: 'vite-plugin-nojekyll',
            closeBundle() {
                writeFileSync(`./${outDir}/.nojekyll`, '');
            },
        }
        ,
        {
            name: 'vite-plugin-custom-base',
            config(config, { command }) {
                if (command === 'build' && GITHUB_READY) {
                    config.base = start_url;
                } else {
                    config.base = config.base;
                }
            }
        }
    ]
});
