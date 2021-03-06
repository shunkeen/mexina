import {
    filter,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    toArray,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const odd = (x: number): boolean => x % 2 === 1;
    const array = exArray<number>([]).pipe(filter(odd)).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const odd = (x: number): boolean => x % 2 === 1;
    const array = exArray([1, 2, 3]).pipe(filter(odd)).get;
    expect(array).toStrictEqual([1, 3]);
});

test('empty with type guard', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exArray<number | string>([]).pipe(filter(isString)).get;
    expect(array.length).toBe(0);

    const _: ReadonlyArray<string> = array;
    void _; // type test
});

test('non empty with type guard', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exArray(['a', 2, 'c']).pipe(filter(isString)).get;
    expect(array).toStrictEqual(['a', 'c']);

    const _: ReadonlyArray<string> = array;
    void _; // type test
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3];
    }

    const odd = (x: number): boolean => x % 2 === 1;
    const array = exGenerator(generator()).pipe(filter(odd)).end(toArray());
    expect(array).toStrictEqual([1, 3]);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3];
        },
    };

    const odd = (x: number): boolean => x % 2 === 1;
    const array = exIterable(iterable).pipe(filter(odd)).end(toArray());
    expect(array).toStrictEqual([1, 3]);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, llNil));
    const llNil = lazyList<number>(() => nil);

    const odd = (x: number): boolean => x % 2 === 1;
    const array = exLazyList(ll1).pipe(filter(odd)).end(toArray());
    expect(array).toStrictEqual([1, 3]);
});
