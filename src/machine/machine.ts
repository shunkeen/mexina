export type Machine<E, S, A> = Readonly<{
    init: S;
    next: (state: S, event: E) => readonly [S, A];
    done: (state: S) => void;
}>;

export type Hermit<S, U> = Machine<HermitEvent, S, HermitAction<U>>;
export type HermitEvent = ExContinue;
export type HermitAction<U> = ExContinue | ExReturn<U>;

export type Producer<S, T> = Machine<ProducerEvent, S, ProducerAction<T>>;
export type ProducerEvent = ExContinue;
export type ProducerAction<T> = ExBreak | ExContinue | ExYield<T>;

export type Prosumer<R, S, T> = Machine<ProsumerEvent<R>, S, ProsumerAction<T>>;
export type ProsumerEvent<R> = ExBreak | ExContinue | ExYield<R>;
export type ProsumerAction<T> = ExAwait | ExBreak | ExContinue | ExYield<T>;

export type Consumer<R, S, U> = Machine<ConsumerEvent<R>, S, ConsumerAction<U>>;
export type ConsumerEvent<R> = ExBreak | ExContinue | ExYield<R>;
export type ConsumerAction<U> = ExAwait | ExContinue | ExReturn<U>;

export type ExAwait = Readonly<{
    kind: 'await';
}>;
export const exAwait: ExAwait = {
    kind: 'await',
};

export type ExContinue = Readonly<{
    kind: 'continue';
}>;
export const exContinue: ExContinue = {
    kind: 'continue',
};

export type ExBreak = Readonly<{
    kind: 'break';
}>;
export const exBreak: ExBreak = {
    kind: 'break',
};

export type ExReturn<T> = Readonly<{
    kind: 'return';
    value: T;
}>;
export function exReturn<T>(value: T): ExReturn<T> {
    return {
        kind: 'return',
        value,
    };
}

export type ExYield<T> = Readonly<{
    kind: 'yield';
    value: T;
}>;
export function exYield<T>(value: T): ExYield<T> {
    return {
        kind: 'yield',
        value,
    };
}

export function nop(_: unknown): void {
    // nop
}
