import { Prosumer, machine, exAwait, exYield } from '../machine/machine';

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

const full = <T>(value: T): Fill<unknown, T> =>
    machine<Fill<unknown, T>>(0, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        return event.kind === 'break' ? [_, event] : [_, exYield(value)];
    });

const moderate = <T>(value: T, start: number, end: number): Fill<T, T> =>
    machine<Fill<T, T>>(0, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        if (event.kind === 'break') return [count, event];
        return start <= count && count < end
            ? [count + 1, exYield(value)]
            : [count + 1, event];
    });
