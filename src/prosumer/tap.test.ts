import {
    tap,
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
    exArray<number>([])
        .pipe(tap((x) => log.push(x)))
        .end(forEach((x) => log.push(x)));

    expect(log.length).toBe(0);
});

test('non empty', () => {
    const log: number[] = [];
    exArray([1, 2, 3, 4])
        .pipe(tap((x) => log.push(x)))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 2, 3, 4, 1, 2, 3, 4]);
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const log: number[] = [];
    exGenerator(generator())
        .pipe(tap((x) => log.push(x)))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 1, 2, 2, 3, 3, 4, 4]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const log: number[] = [];
    exIterable(iterable)
        .pipe(tap((x) => log.push(x)))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 1, 2, 2, 3, 3, 4, 4]);
});

test('lazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const log: number[] = [];
    exLazyList(ll1)
        .pipe(tap((x) => log.push(x)))
        .end(forEach((x) => log.push(x)));

    expect(log).toStrictEqual([1, 1, 2, 2, 3, 3, 4, 4]);
});
