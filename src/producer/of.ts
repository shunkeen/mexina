import { Producer } from '../machine/machine';
import { fromArray } from './fromArray';

export function of<T>(...values: ReadonlyArray<T>): Producer<number, T> {
    return fromArray(values);
}
