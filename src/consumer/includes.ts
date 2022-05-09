import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type Includes<T> = Consumer<T, undefined, boolean>;
export const includes = <T>(value: T): Includes<T> =>
    machine<Includes<T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        if (event.kind === 'break') return [_, exReturn(false)];
        return event.value === value ? [_, exReturn(true)] : [_, exAwait];
    });
