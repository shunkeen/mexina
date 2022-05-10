import { Consumer } from '../machine/machine';
import { orElse } from './orElse';
import { exFind } from './exFind';

type Find<R, T extends R> = Consumer<R, undefined, T | undefined>;
type FindFunction = {
    <R, T extends R>(predicate: (value: R) => value is T): Find<R, T>;
    <R>(predicate: (value: R) => boolean): Find<R, R>;
};

export const find: FindFunction = <R, T extends R>(
    predicate: ((value: R) => value is T) | ((value: R) => boolean)
): Find<R, T> | Find<R, R> => orElse(undefined, exFind(predicate));
