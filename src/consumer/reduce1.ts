import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';

type Reduce1<T> = Consumer<T, ExCatch<T, RangeError>, ExCatch<T, RangeError>>;
export const reduce1 = <T>(reducer: (result: T, value: T) => T): Reduce1<T> =>
    machine<Reduce1<T>>(exThrow(new RangeError('temp')), (temp, event) => {
        if (event.kind === 'continue') return [temp, exAwait];
        if (temp.kind === 'return') {
            return event.kind === 'break'
                ? [temp, exReturn(temp)]
                : [exReturn(reducer(temp.value, event.value)), exAwait];
        }

        if (event.kind === 'yield') {
            const first = exReturn(event.value);
            return [first, exAwait];
        }

        const error = new RangeError('mexina.reduce1: index out of range');
        const result = exThrow(error);
        return [result, exReturn(result)];
    });
