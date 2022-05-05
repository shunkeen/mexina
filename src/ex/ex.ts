import { Producer, Prosumer, Consumer } from '../machine/machine';
import { DeProducer, toProducer } from '../machine/toProducer';
import { toHermit } from '../machine/toHermit';
import { runHermit } from '../machine/runHermit';

type Pipe<Q, R, S, T> = Ex<DeProducer<Q, R, S, T>, T>;

export type Ex<Q, R> = Readonly<{
    get: Producer<Q, R>;
    then: <T>(transformer: (producer: Producer<Q, R>) => T) => T;
    pipe: <S, T>(prosumer: Prosumer<R, S, T>) => Pipe<Q, R, S, T>;
    end: <S, U>(consumer: Consumer<R, S, U>) => U;
}>;
export function ex<Q, R>(producer: Producer<Q, R>): Ex<Q, R> {
    return {
        get: producer,
        then: (transformer) => transformer(producer),
        pipe: (prosumer) => ex(toProducer(producer, prosumer)),
        end: (consumer) => runHermit(toHermit(producer, consumer)),
    };
}
