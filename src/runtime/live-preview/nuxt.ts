import { ref, inject, computed, watch, isRef, type UnwrapRef, type ComputedRef, type ToRefs } from 'vue';
import { DocumentNode } from 'graphql';
import isEqual from 'lodash.isequal';

import { ContentfulLivePreview, ContentfulLivePreviewInitConfig } from './index';
import { Argument, InspectorModeTags, LivePreviewProps } from './types';

export interface Options {
  locale?: string;
  query?: DocumentNode;
  skip?: boolean;
}

export interface State<T> {
  data: T;
  version: number;
}

export type ResultLiveUpdates<T> = ComputedRef<UnwrapRef<T>>;

export function useDeepCompareEffectNoCheck(subscribe: () => VoidFunction | undefined, dependencies: any[]): void {
  const normalizeDependencies = dependencies.map((depend) => isRef(depend) ? depend : ref(depend));

  watch(normalizeDependencies, (_, __, OnCleanup) => {
    const unsubscribe = subscribe();

    if (unsubscribe) OnCleanup(unsubscribe);
  }, { deep: true });
}

export function useContentfulLiveUpdates<T extends Argument | null | undefined>(
  data: T,
  optionsOrLocale?: Options | string,
  skip = false
): ResultLiveUpdates<T> {
  const signalRef = ref(false);
  const state = ref<State<T>>({ data, version: 1 });
  const previous = ref(data);
  const result = computed(() => state.value.data);
  const config = inject<ToRefs<ContentfulLivePreviewInitConfig>>('config');

  const options = ref(typeof optionsOrLocale === 'object' ? optionsOrLocale : { locale: optionsOrLocale || config?.locale.value, skip });

  const shouldSubscribe = computed(() => {
    if (config && !config.enableLiveUpdates?.value) {
      return false;
    }

    if (options.value.skip) {
      return false;
    }

    if (Array.isArray(data) && data.length) {
      return true;
    }

    if (data && typeof data === 'object' && Object.keys(data).length) {
      return true;
    }

    return false;
  });

  useDeepCompareEffectNoCheck(() => {
    if (!isEqual(previous.value, state.value.data)) {
      previous.value = state.value.data;
      state.value = { data: data as UnwrapRef<T>, version: 1 }
    }

    if (!shouldSubscribe.value) {
      return;
    }

    return ContentfulLivePreview.subscribe('edit', {
      data: data as Argument,
      locale: options.value.locale,
      query: options.value.query,
      callback: (updatedData) => {
        state.value = { data: updatedData as UnwrapRef<T>, version: state.value.version + 1 };
      },
    });
  }, [data, shouldSubscribe, options.value.locale, options.value.query, signalRef]);

  signalRef.value = true;

  return result;
}

type GetInspectorModeProps<T> = (
  props: {
    [K in Exclude<keyof LivePreviewProps, keyof T | 'locale'>]: LivePreviewProps[K];
  } & { locale?: LivePreviewProps['locale'] }
) => InspectorModeTags;

export function useContentfulInspectorMode<
T = undefined | Pick<LivePreviewProps, 'entryId'> | Pick<LivePreviewProps, 'entryId' | 'fieldId'>
>(sharedProps?: T): GetInspectorModeProps<T> {
  const config = inject<ToRefs<ContentfulLivePreviewInitConfig>>('config');

  return (props) => {
    if (config && config.enableInspectorMode?.value) {
      return ContentfulLivePreview.getProps({ ...sharedProps, ...props } as LivePreviewProps);
    }

    return null;
  };
}