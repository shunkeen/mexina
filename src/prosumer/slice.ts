import { Prosumer, machine, exAwait, exBreak } from '../machine/machine';

type Slice<T> = Prosumer<T, number, T>;
export const slice = <T>(start = 0, end = Infinity): Slice<T> =>
    end <= Math.max(0, start) ? empty() : nonEmpty(start, end);

const empty = <T>(): Slice<T> => machine<Slice<T>>(0, () => [0, exBreak]);

const nonEmpty = <T>(start = 0, end = Infinity): Slice<T> =>
    machine<Slice<T>>(0, (count, event) => {
        if (count >= end || event.kind === 'break') return [count, exBreak];
        if (event.kind === 'continue') return [count, exAwait];
        return count < start ? [count + 1, exAwait] : [count + 1, event];
    });
