import { ExReturn } from '../machine/machine';

export type ExOptional<T> = ExReturn<T> | ExUndefined;

export type ExUndefined = Readonly<{
    kind: 'undefined';
}>;
export const exUndefined: ExUndefined = {
    kind: 'undefined',
};
