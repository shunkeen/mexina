import { Consumer, exAwait, exReturn, nop } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type FindIndex<T> = Consumer<T, number, ExCatch<number, NotFoundError>>;
export function findIndex<T>(predicate: (value: T) => boolean): FindIndex<T> {
    return {
        done: nop,
        init: 0,
        next: (count, event) => {
            if (event.kind === 'continue') return [count, exAwait];
            if (event.kind === 'yield')
                return predicate(event.value)
                    ? [count, exReturn(exReturn(count))]
                    : [count + 1, exAwait];

            const error = new NotFoundError('mexina.findIndex: not found');
            const result = exThrow(error);
            return [count, exReturn(result)];
        },
    };
}
