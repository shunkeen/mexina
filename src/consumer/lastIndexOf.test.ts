import {
    lastIndexOf,
    NotFoundError,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('found', () => {
    const x = exArray(['a', 'b', 'b', 'c']).end(lastIndexOf('b'));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(2);
});

test('not found', () => {
    const x = exArray(['a', 'b', 'b', 'c']).end(lastIndexOf('!'));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(NotFoundError);
    expect(x.cause.message).toBe('mexina.lastIndexOf: not found');
});

test('empty', () => {
    const x = exArray([]).end(lastIndexOf('!'));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(NotFoundError);
    expect(x.cause.message).toBe('mexina.lastIndexOf: not found');
});

test('exGenerator', () => {
    function* generator() {
        yield* ['a', 'b', 'b', 'c'];
    }

    const x = exGenerator(generator()).end(lastIndexOf('b'));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(2);
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* ['a', 'b', 'b', 'c'];
        },
    };

    const x = exIterable(iterable).end(lastIndexOf('b'));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(2);
});

test('exLazyList', () => {
    const llA = lazyList(() => lazyTail('a', llB1));
    const llB1 = lazyList(() => lazyTail('b', llB2));
    const llB2 = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llNil));
    const llNil = lazyList<string>(() => nil);

    const x = exLazyList(llA).end(lastIndexOf('b'));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe(2);
});
