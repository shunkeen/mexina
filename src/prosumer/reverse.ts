import {
    Prosumer,
    exAwait,
    exContinue,
    exYield,
    nop,
} from '../machine/machine';
import { List, nil, cons } from '../datatype/list';

type Reverse<T> = Prosumer<T, List<T>, T>;
export function reverse<T>(): Reverse<T> {
    return {
        done: nop,
        init: nil,
        next: (list, action) => {
            if (action.kind === 'continue') return [list, exAwait];
            if (action.kind === 'yield')
                return [cons(action.value, list), exContinue];

            return list.kind === 'nil'
                ? [list, action]
                : [list.tail, exYield(list.head)];
        },
    };
}
