import {
    Producer,
    ProducerAction,
    Prosumer,
    exAwait,
    exContinue,
    nop,
} from '../machine/machine';

type Produce<R, S, T> = (value: R) => Producer<S, T>;
type FlatMap<R, S, T> = Prosumer<R, FlatMapState<S, T>, T>;
type FlatMapState<S, T> =
    | undefined
    | readonly [Producer<S, T>, S, ProducerAction<T>];

export function flatMap<R, S, T>(produce: Produce<R, S, T>): FlatMap<R, S, T> {
    return {
        done: nop,
        init: undefined,
        next: (tuple, event) => {
            if (tuple === undefined) {
                if (event.kind === 'continue') return [tuple, exAwait];
                if (event.kind === 'break') return [tuple, event];
                const producer = produce(event.value);
                const init = producer.init;
                return [[producer, init, exContinue], exContinue];
            }

            const [producer, state, action] = tuple;
            if (action.kind === 'yield')
                return [[producer, state, exContinue], action];

            if (action.kind === 'break') {
                producer.done(state);
                return [undefined, exAwait];
            }

            const [state2, action2] = producer.next(state, action);
            return [[producer, state2, action2], exContinue];
        },
    };
}
