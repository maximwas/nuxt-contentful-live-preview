<template>
  <div>
    <ContentfulLivePreviewProvider
      locale="en-US"
      :enable-inspector-mode="true"
      :enable-live-updates="a"
    >
      <ButtonPreview />
    </ContentfulLivePreviewProvider>
  </div>
</template>

<script setup>
const a = ref(true);

// setTimeout(() => a.value = false, 10000)
</script>
