<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ContentfulLivePreview, type ContentfulLivePreviewInitConfig } from '../live-preview';
  import { defineProps, provide, toRefs } from 'vue';

  const props = defineProps<ContentfulLivePreviewInitConfig>();
  const propsRefs = toRefs(props);

  if (!propsRefs.locale.value) {
    throw new Error(
      'ContentfulLivePreviewProvider have to be called with a locale property (for example: `<ContentfulLivePreviewProvider locale="en-US"><Component /></ContentfulLivePreviewProvider>`'
    );
  }

  provide('config', propsRefs);
  ContentfulLivePreview.init(props);
</script>