import {
    Producer,
    ProducerAction,
    Prosumer,
    exAwait,
    exContinue,
} from '../machine/machine';

type Concat<S, T> = Prosumer<T, readonly [S, ProducerAction<T>], T>;
export function concat<S, T>(producer: Producer<S, T>): Concat<S, T> {
    return {
        init: [producer.init, exContinue],
        done: ([state, _]) => producer.done(state),
        next: (tuple, event) => {
            if (event.kind === 'continue') return [tuple, exAwait];
            if (event.kind === 'yield') return [tuple, event];

            const [state, action] = tuple;
            if (action.kind === 'break') return [tuple, action];
            return action.kind === 'yield'
                ? [[state, exContinue], action]
                : [producer.next(state, action), action];
        },
    };
}
