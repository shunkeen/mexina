import {
    sifter,
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
    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exArray<number | string>([]).pipe(sifter(isString)).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exArray(['a', 2, 'c']).pipe(sifter(isString)).get;
    expect(array).toStrictEqual(['a', 'c']);

    const _: ReadonlyArray<string> = array;
    void _; // type test
});

test('exGenerator', () => {
    function* generator() {
        yield* ['a', 2, 'c'];
    }

    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exGenerator(generator())
        .pipe(sifter(isString))
        .end(toArray());

    expect(array).toStrictEqual(['a', 'c']);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['a', 2, 'c'];
        },
    };

    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exIterable(iterable).pipe(sifter(isString)).end(toArray());
    expect(array).toStrictEqual(['a', 'c']);
});

test('exLazyList', () => {
    const llA = lazyList(() => lazyTail('a', ll2));
    const ll2 = lazyList(() => lazyTail(2, llB));
    const llB = lazyList(() => lazyTail('c', llNil));
    const llNil = lazyList<number | string>(() => nil);

    const isString = (x: unknown): x is string => typeof x === 'string';
    const array = exLazyList(llA).pipe(sifter(isString)).end(toArray());
    expect(array).toStrictEqual(['a', 'c']);
});
