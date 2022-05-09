import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type Some<T> = Consumer<T, undefined, boolean>;
export const some = <T>(predicate: (value: T) => boolean): Some<T> =>
    machine<Some<T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        if (event.kind === 'break') return [_, exReturn(false)];
        return predicate(event.value) ? [_, exReturn(true)] : [_, exAwait];
    });
