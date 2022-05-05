import { Producer, ProducerAction, exContinue } from '../machine/machine';
import { LazyList, lazyList, nil, lazyTail } from '../datatype/lazyList';
import { exThrow } from '../datatype/exCatch';

export function toLazyList<S, T>(producer: Producer<S, T>): LazyList<T> {
    return lazyList(() => {
        const { next, done } = producer;
        let state = producer.init;
        let action: ProducerAction<T> = exContinue;
        try {
            while (action.kind === 'continue') {
                [state, action] = next(state, action);
            }
            if (action.kind === 'break') {
                done(state);
                return nil;
            }
            const tail = toLazyList({ init: state, next, done });
            return lazyTail(action.value, tail);
        } catch (cause) {
            done(state);
            throw cause instanceof Error ? exThrow(cause) : cause;
        }
    });
}
