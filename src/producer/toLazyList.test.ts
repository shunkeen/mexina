import { toLazyList, fromArray } from '../index';

test('empty', () => {
    const ll = toLazyList(fromArray<number>([]));
    expect(ll.force().kind).toBe('nil');
});

test('non empty', () => {
    const ll = toLazyList(fromArray([1, 2, 3, 4]));
    const list1 = ll.force();
    if (list1.kind === 'nil') throw new TypeError();
    expect(list1.head).toStrictEqual(1);

    const list2 = list1.tail.force();
    if (list2.kind === 'nil') throw new TypeError();
    expect(list2.head).toStrictEqual(2);

    const list3 = list2.tail.force();
    if (list3.kind === 'nil') throw new TypeError();
    expect(list3.head).toStrictEqual(3);

    const list4 = list3.tail.force();
    if (list4.kind === 'nil') throw new TypeError();
    expect(list4.head).toStrictEqual(4);

    const list0 = list4.tail.force();
    expect(list0.kind).toStrictEqual('nil');
});
