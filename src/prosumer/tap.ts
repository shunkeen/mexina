import { Prosumer } from '../machine/machine';
import { map } from './map';

type Tap<T> = Prosumer<T, undefined, T>;
export function tap<T>(body: (value: T) => void): Tap<T> {
    return map((value) => {
        body(value);
        return value;
    });
}
