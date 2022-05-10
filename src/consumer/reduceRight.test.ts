import {
    reduceRight,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const x = exArray([]).end(reduceRight((x, y) => x + y, 'numbers:'));
    expect(x).toBe('numbers:');
});

test('non empty', () => {
    const x = exArray([1, 2, 3, 4]).end(
        reduceRight((x, y) => x + y, 'numbers:')
    );
    expect(x).toBe('numbers:4321');
});

test('empty reduceRight1', () => {
    const x = (() => {
        try {
            return exArray<number>([]).end(reduceRight((x, y) => x + y));
        } catch (cause) {
            return cause;
        }
    })();

    expect(x).toBeInstanceOf(TypeError);
    if (!(x instanceof TypeError)) throw x;
    expect(x.message).toBe('Reduce of empty with no initial value');
});

test('non empty reduceRight1', () => {
    const x = exArray(['c', 'b', 'a']).end(reduceRight((x, y) => x + y));
    expect(x).toBe('abc');
});

test('exGenerator', () => {
    function* generator() {
        yield* [1, 2, 3, 4];
    }

    const x = exGenerator(generator()).end(
        reduceRight((x, y) => x + y, 'numbers:')
    );
    expect(x).toBe('numbers:4321');
});

test('exIterable', () => {
    const iterable = {
        *[Symbol.iterator]() {
            yield* [1, 2, 3, 4];
        },
    };

    const x = exIterable(iterable).end(
        reduceRight((x, y) => x + y, 'numbers:')
    );
    expect(x).toBe('numbers:4321');
});

test('exLazyList', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const x = exLazyList(ll1).end(reduceRight((x, y) => x + y, 'numbers:'));
    expect(x).toBe('numbers:4321');
});
