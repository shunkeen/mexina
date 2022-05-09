import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';

type At<T> = Consumer<T, number, ExCatch<T, RangeError>>;
export const at = <T>(index: number): At<T> =>
    index < 0 ? negativeAt() : nonNegativeAt(index);

const negativeAt = <T>(): At<T> =>
    machine<At<T>>(0, (_, __) => {
        const error = new RangeError('mexina.at: negative index');
        return [_, exReturn(exThrow(error))];
    });

const nonNegativeAt = <T>(index: number): At<T> =>
    machine<At<T>>(index, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        if (event.kind === 'yield')
            return count === 0
                ? [count, exReturn(exReturn(event.value))]
                : [count - 1, exAwait];

        const error = new RangeError('mexina.at: index too large');
        return [count, exReturn(exThrow(error))];
    });
