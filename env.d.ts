/// <reference types="vite/client" />

import 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, options?: Record<string, unknown>) => string;
  }
}
