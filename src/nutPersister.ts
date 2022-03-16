export class NutPersister<T extends Record<K, (...arg: any) => any>, K extends keyof T = keyof T>{

    constructor(private persisters: Array<T>) { }

    get<J extends K, M extends T[J]>(operationName: J, operation: (op: M) => ReturnType<M>, callback: (persister: T, result: ReturnType<M>) => void, initialValue: ReturnType<M>) {

        let index = 0;

        const result = this.persisters.reduce((prePersister, curPersister, i) => {

            const op = curPersister[operationName].bind(curPersister) as M;

            const result = prePersister || operation(op);

            if (!result) {
                index++;
            }

            return result;
        }, undefined) as ReturnType<M> || initialValue;

        if (index > 0) {
            for (let i = 0; i < index; i++) {
                const persister = this.persisters[i];

                callback(persister, result);
            }
        }

        return result;
    }

    getV2<J extends K, M extends T[J]>(operationName: J, operationParameters: Parameters<M>, callback: (persister: T, result: ReturnType<M>) => void, initialValue: ReturnType<M>) {

        let index = 0;

        const result = this.persisters.reduce((prePersister, curPersister, i) => {

            const op = curPersister[operationName].bind(curPersister) as M;

            const result = prePersister || op.apply(curPersister, operationParameters);

            if (!result) {
                index++;
            }

            return result;
        }, undefined) as ReturnType<M> || initialValue;

        if (index > 0) {
            for (let i = 0; i < index; i++) {
                const persister = this.persisters[i];

                callback(persister, result);
            }
        }

        return result;
    }

    set<J extends K, M extends T[J]>(operationName: J, operation: (op: M) => ReturnType<M>) {
        for (let i = 0; i < this.persisters.length; i++) {
            const persister = this.persisters[i];

            const op = persister[operationName].bind(persister) as M;

            operation(op);
        }
    }

    setV2<J extends K, M extends T[J]>(operationName: J, operationParameters: Parameters<M>) {
        for (let i = 0; i < this.persisters.length; i++) {
            const persister = this.persisters[i];

            const op = persister[operationName].bind(persister) as M;

            op.apply(persister, operationParameters);
        }
    }
}