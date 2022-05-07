import {
    full,
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
    const array = exArray<number>([]).pipe(full('!')).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray([1, 2, 3]).pipe(full('!')).get;
    expect(array).toStrictEqual(['!', '!', '!']);

    const _: ReadonlyArray<string> = array;
    void _; // type test
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3];
    }

    const array = exGenerator(generator()).pipe(full('!')).end(toArray());
    expect(array).toStrictEqual(['!', '!', '!']);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3];
        },
    };

    const array = exIterable(iterable).pipe(full('!')).end(toArray());
    expect(array).toStrictEqual(['!', '!', '!']);
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, llNil));
    const llNil = lazyList<number>(() => nil);

    const array = exLazyList(ll1).pipe(full('!')).end(toArray());
    expect(array).toStrictEqual(['!', '!', '!']);
});
