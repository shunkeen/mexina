import { toIterable, fromArray } from '../index';

test('empty', () => {
    const iterable = toIterable(fromArray<number>([]));
    const iterator = iterable[Symbol.iterator]();
    expect(iterator.next().done).toBe(true);
});

test('non empty', () => {
    const iterable = toIterable(fromArray([1, 2, 3, 4]));
    const iterator = iterable[Symbol.iterator]();
    expect(iterator.next().value).toStrictEqual(1);
    expect(iterator.next().value).toStrictEqual(2);
    expect(iterator.next().value).toStrictEqual(3);
    expect(iterator.next().value).toStrictEqual(4);
    expect(iterator.next().done).toBe(true);
});
