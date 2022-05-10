import { Consumer } from '../machine/machine';
import { orElse } from './orElse';
import { ExOptional } from '../datatype/exOptional';
import { exLastIndexOf } from './exLastIndexOf';

type LastIndexOf<T> = Consumer<T, LastIndexOfState, number>;
type LastIndexOfState = readonly [number, ExOptional<number>];

export const lastIndexOf = <T>(value: T): LastIndexOf<T> =>
    orElse(-1, exLastIndexOf(value));
