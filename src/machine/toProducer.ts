import {
    Producer,
    ProducerAction,
    Prosumer,
    ProsumerAction,
    machine,
    exContinue,
    nop,
} from './machine';

export type DeProducer<Q, R, S, T> = readonly [
    Q,
    ProducerAction<R>,
    S,
    ProsumerAction<T>
];

type ToProducer<Q, R, S, T> = Producer<DeProducer<Q, R, S, T>, T>;
export const toProducer = <Q, R, S, T>(
    producer: Producer<Q, R>,
    prosumer: Prosumer<R, S, T>
): ToProducer<Q, R, S, T> =>
    machine(
        [producer.init, exContinue, prosumer.init, exContinue],

        ([pds, pda, pss, psa]) => {
            if (psa.kind === 'break') return [[pds, pda, pss, psa], psa];
            if (psa.kind === 'yield') return [[pds, pda, pss, exContinue], psa];

            if (psa.kind === 'continue')
                return [[pds, pda, ...prosumer.next(pss, psa)], psa];

            if (pda.kind === 'continue')
                return [[...producer.next(pds, pda), pss, psa], pda];

            const [pss2, psa2] = prosumer.next(pss, pda);
            return pda.kind === 'yield'
                ? [[pds, exContinue, pss2, psa2], exContinue]
                : [[pds, pda, pss2, psa2], exContinue];
        },

        producer.done === nop && prosumer.done === nop
            ? nop
            : ([pds, _, pss, __]) => {
                  producer.done(pds);
                  prosumer.done(pss);
              }
    );
