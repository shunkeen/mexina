import { Prosumer, exAwait, exBreak, nop } from '../machine/machine';

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
        next: (count, event) => {
            if (count >= end || event.kind === 'break') return [count, exBreak];
            if (event.kind === 'continue') return [count, exAwait];
            return count < start ? [count + 1, exAwait] : [count + 1, event];
        },
    };
}
