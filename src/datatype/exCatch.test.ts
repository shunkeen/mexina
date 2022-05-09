import { exCatch, ExThrow } from '../index';

test('return', () => {
    const exTry = exCatch((cause): cause is Error => {
        return cause instanceof Error;
    });

    const x = exTry(() => 0);
    expect(x.value).toBe(0);
});

test('catch', () => {
    const exTry = exCatch(
        (cause): cause is EvalError | TypeError | RangeError => {
            return (
                cause instanceof EvalError ||
                cause instanceof TypeError ||
                cause instanceof RangeError ||
                false
            );
        }
    );

    const x = exTry(() => {
        throw EvalError('catch');
    });

    expect(x.value).toBe(undefined);

    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(EvalError);
    expect(x.cause.message).toBe('catch');
});

test('rethrow', () => {
    const exTry = exCatch(
        (cause): cause is EvalError | TypeError | RangeError => {
            return (
                cause instanceof EvalError ||
                cause instanceof TypeError ||
                cause instanceof RangeError ||
                false
            );
        }
    );

    const x = (() => {
        try {
            return exTry(() => {
                throw SyntaxError('rethrow');
            });
        } catch (e) {
            if (e instanceof ExThrow) return e;
            throw e;
        }
    })();

    expect(x.value).toBe(undefined);

    if (x.kind === 'return') throw new TypeError();
    expect(x.cause).toBeInstanceOf(SyntaxError);
    expect(x.cause.message).toBe('rethrow');
});

test('rethrow value', () => {
    const exTry = exCatch(
        (cause): cause is EvalError | TypeError | RangeError => {
            return (
                cause instanceof EvalError ||
                cause instanceof TypeError ||
                cause instanceof RangeError ||
                false
            );
        }
    );

    const x = (() => {
        try {
            return exTry(() => {
                throw 'rethrow value';
            });
        } catch (e) {
            return e;
        }
    })();

    expect(x).toBe('rethrow value');
});
