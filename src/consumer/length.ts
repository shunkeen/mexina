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
    next: (count, action) => {
        if (action.kind === 'continue') return [count, exAwait];
        return action.kind === 'break'
            ? [count, exReturn(count)]
            : [count + 1, exContinue];
    },
};
