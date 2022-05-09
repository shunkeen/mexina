import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type Length = Consumer<unknown, number, number>;
export const length: Length = machine<Length>(0, (count, event) => {
    if (event.kind === 'continue') return [count, exAwait];
    return event.kind === 'break'
        ? [count, exReturn(count)]
        : [count + 1, exAwait];
});
