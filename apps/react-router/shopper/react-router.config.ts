import type { Config } from "@react-router/dev/config";

// QUACK QUACK IM A BIG FLUFFY DOG
export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    v8_middleware: true,
  },
} satisfies Config;
