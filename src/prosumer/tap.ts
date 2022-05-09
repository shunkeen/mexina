import { Prosumer } from '../machine/machine';
import { map } from './map';

type Tap<T> = Prosumer<T, undefined, T>;
export const tap = <T>(body: (value: T) => void): Tap<T> =>
    map((value) => {
        body(value);
        return value;
    });
