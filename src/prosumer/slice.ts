import {
    Prosumer,
    exAwait,
    exBreak,
    exContinue,
    nop,
} from '../machine/machine';

type Slice<T> = Prosumer<T, number, T>;
export function slice<T>(start = 0, end = Infinity): Slice<T> {
    if (end <= Math.max(0, start)) {
        return {
            done: nop,
            init: 0,
            next: () => [0, exBreak],
        };
    }

    return {
        done: nop,
        init: 0,
        next: (count, action) => {
            if (count >= end || action.kind === 'break')
                return [count, exBreak];

            if (action.kind === 'continue') return [count, exAwait];
            return count < start
                ? [count + 1, exContinue]
                : [count + 1, action];
        },
    };
}
