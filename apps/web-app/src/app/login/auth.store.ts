import { createStore, select, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { Dayjs } from 'dayjs';

interface AuthProps {
  jwt: string | null;
  cuid: string | null;
  cookies: {
    name: string;
    value: string;
  }[];
  period: Dayjs | null;
}

export const authStore = createStore(
  { name: 'auth' },
  withProps<AuthProps>({ jwt: null, cookies: [], cuid: null, period: null })
);

export const persist = persistState(authStore, {
  key: 'auth',
  storage: localStorageStrategy,
});

export const getCurrentUser = () => {
  return authStore.getValue().cuid;
};

export const selectPeriod = authStore.pipe(select((d) => d.period));
