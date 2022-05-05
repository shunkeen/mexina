import { Producer, ProducerAction, exContinue } from '../machine/machine';

export function* toGenerator<S, T>(producer: Producer<S, T>): Generator<T> {
    let state = producer.init;
    let action: ProducerAction<T> = exContinue;
    try {
        while (action.kind !== 'break') {
            if (action.kind === 'yield') {
                yield action.value;
                action = exContinue;
            }
            [state, action] = producer.next(state, action);
        }
    } finally {
        producer.done(state);
    }
}
