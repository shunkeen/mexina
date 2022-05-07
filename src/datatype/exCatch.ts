import { ExReturn, exReturn } from '../machine/machine';

type Guard<E extends Error> = (cause: unknown) => cause is E;
export type ExCatch<T, E extends Error> = ExReturn<T> | ExThrow<E>;

export function exCatch<E extends Error>(guard: Guard<E>) {
    return <T>(thunk: () => T): ExCatch<T, E> => {
        try {
            return exReturn(thunk());
        } catch (cause) {
            if (guard(cause)) return exThrow(cause);
            if (cause instanceof Error) throw exThrow(cause);
            throw cause;
        }
    };
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
