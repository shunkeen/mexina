import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type FindIndex<T> = Consumer<T, number, ExCatch<number, NotFoundError>>;
export const findIndex = <T>(predicate: (value: T) => boolean): FindIndex<T> =>
    machine<FindIndex<T>>(0, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        if (event.kind === 'yield')
            return predicate(event.value)
                ? [count, exReturn(exReturn(count))]
                : [count + 1, exAwait];

        const error = new NotFoundError('mexina.findIndex: not found');
        return [count, exReturn(exThrow(error))];
    });
