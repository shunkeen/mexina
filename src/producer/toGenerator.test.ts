import { toGenerator, fromArray } from '../index';

test('empty', () => {
    const g = toGenerator(fromArray<number>([]));
    expect(g.next().done).toBe(true);
});

test('non empty', () => {
    const g = toGenerator(fromArray([1, 2, 3, 4]));
    expect(g.next().value).toStrictEqual(1);
    expect(g.next().value).toStrictEqual(2);
    expect(g.next().value).toStrictEqual(3);
    expect(g.next().value).toStrictEqual(4);
    expect(g.next().done).toBe(true);
});
