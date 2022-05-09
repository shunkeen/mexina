import {
    Prosumer,
    machine,
    exAwait,
    exBreak,
    exContinue,
    exYield,
} from '../machine/machine';
import { List, nil, cons } from '../datatype/list';

type Reverse<T> = Prosumer<T, readonly [boolean, List<T>], T>;
export const reverse = <T>(): Reverse<T> =>
    machine<Reverse<T>>([false, nil], ([isBroken, list], event) => {
        if (isBroken)
            return list.kind === 'nil'
                ? [[isBroken, list], exBreak]
                : [[isBroken, list.tail], exYield(list.head)];

        if (event.kind === 'break') return [[true, list], exContinue];
        return event.kind === 'continue'
            ? [[isBroken, list], exAwait]
            : [[isBroken, cons(event.value, list)], exAwait];
    });
