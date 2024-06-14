import EventEmitter from 'eventemitter3';
import { AppConstants } from './Constants';

const eventEmitter = new EventEmitter();
const Emitter = {
    on: (event: string, fn) => eventEmitter.on(event, fn),
    once: (event: string, fn) => eventEmitter.once(event, fn),
    off: (event: string, fn) => eventEmitter.off(event, fn),
    emit: (event: string, payload) => eventEmitter.emit(event, payload),
    remove: () => eventEmitter.removeAllListeners(),
};
Object.freeze(Emitter);
export default Emitter;

const symbolNameArray: string[] = Object.keys(AppConstants.symbolName).map((key) => AppConstants.symbolName[key]);
export function createRandomSymbol(): string {
    const random = Math.floor(Math.random() * symbolNameArray.length);
    return symbolNameArray[random];
}

export function splitData(data: string[], id: number): string[] {
    const result: string[] = [];

    function assignData(idx: number) {
        for (let i = 0; i < 3; i++) {
            result[i] = data[i + idx * 3];
        }
        return result;
    }
    return assignData(id - 1);
}