import {
    Prosumer,
    exAwait,
    exBreak,
    exContinue,
    exYield,
    nop,
} from '../machine/machine';

type Transformer<R, T> = (array: Array<R>) => ArrayLike<T>;
type Bulk<R, T> = Prosumer<R, BulkState<R, T>, T>;
type BulkState<R, T> = readonly [Array<R>] | readonly [ArrayLike<T>, number];

export function bulk<R, T>(transformer: Transformer<R, T>): Bulk<R, T> {
    return {
        done: nop,
        init: [[]],
        next: (state, action) => {
            if (state.length === 2) {
                const [array, index] = state;
                return 0 <= index && index < array.length
                    ? [[array, index + 1], exYield(array[index])]
                    : [state, exBreak];
            }

            if (action.kind === 'continue') return [state, exAwait];
            if (action.kind === 'break')
                return [[transformer(state[0]), 0], exContinue];

            state[0].push(action.value);
            return [state, exContinue];
        },
    };
}
