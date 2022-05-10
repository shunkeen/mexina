import { machine, Consumer, exReturn, nop } from '../machine/machine';
import { ExOptional } from '../datatype/exOptional';

type OrElse<R, S, U, V> = Consumer<R, S, U | V>;
export const orElse = <R, S, U, V>(
    defaultValue: V,
    consumer: Consumer<R, S, ExOptional<U>>
): OrElse<R, S, U, V> =>
    machine<OrElse<R, S, U, V>>(
        consumer.init,
        (state, event) => {
            const [s, action] = consumer.next(state, event);
            if (action.kind !== 'return') return [s, action];

            const optional = action.value;
            return optional.kind === 'return'
                ? [s, exReturn(optional.value)]
                : [s, exReturn(defaultValue)];
        },
        consumer.done === nop ? nop : (state) => consumer.done(state)
    );
