import { Consumer, exAwait, exReturn, nop } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type Guard<R, T extends R> = (value: R) => value is T;
type Detect<R, T extends R> = Consumer<R, undefined, ExCatch<T, NotFoundError>>;

export function detect<R, T extends R>(guard: Guard<R, T>): Detect<R, T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'yield')
                return guard(event.value)
                    ? [_, exReturn(exReturn(event.value))]
                    : [_, exAwait];

            const error = new NotFoundError('mexina.detect: not found');
            const result = exThrow(error);
            return [_, exReturn(result)];
        },
    };
}