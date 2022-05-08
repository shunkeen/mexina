import { Prosumer, exAwait, exYield, nop } from '../machine/machine';

type Keys = Prosumer<unknown, number, number>;
export const keys: Keys = {
    done: nop,
    init: 0,
    next: (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        return event.kind === 'break'
            ? [count, event]
            : [count + 1, exYield(count)];
    },
};
