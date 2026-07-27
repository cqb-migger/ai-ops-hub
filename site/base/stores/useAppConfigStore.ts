import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { apiFetch } from '@base/utils/api';

export const DEFAULT_APP_NAME = 'AI Navigator';

export interface AppConfig {
  appName: string;
  logoUrl: string | null;
}

interface AppConfigState extends AppConfig {
  /** Fetch the latest branding from the API and cache it. */
  fetchConfig: () => Promise<void>;
  /** Apply an updated config locally (after an admin save) without a refetch. */
  setConfig: (config: Partial<AppConfig>) => void;
}

const useAppConfigStore = create<AppConfigState>()(
  devtools(
    persist(
      (set) => ({
        appName: DEFAULT_APP_NAME,
        logoUrl: null,
        fetchConfig: async () => {
          try {
            const data = await apiFetch<{ app_name: string; logo_url: string | null }>(
              '/settings/app',
              { skipAuthRedirect: true }
            );
            set({
              appName: data.app_name || DEFAULT_APP_NAME,
              logoUrl: data.logo_url || null,
            });
          } catch (_) {
            // Keep whatever is cached (or the default) if the request fails.
          }
        },
        setConfig: (config) => set((prev) => ({ ...prev, ...config })),
      }),
      { name: 'app-config-storage' }
    ),
    { name: 'app-config' }
  )
);

export default useAppConfigStore;
