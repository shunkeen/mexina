import { Consumer } from '../machine/machine';
import { orElse } from './orElse';
import { exFindIndex } from './exFindIndex';

type FindIndex<T> = Consumer<T, number, number>;
export const findIndex = <T>(predicate: (value: T) => boolean): FindIndex<T> =>
    orElse(-1, exFindIndex(predicate));
