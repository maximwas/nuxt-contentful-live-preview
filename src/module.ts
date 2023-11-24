import { defineNuxtModule, addPlugin, createResolver, extendWebpackConfig, addComponentsDir, addImports  } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule'
  },
  defaults: {},
  setup (options, nuxt) {
    extendWebpackConfig((config) => {
      config.module?.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      })

      config.module?.resolve.extensions.push('.mjs')
    });

    const resolver = createResolver(import.meta.url)
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      global: true,
    });
    addImports([
      {
        name: 'useContentfulInspectorMode',
        from: resolver.resolve('./runtime/live-preview/nuxt'),
      },
      {
        name: 'useContentfulLiveUpdates',
        from: resolver.resolve('./runtime/live-preview/nuxt'),
      },
      {
        name: 'useDeepCompareEffectNoCheck',
        from: resolver.resolve('./runtime/nuxt'),
      }
    ]);
  }
})
