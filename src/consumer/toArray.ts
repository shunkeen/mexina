import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type ToArray<T> = Consumer<T, Array<T>, ReadonlyArray<T>>;
export const toArray = <T>(): ToArray<T> =>
    machine<ToArray<T>>([], (array, event) => {
        if (event.kind === 'continue') return [array, exAwait];
        if (event.kind === 'break') return [array, exReturn(array)];

        array.push(event.value);
        return [array, exAwait];
    });
