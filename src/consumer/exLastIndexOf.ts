import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExOptional, exUndefined } from '../datatype/exOptional';

type LastIndexOf<T> = Consumer<T, LastIndexOfState, ExOptional<number>>;
type LastIndexOfState = readonly [number, ExOptional<number>];

export const exLastIndexOf = <T>(value: T): LastIndexOf<T> =>
    machine<LastIndexOf<T>>([0, exUndefined], ([count, result], event) => {
        if (event.kind === 'continue') return [[count, result], exAwait];
        if (event.kind === 'break') return [[count, result], exReturn(result)];

        const result2 = event.value === value ? exReturn(count) : result;
        return [[count + 1, result2], exAwait];
    });
