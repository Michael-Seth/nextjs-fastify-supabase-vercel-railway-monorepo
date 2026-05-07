import { useFeatureFlagStore } from "@/stores/featureFlagStore";

/**
 * Feature flag hook.
 * Usage: const canUseNewEditor = useFeature("newEditor");
 */
export function useFeature(key: string): boolean {
  return useFeatureFlagStore((s) => s.isEnabled(key));
}

export function useFeatureFlags() {
  const { flags, setFlag, loadRemoteFlags } = useFeatureFlagStore();
  return { flags, setFlag, loadRemoteFlags };
}
