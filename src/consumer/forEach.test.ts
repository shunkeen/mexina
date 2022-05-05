import {
    forEach,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const log: number[] = [];
    exArray<number>([]).end(forEach((x) => log.push(x)));
    expect(log.length).toBe(0);
});

test('non empty', () => {
    const log: number[] = [];
    exArray([1, 2, 3, 4]).end(forEach((x) => log.push(x)));
    expect(log).toStrictEqual([1, 2, 3, 4]);
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const log: number[] = [];
    exGenerator(generator()).end(forEach((x) => log.push(x)));
    expect(log).toStrictEqual([1, 2, 3, 4]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const log: number[] = [];
    exIterable(iterable).end(forEach((x) => log.push(x)));
    expect(log).toStrictEqual([1, 2, 3, 4]);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const log: number[] = [];
    exLazyList(ll1).end(forEach((x) => log.push(x)));
    expect(log).toStrictEqual([1, 2, 3, 4]);
});
