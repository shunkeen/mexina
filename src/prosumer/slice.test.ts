import {
    slice,
    tap,
    forEach,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from '../index';

test('empty', () => {
    const array = exArray<number>([]).pipe(slice(1, 3)).get;
    expect(array.length).toBe(0);
});

test('not empty', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(1, 3)).get;
    expect(array).toStrictEqual([2, 3]);
});

test('default start and end', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice()).get;
    expect(array).toStrictEqual([1, 2, 3, 4, 5]);
});

test('default end', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(1)).get;
    expect(array).toStrictEqual([2, 3, 4, 5]);
});

test('start eq length', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(5)).get;
    expect(array.length).toBe(0);
});

test('end eq length', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(0, 5)).get;
    expect(array).toStrictEqual([1, 2, 3, 4, 5]);
});

test('end gt length', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(0, 100)).get;
    expect(array).toStrictEqual([1, 2, 3, 4, 5]);
});

test('start eq end', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(2, 2)).get;
    expect(array.length).toBe(0);
});

test('start gt end', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(3, 1)).get;
    expect(array.length).toBe(0);
});

test('negative start', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(-1, 3)).get;
    expect(array).toStrictEqual([1, 2, 3]);
});

test('negative end', () => {
    const array = exArray([1, 2, 3, 4, 5]).pipe(slice(-3, -1)).get;
    expect(array.length).toBe(0);
});

test('array', () => {
    const log: number[] = [];
    exArray([1, 2, 3, 4])
        .pipe(tap((x) => log.push(x)))
        .pipe(slice(0, 2))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 2, 3, 4, 1, 2]);
});

test('exGenerator', () => {
    function* infinite() {
        while (true) yield* [1, 2, 3, 4];
    }

    const log: number[] = [];
    exGenerator(infinite())
        .pipe(tap((x) => log.push(x)))
        .pipe(slice(0, 2))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 1, 2, 2]);
});

test('exIterable', () => {
    const infinite = {
        *[Symbol.iterator]() {
            while (true) yield* [1, 2, 3, 4];
        },
    };

    const log: number[] = [];
    exIterable(infinite)
        .pipe(tap((x) => log.push(x)))
        .pipe(slice(0, 2))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 1, 2, 2]);
});

test('exLazyList', () => {
    const ll1: LazyList<number> = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, ll1));

    const log: number[] = [];
    exLazyList(ll1)
        .pipe(tap((x) => log.push(x)))
        .pipe(slice(0, 2))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 1, 2, 2]);
});
