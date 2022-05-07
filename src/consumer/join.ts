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
        next: ([isFirst, result], action) => {
            if (action.kind === 'continue') return [[isFirst, result], exAwait];
            if (action.kind === 'break')
                return [[isFirst, result], exReturn(result)];

            return isFirst
                ? [[false, action.value], exContinue]
                : [[false, `${result}${separator}${action.value}`], exContinue];
        },
    };
}
