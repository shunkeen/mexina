import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type IndexOf<T> = Consumer<T, number, ExCatch<number, NotFoundError>>;
export const indexOf = <T>(value: T): IndexOf<T> =>
    machine<IndexOf<T>>(0, (count, event) => {
        if (event.kind === 'continue') return [count, exAwait];
        if (event.kind === 'yield')
            return event.value === value
                ? [count, exReturn(exReturn(count))]
                : [count + 1, exAwait];

        const error = new NotFoundError('mexina.indexOf: not found');
        return [count, exReturn(exThrow(error))];
    });
