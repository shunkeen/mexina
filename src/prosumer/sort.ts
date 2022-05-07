import { Prosumer } from '../machine/machine';
import { bulk } from './bulk';

type Sort<T> = Prosumer<T, SortState<T>, T>;
type SortState<T> = readonly [Array<T>] | readonly [ArrayLike<T>, number];

export function sort<T>(compare?: (a: T, b: T) => number): Sort<T> {
    return compare === undefined
        ? bulk((array) => array.sort())
        : bulk((array) => array.sort(compare));
}
