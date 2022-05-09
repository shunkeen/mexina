import { Producer } from '../machine/machine';
import { fromArray } from './fromArray';

export const of = <T>(...values: ReadonlyArray<T>): Producer<number, T> =>
    fromArray(values);
