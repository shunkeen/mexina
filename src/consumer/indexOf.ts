import { Consumer, exAwait, exReturn, nop } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type IndexOf<T> = Consumer<T, number, ExCatch<number, NotFoundError>>;
export function indexOf<T>(value: T): IndexOf<T> {
    return {
        done: nop,
        init: 0,
        next: (count, event) => {
            if (event.kind === 'continue') return [count, exAwait];
            if (event.kind === 'yield')
                return event.value === value
                    ? [count, exReturn(exReturn(count))]
                    : [count + 1, exAwait];

            const error = new NotFoundError('mexina.indexOf: not found');
            const result = exThrow(error);
            return [count, exReturn(result)];
        },
    };
}
