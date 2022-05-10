import {
    Producer,
    ProducerAction,
    Prosumer,
    machine,
    exAwait,
    exContinue,
    nop,
} from '../machine/machine';

type Concat<S, T> = Prosumer<T, readonly [S, ProducerAction<T>], T>;
export const concat = <S, T>(producer: Producer<S, T>): Concat<S, T> =>
    machine<Concat<S, T>>(
        [producer.init, exContinue],

        (tuple, event) => {
            if (event.kind === 'continue') return [tuple, exAwait];
            if (event.kind === 'yield') return [tuple, event];

            const [state, action] = tuple;
            if (action.kind === 'break') return [tuple, action];
            return action.kind === 'yield'
                ? [[state, exContinue], action]
                : [producer.next(state, action), action];
        },

        producer.done === nop ? nop : ([state, _]) => producer.done(state)
    );
