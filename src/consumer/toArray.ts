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
        next: (array, action) => {
            if (action.kind === 'continue') return [array, exAwait];
            if (action.kind === 'break') return [array, exReturn(array)];
            array.push(action.value);
            return [array, exContinue];
        },
    };
}
