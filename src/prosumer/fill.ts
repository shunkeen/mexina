import { Prosumer, exAwait, exYield, nop } from '../machine/machine';

type Fill<R, T> = Prosumer<R, number, T>;
type FillFunction = {
    <T>(value: T): Fill<unknown, T>;
    <T>(value: T, start: number, end?: number): Fill<T, T>;
};

export const fill: FillFunction = <T>(
    value: T,
    start?: number,
    end = Infinity
): Fill<unknown, T> | Fill<T, T> =>
    start === undefined ? full(value) : moderate(value, start, end);

function full<T>(value: T): Fill<unknown, T> {
    return {
        done: nop,
        init: 0,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            return event.kind === 'break' ? [_, event] : [_, exYield(value)];
        },
    };
}

function moderate<T>(value: T, start: number, end: number): Fill<T, T> {
    return {
        done: nop,
        init: 0,
        next: (count, event) => {
            if (event.kind === 'continue') return [count, exAwait];
            if (event.kind === 'break') return [count, event];
            return start <= count && count < end
                ? [count + 1, exYield(value)]
                : [count + 1, event];
        },
    };
}
