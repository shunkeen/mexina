import {
    ex,
    fromLazyList,
    toArray,
    at,
    LazyList,
    lazyList,
    lazyTail,
    nil,
} from '../index';

test('empty', () => {
    const ll0 = lazyList<number>(() => nil);
    const array = ex(fromLazyList(ll0)).end(toArray());
    expect(array.length).toBe(0);
});

test('non empty', () => {
    const ll1 = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, llNil));
    const llNil = lazyList<number>(() => nil);

    const array = ex(fromLazyList(ll1)).end(toArray());
    expect(array).toStrictEqual([1, 2, 3, 4]);
});

test('infinite', () => {
    const llA: LazyList<string> = lazyList(() => lazyTail('a', llB));
    const llB = lazyList(() => lazyTail('b', llC));
    const llC = lazyList(() => lazyTail('c', llA));

    const x = ex(fromLazyList(llA)).end(at(1));
    if (x.kind === 'throw') throw x;
    expect(x.value).toBe('b');
});
