import { Producer, ProducerAction, exContinue } from '../machine/machine';
import { LazyList, lazyList, nil, lazyTail } from '../datatype/lazyList';
import { exThrow } from '../datatype/exCatch';

export const toLazyList = <S, T>(producer: Producer<S, T>): LazyList<T> =>
    _toLazyList(producer.init, producer);

const _toLazyList = <S, T>(init: S, producer: Producer<S, T>): LazyList<T> =>
    lazyList(() => {
        let state = init;
        let action: ProducerAction<T> = exContinue;
        try {
            while (action.kind === 'continue')
                [state, action] = producer.next(state, action);

            if (action.kind === 'yield')
                return lazyTail(action.value, _toLazyList(state, producer));

            producer.done(state);
            return nil;
        } catch (cause) {
            producer.done(state);
            throw cause instanceof Error ? exThrow(cause) : cause;
        }
    });
