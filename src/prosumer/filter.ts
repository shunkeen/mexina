import { Prosumer, exAwait, exYield, nop } from '../machine/machine';

type Filter<R, T extends R> = Prosumer<R, undefined, T>;
type FilterFunction = {
    <R, T extends R>(predicate: (value: R) => value is T): Filter<R, T>;
    <R>(predicate: (value: R) => boolean): Filter<R, R>;
};

export const filter: FilterFunction = <R, T extends R>(
    predicate: ((value: R) => value is T) | ((value: R) => boolean)
): Filter<R, T> => ({
    done: nop,
    init: undefined,
    next: (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        if (event.kind === 'break') return [_, event];
        const { value } = event;
        return predicate(value) ? [_, exYield(value)] : [_, exAwait];
    },
});
