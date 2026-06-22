import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const posthogHost = env.VITE_PUBLIC_POSTHOG_HOST;
  const posthogAssetsHost = posthogHost
    ? posthogHost.replace(/^https?:\/\/(\w+)\.i\.posthog\.com/, 'https://$1-assets.i.posthog.com')
    : posthogHost;

  return {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [reactRouter(), tsconfigPaths()],
    ssr: {
      noExternal: ['posthog-js', '@posthog/react'],
    },
    server: {
      proxy: {
        '/ingest/static': {
          target: posthogAssetsHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
        '/ingest/array': {
          target: posthogAssetsHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
        '/ingest': {
          target: posthogHost,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ''),
        },
      },
    },
  };
});
