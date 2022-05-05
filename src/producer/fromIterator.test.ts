import { ex, fromIterator, toArray, at } from '../index';

test('empty', () => {
    function* empty() {
        // not yield
    }

    const array = ex(fromIterator(empty())).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    function* generator() {
        yield* ['a', 'b', 'c'];
    }

    const array = ex(fromIterator(generator())).end(toArray());
    expect(array).toStrictEqual(['a', 'b', 'c']);
});

test('infinite', () => {
    function* infinite() {
        while (true) yield* ['a', 'b', 'c'];
    }

    const x = ex(fromIterator(infinite())).end(at(1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});
