import {
    Consumer,
    exAwait,
    exContinue,
    exReturn,
    nop,
} from '../machine/machine';

type ToArray<T> = Consumer<T, Array<T>, ReadonlyArray<T>>;
export function toArray<T>(): ToArray<T> {
    return {
        done: nop,
        init: [],
        next: (array, event) => {
            if (event.kind === 'continue') return [array, exAwait];
            if (event.kind === 'break') return [array, exReturn(array)];
            array.push(event.value);
            return [array, exContinue];
        },
    };
}
