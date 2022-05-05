import { Prosumer, exAwait, exBreak, nop } from '../machine/machine';

type Tap<T> = Prosumer<T, void, T>;
export function tap<T>(body: (value: T) => void): Tap<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, action) => {
            if (action.kind === 'continue') return [_, exAwait];
            return action.kind === 'break'
                ? [_, exBreak]
                : [void body(action.value), action];
        },
    };
}
