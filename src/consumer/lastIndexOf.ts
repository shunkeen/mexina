import { Consumer, machine, exAwait, exReturn } from '../machine/machine';
import { ExCatch, exThrow } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';

type LastIndexOf<T> = Consumer<T, LastIndexOfState, LastIndexOfResult>;
type LastIndexOfState = readonly [number, LastIndexOfResult];
type LastIndexOfResult = ExCatch<number, NotFoundError>;

export const lastIndexOf = <T>(value: T): LastIndexOf<T> =>
    machine<LastIndexOf<T>>(
        [0, exThrow(new NotFoundError('temp'))],
        ([count, temp], event) => {
            if (event.kind === 'continue') return [[count, temp], exAwait];
            if (event.kind === 'yield') {
                const temp2 = event.value === value ? exReturn(count) : temp;
                return [[count + 1, temp2], exAwait];
            }
            if (temp.kind === 'return') return [[count, temp], exReturn(temp)];

            const error = new NotFoundError('mexina.lastIndexOf: not found');
            const result = exThrow(error);
            return [[count, result], exReturn(result)];
        }
    );
