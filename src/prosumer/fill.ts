import { Prosumer, exAwait, exBreak, exYield, nop } from '../machine/machine';

type Fill<T> = Prosumer<T, number, T>;
export function fill<T>(value: T, start = 0, end = Infinity): Fill<T> {
    return {
        done: nop,
        init: 0,
        next: (count, action) => {
            if (action.kind === 'continue') return [count, exAwait];
            if (action.kind === 'break') return [count, exBreak];
            return start <= count && count < end
                ? [count + 1, exYield(value)]
                : [count + 1, action];
        },
    };
}
