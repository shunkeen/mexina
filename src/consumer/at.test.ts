import { at, exArray } from '../index';

test('first', () => {
    const x = exArray(['a', 'b', 'c']).end(at(0));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('a');
});

test('last', () => {
    const x = exArray(['a', 'b', 'c']).end(at(2));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('c');
});

test('negative index', () => {
    const x = exArray(['a', 'b', 'c']).end(at(-1));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.at: negative index');
});

test('index too large', () => {
    const x = exArray(['a', 'b', 'c']).end(at(3));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.at: index too large');
});

test('empty', () => {
    const x = exArray([]).end(at(0));
    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(RangeError);
    expect(x.cause.message).toBe('mexina.at: index too large');
});
