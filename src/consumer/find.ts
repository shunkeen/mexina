import { Consumer } from '../machine/machine';
import { ExCatch } from '../datatype/exCatch';
import { NotFoundError } from '../datatype/notFoundError';
import { makeDetectFunction } from './detect';

type Find<T> = Consumer<T, undefined, ExCatch<T, NotFoundError>>;

const rawFind = makeDetectFunction('find');

export function find<T>(predicate: (value: T) => boolean): Find<T> {
    return rawFind((value): value is T => predicate(value));
}
