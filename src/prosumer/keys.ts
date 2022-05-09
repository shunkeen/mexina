import { Prosumer, machine, exAwait, exYield } from '../machine/machine';

type Keys = Prosumer<unknown, number, number>;
export const keys: Keys = machine<Keys>(0, (count, event) => {
    if (event.kind === 'continue') return [count, exAwait];
    return event.kind === 'break'
        ? [count, event]
        : [count + 1, exYield(count)];
});
