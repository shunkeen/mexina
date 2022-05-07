import { Prosumer, exAwait, exYield, nop } from '../machine/machine';
import { List, nil, cons } from '../datatype/list';

type Reverse<T> = Prosumer<T, List<T>, T>;
export function reverse<T>(): Reverse<T> {
    return {
        done: nop,
        init: nil,
        next: (list, event) => {
            if (event.kind === 'continue') return [list, exAwait];
            if (event.kind === 'yield')
                return [cons(event.value, list), exAwait];

            return list.kind === 'nil'
                ? [list, event]
                : [list.tail, exYield(list.head)];
        },
    };
}
