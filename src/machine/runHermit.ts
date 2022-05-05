import { exContinue, Hermit, HermitAction } from './machine';

export function runHermit<S, U>(hermit: Hermit<S, U>): U {
    let state = hermit.init;
    let action: HermitAction<U> = exContinue;
    try {
        while (action.kind === 'continue') {
            [state, action] = hermit.next(state, action);
        }
        return action.value;
    } finally {
        hermit.done(state);
    }
}
