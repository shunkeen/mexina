import { Consumer, machine, exAwait, exReturn } from '../machine/machine';

type Join = Consumer<string, readonly [boolean, string], string>;
export const join = (separator = ','): Join =>
    machine<Join>([true, ''], ([isFirst, result], event) => {
        if (event.kind === 'continue') return [[isFirst, result], exAwait];
        if (event.kind === 'break')
            return [[isFirst, result], exReturn(result)];

        return isFirst
            ? [[false, event.value], exAwait]
            : [[false, `${result}${separator}${event.value}`], exAwait];
    });
