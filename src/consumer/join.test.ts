import {
    join,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const str = exArray<string>([]).end(join());
    expect(str).toBe('');
});

test('non empty', () => {
    const str = exArray(['a', 'b', 'c']).end(join());
    expect(str).toBe('a,b,c');
});

test('separator', () => {
    const str = exArray(['a', 'b', 'c']).end(join(' >> '));
    expect(str).toBe('a >> b >> c');
});

test('exGenerator', () => {
    function* generator() {
        yield* ['a', 'b', 'c'];
    }

    const str = exGenerator(generator()).end(join());
    expect(str).toBe('a,b,c');
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['a', 'b', 'c'];
        },
    };

    const str = exIterable(iterable).end(join());
    expect(str).toBe('a,b,c');
});

test('exLazyList', () => {
    const llA = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llNil));
    const llNil = lazyList<string>(() => nil);

    const str = exLazyList(llA).end(join());
    expect(str).toBe('a,b,c');
});
