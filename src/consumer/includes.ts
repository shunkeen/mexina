import {
    Consumer,
    exAwait,
    exContinue,
    exReturn,
    nop,
} from '../machine/machine';

type Includes<T> = Consumer<T, undefined, boolean>;
export function includes<T>(value: T): Includes<T> {
    return {
        done: nop,
        init: undefined,
        next: (_, event) => {
            if (event.kind === 'continue') return [_, exAwait];
            if (event.kind === 'break') return [_, exReturn(false)];
            return event.value === value
                ? [_, exReturn(true)]
                : [_, exContinue];
        },
    };
}
