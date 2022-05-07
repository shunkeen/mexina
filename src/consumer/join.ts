import {
    Consumer,
    exAwait,
    exContinue,
    exReturn,
    nop,
} from '../machine/machine';

type Join = Consumer<string, readonly [boolean, string], string>;
export function join(separator = ','): Join {
    return {
        done: nop,
        init: [true, ''],
        next: ([isFirst, result], event) => {
            if (event.kind === 'continue') return [[isFirst, result], exAwait];
            if (event.kind === 'break')
                return [[isFirst, result], exReturn(result)];

            return isFirst
                ? [[false, event.value], exContinue]
                : [[false, `${result}${separator}${event.value}`], exContinue];
        },
    };
}
