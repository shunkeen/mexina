import {
    Prosumer,
    machine,
    exAwait,
    exBreak,
    exContinue,
    exYield,
} from '../machine/machine';

type Bulk<R, T> = Prosumer<R, BulkState<R, T>, T>;
type BulkState<R, T> = readonly [Array<R>] | readonly [ArrayLike<T>, number];

export const bulk = <R, T>(
    transformer: (array: Array<R>) => ArrayLike<T>
): Bulk<R, T> =>
    machine<Bulk<R, T>>([[]], (state, event) => {
        if (state.length === 2) {
            const [array, index] = state;
            return 0 <= index && index < array.length
                ? [[array, index + 1], exYield(array[index])]
                : [state, exBreak];
        }

        if (event.kind === 'break') {
            const array = transformer(state[0]);
            return [[array, 0], exContinue];
        }

        if (event.kind === 'yield') state[0].push(event.value);
        return [state, exAwait];
    });
