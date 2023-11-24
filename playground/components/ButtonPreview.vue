<template>
  <button v-bind="live">
    {{ data.fields.text["en-US"] }}
  </button>
</template>

<script setup lang="ts">
const inspectorProps = useContentfulInspectorMode();
const data = useContentfulLiveUpdates({
  sys: {
    id: "7htbvriHipqHPccOgui7QS",
  },
  fields: {
    text: {
      "en-US": "Hello world",
    },
  },
});

const live = inspectorProps({
  entryId: data.value.sys.id,
  fieldId: "text",
});

</script>
