import {
    fill,
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
    const array = exArray<string>([]).pipe(fill('!')).get;
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!')).get;
    expect(array).toStrictEqual(['!', '!', '!']);
});

test('start', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!', 1)).get;
    expect(array).toStrictEqual(['a', '!', '!']);
});

test('end', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!', 0, 2)).get;
    expect(array).toStrictEqual(['!', '!', 'c']);
});

test('start-end', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!', 1, 2)).get;
    expect(array).toStrictEqual(['a', '!', 'c']);
});

test('negative start', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!', -1)).get;
    expect(array).toStrictEqual(['!', '!', '!']);
});

test('start === end', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!', 1, 1)).get;
    expect(array).toStrictEqual(['a', 'b', 'c']);
});

test('start > end', () => {
    const array = exArray(['a', 'b', 'c']).pipe(fill('!', 1, 0)).get;
    expect(array).toStrictEqual(['a', 'b', 'c']);
});

test('exGenerator', () => {
    function* generator() {
        yield* ['a', 'b', 'c'];
    }

    const array = exGenerator(generator()).pipe(fill('!')).end(toArray());
    expect(array).toStrictEqual(['!', '!', '!']);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['a', 'b', 'c'];
        },
    };

    const array = exIterable(iterable).pipe(fill('!')).end(toArray());
    expect(array).toStrictEqual(['!', '!', '!']);
});

test('exLazyList', () => {
    const llA = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llNil));
    const llNil = lazyList<string>(() => nil);

    const array = exLazyList(llA).pipe(fill('!')).end(toArray());
    expect(array).toStrictEqual(['!', '!', '!']);
});
