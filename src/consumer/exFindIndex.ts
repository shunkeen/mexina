import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExOptional, exUndefined } from '../datatype/exOptional';

type FindIndex<T> = Consumer<T, number, ExOptional<number>>;
export const exFindIndex = <T>(
    predicate: (value: T) => boolean
): FindIndex<T> =>
    machine<FindIndex<T>>(0, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        if (event.kind === 'break') return [count, exReturn(exUndefined)];
        return predicate(event.value)
            ? [count, exReturn(exReturn(count))]
            : [count + 1, exAwait];
    });
