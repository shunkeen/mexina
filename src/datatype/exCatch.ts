import { ExReturn, exReturn } from '../machine/machine';

export type ExCatch<T, E extends Error> = ExReturn<T> | ExThrow<E>;
export function exCatch<T, E extends Error>(
    thunk: () => T,
    guard: (cause: unknown) => cause is E
): ExCatch<T, E> {
    try {
        return exReturn(thunk());
    } catch (cause) {
        if (guard(cause)) {
            return exThrow(cause);
        }
        if (cause instanceof Error) {
            throw exThrow(cause);
        }
        throw cause;
    }
}

export { ExReturn, exReturn } from '../machine/machine';

export class ExThrow<E extends Error> extends Error {
    public readonly kind: 'throw';
    constructor(readonly cause: E) {
        super(`exThrow(${cause.message})`);
        this.name = `ExThrow<${cause.name}>`;
        this.stack = cause.stack;
        this.kind = 'throw';
        Object.setPrototypeOf(this, ExThrow.prototype);
    }
}
export function exThrow<E extends Error>(cause: E): ExThrow<E> {
    return new ExThrow(cause);
}
