// https://github.com/shunkeen/mexina/blob/main/src/index.ts
import {
    tap,
    slice,
    forEach,
    exArray,
    exGenerator,
    exIterable,
    exLazyList,
    LazyList,
    lazyList,
    lazyTail,
} from './index';

function fakeConsole() {
    let accumulator: string[] = [];
    return {
        log(value: string) {
            accumulator.push(value);
        },
        flush() {
            const result = accumulator;
            accumulator = [];
            return result;
        },
    };
}

test('exArray is eager and reusable', () => {
    const console = fakeConsole();

    // 先行評価なのでコンソールにログが表示される
    const exA = exArray([1, 2, 3, 4, 5])
        .pipe(tap((x) => console.log(`exArray-pipe-A: ${x}`)))
        .pipe(slice(1, 3))
        .pipe(tap((x) => console.log(`exArray-pipe-B: ${x}`)));

    expect(console.flush()).toStrictEqual([
        'exArray-pipe-A: 1',
        'exArray-pipe-A: 2',
        'exArray-pipe-A: 3',
        'exArray-pipe-A: 4',
        'exArray-pipe-A: 5',
        'exArray-pipe-B: 2',
        'exArray-pipe-B: 3',
    ]);

    // 結果を再利用可能なので、2回実行すれば2回ともログが表示される
    exA.end(forEach((x) => console.log(`exArray-end: ${x}`)));
    expect(console.flush()).toStrictEqual(['exArray-end: 2', 'exArray-end: 3']);

    exA.end(forEach((x) => console.log(`exArray-end: ${x}`)));
    expect(console.flush()).toStrictEqual(['exArray-end: 2', 'exArray-end: 3']);
});

test('exGenerator is lazy and not reusable', () => {
    const console = fakeConsole();

    // 遅延評価なので無限ループが扱える
    function* infG() {
        while (true) yield* [1, 2, 3, 4, 5];
    }

    // 遅延評価なのでコンソールには何も表示されない
    const exG = exGenerator(infG())
        .pipe(tap((x) => console.log(`exGenerator-pipe-A: ${x}`)))
        .pipe(slice(1, 3))
        .pipe(tap((x) => console.log(`exGenerator-pipe-B: ${x}`)));

    expect(console.flush().length).toBe(0);

    // 2回実行しても1回しかログが表示されない
    exG.end(forEach((x) => console.log(`exGenerator-end: ${x}`)));
    expect(console.flush()).toStrictEqual([
        'exGenerator-pipe-A: 1',
        'exGenerator-pipe-A: 2',
        'exGenerator-pipe-B: 2',
        'exGenerator-end: 2',
        'exGenerator-pipe-A: 3',
        'exGenerator-pipe-B: 3',
        'exGenerator-end: 3',
    ]);

    exG.end(forEach((x) => console.log(`exGenerator-end: ${x}`)));
    expect(console.flush().length).toBe(0);
});

test('exIterable is lazy and reusable(recalculate)', () => {
    const console = fakeConsole();

    // 遅延評価なので無限ループが扱える
    const infI = {
        *[Symbol.iterator]() {
            while (true) yield* [1, 2, 3, 4, 5];
        },
    };

    // 遅延評価なのでコンソールには何も表示されない
    const exI = exIterable(infI)
        .pipe(tap((x) => console.log(`exIterable-pipe-A: ${x}`)))
        .pipe(slice(1, 3))
        .pipe(tap((x) => console.log(`exIterable-pipe-B: ${x}`)));

    expect(console.flush().length).toBe(0);

    // 再計算されるので、2回実行すれば2回ともログが表示される
    exI.end(forEach((x) => console.log(`exIterable-end: ${x}`)));
    expect(console.flush()).toStrictEqual([
        'exIterable-pipe-A: 1',
        'exIterable-pipe-A: 2',
        'exIterable-pipe-B: 2',
        'exIterable-end: 2',
        'exIterable-pipe-A: 3',
        'exIterable-pipe-B: 3',
        'exIterable-end: 3',
    ]);

    exI.end(forEach((x) => console.log(`exIterable-end: ${x}`)));
    expect(console.flush()).toStrictEqual([
        'exIterable-pipe-A: 1',
        'exIterable-pipe-A: 2',
        'exIterable-pipe-B: 2',
        'exIterable-end: 2',
        'exIterable-pipe-A: 3',
        'exIterable-pipe-B: 3',
        'exIterable-end: 3',
    ]);
});

test('exLazyList is lazy and reusable', () => {
    const console = fakeConsole();

    // 遅延評価なので無限ループ（無限リスト）が扱える
    const ll1: LazyList<number> = lazyList(() => lazyTail(1, ll2));
    const ll2 = lazyList(() => lazyTail(2, ll3));
    const ll3 = lazyList(() => lazyTail(3, ll4));
    const ll4 = lazyList(() => lazyTail(4, ll5));
    const ll5 = lazyList(() => lazyTail(5, ll1));

    // 遅延評価なのでコンソールには何も表示されない
    const exL = exLazyList(ll1)
        .pipe(tap((x) => console.log(`exLazyList-pipe-A: ${x}`)))
        .pipe(slice(1, 3))
        .pipe(tap((x) => console.log(`exLazyList-pipe-B: ${x}`)));

    expect(console.flush().length).toBe(0);

    // 結果が再利用されるので、2回実行すれば2回ともログが表示される
    exL.end(forEach((x) => console.log(`exLazyList-end: ${x}`)));
    expect(console.flush()).toStrictEqual([
        'exLazyList-pipe-A: 1',
        'exLazyList-pipe-A: 2',
        'exLazyList-pipe-B: 2',
        'exLazyList-end: 2',
        'exLazyList-pipe-A: 3',
        'exLazyList-pipe-B: 3',
        'exLazyList-end: 3',
    ]);

    exL.end(forEach((x) => console.log(`exLazyList-end: ${x}`)));
    expect(console.flush()).toStrictEqual([
        'exLazyList-end: 2',
        'exLazyList-end: 3',
    ]);
});
