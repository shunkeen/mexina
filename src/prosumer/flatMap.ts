import {
    Producer,
    ProducerAction,
    Prosumer,
    machine,
    exAwait,
    exContinue,
} from '../machine/machine';

type FlatMap<R, S, T> = Prosumer<R, FlatMapState<S, T>, T>;
type FlatMapState<S, T> =
    | undefined
    | readonly [Producer<S, T>, S, ProducerAction<T>];

export const flatMap = <R, S, T>(
    transformer: (value: R) => Producer<S, T>
): FlatMap<R, S, T> =>
    machine<FlatMap<R, S, T>>(undefined, (tuple, event) => {
        if (tuple === undefined) {
            if (event.kind === 'continue') return [tuple, exAwait];
            if (event.kind === 'break') return [tuple, event];

            const producer = transformer(event.value);
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
    });
