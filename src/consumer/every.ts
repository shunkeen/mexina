import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type Every<T> = Consumer<T, undefined, boolean>;
export const every = <T>(predicate: (value: T) => boolean): Every<T> =>
    machine<Every<T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        if (event.kind === 'break') return [_, exReturn(true)];
        return predicate(event.value) ? [_, exAwait] : [_, exReturn(false)];
    });
