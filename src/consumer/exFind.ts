import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExOptional, exUndefined } from '../datatype/exOptional';

type Find<R, T extends R> = Consumer<R, undefined, ExOptional<T>>;
type FindFunction = {
    <R, T extends R>(predicate: (value: R) => value is T): Find<R, T>;
    <R>(predicate: (value: R) => boolean): Find<R, R>;
};

export const exFind: FindFunction = <R, T extends R>(
    predicate: ((value: R) => value is T) | ((value: R) => boolean)
): Find<R, T> =>
    machine<Find<R, T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        if (event.kind === 'break') return [_, exReturn(exUndefined)];
        return predicate(event.value)
            ? [_, exReturn(exReturn(event.value))]
            : [_, exAwait];
    });
