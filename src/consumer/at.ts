import { Consumer, exAwait, exReturn, nop } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';

type At<T> = Consumer<T, number, ExCatch<T, RangeError>>;
export function at<T>(index: number): At<T> {
    if (index < 0) {
        const error = new RangeError('mexina.at: negative index');
        const result = exReturn(exThrow(error));
        const next = (_: number, __: unknown) => [_, result] as const;
        return { init: index, next, done: nop };
    }

    return {
        done: nop,
        init: index,
        next: (count, event) => {
            if (event.kind === 'continue') return [count, exAwait];
            if (event.kind === 'yield')
                return count === 0
                    ? [count, exReturn(exReturn(event.value))]
                    : [count - 1, exAwait];

            const error = new RangeError('mexina.at: index too large');
            const result = exReturn(exThrow(error));
            return [count, result];
        },
    };
}
