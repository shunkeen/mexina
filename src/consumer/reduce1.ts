import { Consumer, exAwait, exReturn, nop } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';

type Reduce1<T> = Consumer<T, ExCatch<T, RangeError>, ExCatch<T, RangeError>>;
type Reducer1<T> = (result: T, value: T) => T;

export function reduce1<T>(reducer: Reducer1<T>): Reduce1<T> {
    return {
        done: nop,
        init: exThrow(new RangeError('dummy')),
        next: (result, action) => {
            if (action.kind === 'continue') return [result, exAwait];
            if (result.kind === 'return') {
                return action.kind === 'break'
                    ? [result, exReturn(result)]
                    : [exReturn(reducer(result.value, action.value)), exAwait];
            }

            if (action.kind === 'yield') {
                const first = exReturn(action.value);
                return [first, exAwait];
            }

            const error = new RangeError('mexina.reduce1: index out of range');
            const result2 = exThrow(error);
            return [result2, exReturn(result2)];
        },
    };
}
