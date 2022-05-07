import { Consumer, exAwait, exReturn, nop } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type Find<T> = Consumer<T, undefined, ExCatch<T, NotFoundError>>;
export function find<T>(predicate: (value: T) => boolean): Find<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'yield')
                return predicate(event.value)
                    ? [_, exReturn(exReturn(event.value))]
                    : [_, exAwait];

            const error = new NotFoundError('mexina.find: not found');
            const result = exThrow(error);
            return [_, exReturn(result)];
        },
    };
}
