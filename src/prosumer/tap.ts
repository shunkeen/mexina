import { Prosumer, exAwait, exBreak, nop } from '../machine/machine';

type Tap<T> = Prosumer<T, void, T>;
export function tap<T>(body: (value: T) => void): Tap<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            return event.kind === 'break'
                ? [_, exBreak]
                : [void body(event.value), event];
        },
    };
}
