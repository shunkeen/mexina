import {
    Consumer,
    exAwait,
    exContinue,
    exReturn,
    nop,
} from '../machine/machine';

type Lenth = Consumer<unknown, number, number>;
export const length: Lenth = {
    done: nop,
    init: 0,
    next: (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        return event.kind === 'break'
            ? [count, exReturn(count)]
            : [count + 1, exContinue];
    },
};
