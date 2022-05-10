import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExOptional, exUndefined } from '../datatype/exOptional';

type IndexOf<T> = Consumer<T, number, ExOptional<number>>;
export const exIndexOf = <T>(value: T): IndexOf<T> =>
    machine<IndexOf<T>>(0, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        if (event.kind === 'break') return [count, exReturn(exUndefined)];
        return event.value === value
            ? [count, exReturn(exReturn(count))]
            : [count + 1, exAwait];
    });
