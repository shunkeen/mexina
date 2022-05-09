import { Prosumer, machine, exAwait, exYield } from '../machine/machine';

type Map<R, T> = Prosumer<R, undefined, T>;
export const map = <R, T>(transformer: (value: R) => T): Map<R, T> =>
    machine<Map<R, T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        return event.kind === 'break'
            ? [_, event]
            : [_, exYield(transformer(event.value))];
    });
