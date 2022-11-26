import { createStore, select, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';

interface DataProps {
  curMeters: unknown[];
  decPos: number;
  id: number;
  usage: number;
  date: Dayjs;
}

export const dataStore = createStore(
  { name: 'data' },
  withProps<DataProps[]>([])
);

export const selectData: Observable<DataProps[]> = dataStore.pipe(
  select((state) => state)
);

export const persist = persistState(dataStore, {
  key: 'data',
  storage: localStorageStrategy,
});
