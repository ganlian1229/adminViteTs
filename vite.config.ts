import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    return {
        base: command === 'serve' ? '/' : './',
        server: {
            port: 8096,
            host: true // 监听所有地址
            // proxy: {
            //     '/api': {
            //         target: 'http://xxxxxx',
            //         changeOrigin: true,
            //         ws: true,
            //         rewrite: (path) => path.replace(new RegExp('^/api'), '')
            //     }
            // }
        },
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
                imports: ['vue', 'pinia', 'vue-router'],
                // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
                dts: 'src/auto-import.d.ts',
                // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
                // // 生成全局声明文件，给eslint用
                eslintrc: {
                    enabled: true, // Default `false`
                    filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                    globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
                }
            }),
            Components({
                // 指定组件位置，默认是src/components
                dirs: ['src/componentsGlobal'],
                // ui库解析器
                resolvers: [ElementPlusResolver()],
                extensions: ['vue', 'tsx'],
                // 配置文件生成位置
                dts: 'src/components.d.ts',
                directives: false,
                // 搜索子目录
                deep: true,
                // 允许子目录作为组件的命名空间前缀。
                directoryAsNamespace: false
                // include:[]
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
            // extensions: ['.js', '.ts'] // 导入时想要省略的扩展名列表
        },
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false, // 避免出现: build时的 @charset 必须在第一行的警告
                    additionalData: `@import "@/assets/css/variables.scss";` // 引入全局变量文件
                }
            }
        },
        build: {
            target: 'esnext', // 浏览器兼容性  "esnext"|"modules"
            outDir: 'dist', // 指定输出路径
            cssCodeSplit: false, // 禁用 CSS 代码拆分,将整个项目中的所有 CSS 将被提取到一个 CSS 文件中
            sourcemap: false, // 构建后是否生成 source map 文件
            // chunk 大小警告的限制（以 kbs 为单位）
            // chunkSizeWarningLimit: 1024,
            // 当设置为 true，构建后将会生成 manifest.json 文件
            manifest: false,
            // 指定使用哪种混淆器  false 可以禁用最小化混淆   terser  esbuild
            minify: 'terser', // 混淆器, terser 构建后文件体积更小, esbuild
            terserOptions: {
                compress: {
                    // drop_console: true,//打包移出console
                    drop_debugger: true // 打包移出debugger
                }
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name]-[hash].[ext]'
                }
            }
        }
    };
});
