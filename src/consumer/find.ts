import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type Find<R, T extends R> = Consumer<R, undefined, ExCatch<T, NotFoundError>>;
type FindFunction = {
    <R, T extends R>(predicate: (value: R) => value is T): Find<R, T>;
    <R>(predicate: (value: R) => boolean): Find<R, R>;
};

export const find: FindFunction = <R, T extends R>(
    predicate: ((value: R) => value is T) | ((value: R) => boolean)
): Find<R, T> =>
    machine<Find<R, T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        if (event.kind === 'yield')
            return predicate(event.value)
                ? [_, exReturn(exReturn(event.value))]
                : [_, exAwait];

        const error = new NotFoundError('mexina.find: not found');
        return [_, exReturn(exThrow(error))];
    });
