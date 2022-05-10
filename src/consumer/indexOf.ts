import { Consumer } from '../machine/machine';
import { orElse } from './orElse';
import { exIndexOf } from './exIndexOf';

type IndexOf<T> = Consumer<T, number, number>;
export const indexOf = <T>(value: T): IndexOf<T> =>
    orElse(-1, exIndexOf(value));
