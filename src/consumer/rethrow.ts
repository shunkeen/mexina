import { machine, Consumer, nop } from '../machine/machine';
import { ExCatch } from '../datatype/exCatch';

type Rethrow<R, S, U> = Consumer<R, S, U>;
export const rethrow = <R, S, U, E extends Error>(
    consumer: Consumer<R, S, ExCatch<U, E>>
): Rethrow<R, S, U> =>
    machine<Rethrow<R, S, U>>(
        consumer.init,
        (state, event) => {
            const [s, action] = consumer.next(state, event);
            if (action.kind !== 'return') return [s, action];
            if (action.value.kind === 'throw') throw action.value.cause;
            return [s, action.value];
        },
        consumer.done === nop ? nop : (state) => consumer.done(state)
    );
