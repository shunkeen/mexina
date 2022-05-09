import {
    Hermit,
    Producer,
    ProducerAction,
    Consumer,
    ConsumerAction,
    machine,
    exContinue,
} from './machine';

export type DeHermit<Q, R, S, U> = readonly [
    Q,
    ProducerAction<R>,
    S,
    ConsumerAction<U>
];

type ToHermit<Q, R, S, U> = Hermit<DeHermit<Q, R, S, U>, U>;
export const toHermit = <Q, R, S, U>(
    producer: Producer<Q, R>,
    consumer: Consumer<R, S, U>
): ToHermit<Q, R, S, U> =>
    machine<ToHermit<Q, R, S, U>>(
        [producer.init, exContinue, consumer.init, exContinue],

        ([pds, pda, css, csa]) => {
            if (csa.kind === 'return') return [[pds, pda, css, csa], csa];

            if (csa.kind === 'continue')
                return [[pds, pda, ...consumer.next(css, csa)], csa];

            if (pda.kind === 'continue')
                return [[...producer.next(pds, pda), css, csa], pda];

            const [pss2, psa2] = consumer.next(css, pda);
            return pda.kind === 'yield'
                ? [[pds, exContinue, pss2, psa2], exContinue]
                : [[pds, pda, pss2, psa2], exContinue];
        },

        ([pds, _, css, __]) => {
            producer.done(pds);
            consumer.done(css);
        }
    );
