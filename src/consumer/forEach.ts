import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type ForEach<T> = Consumer<T, void, void>;
export const forEach = <T>(body: (value: T) => void): ForEach<T> =>
    machine<ForEach<T>>(undefined, (_, event) => {
        if (event.kind === 'continue') return [_, exAwait];
        return event.kind === 'break'
            ? [_, exReturn(_)]
            : [void body(event.value), exAwait];
    });
