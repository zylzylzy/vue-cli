declare module 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js' {
  export function createApp(options: unknown): { mount(selector: string): void }
  export function ref<T>(value: T): { value: T }
  export function onMounted(callback: () => void | Promise<void>): void
}
