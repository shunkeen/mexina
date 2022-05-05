export type List<T> = Nil | Cons<T>;

export type Nil = Readonly<{
    kind: 'nil';
}>;
export const nil: Nil = {
    kind: 'nil',
};

export type Cons<T> = Readonly<{
    kind: 'cons';
    head: T;
    tail: List<T>;
}>;
export function cons<T>(head: T, tail: List<T>): Cons<T> {
    return {
        kind: 'cons',
        head,
        tail,
    };
}
