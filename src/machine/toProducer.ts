import {
    Producer,
    ProducerAction,
    Prosumer,
    ProsumerAction,
    exBreak,
    exContinue,
} from './machine';

export type DeProducer<Q, R, S, T> = readonly [
    Q,
    ProducerAction<R>,
    S,
    ProsumerAction<T>
];

type ToProducer<Q, R, S, T> = Producer<DeProducer<Q, R, S, T>, T>;
export function toProducer<Q, R, S, T>(
    producer: Producer<Q, R>,
    prosumer: Prosumer<R, S, T>
): ToProducer<Q, R, S, T> {
    return {
        init: [producer.init, exContinue, prosumer.init, exContinue],
        next: ([pds, pda, pss, psa]) => {
            if (psa.kind === 'break') return [[pds, pda, pss, psa], exBreak];
            if (psa.kind === 'yield') return [[pds, pda, pss, exContinue], psa];

            if (psa.kind === 'continue')
                return [[pds, pda, ...prosumer.next(pss, psa)], exContinue];

            if (pda.kind === 'continue')
                return [[...producer.next(pds, pda), pss, psa], exContinue];

            const [pss2, psa2] = prosumer.next(pss, pda);
            return pda.kind === 'yield'
                ? [[pds, exContinue, pss2, psa2], exContinue]
                : [[pds, pda, pss2, psa2], exContinue];
        },

        done: ([pds, _, pss, __]) => {
            producer.done(pds);
            prosumer.done(pss);
        },
    };
}
