import { Prosumer } from '../machine/machine';
import { sifter } from './sifter';

type Filter<T> = Prosumer<T, undefined, T>;
export function filter<T>(predicate: (value: T) => boolean): Filter<T> {
    return sifter((value): value is T => predicate(value));
}
