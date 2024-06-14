import { MoveEngine } from '../GameScene/MoveEngine/MoveEngine';
import { BaseObject } from '../GameScene/BaseObject';
import { AppConstants } from '../GameScene/Constants';

export class ObjectPool {
    private _objectsPool: BaseObject[] = [];

    constructor() {

        // a loop in loop create objects
        for (let i = 1; i < 9; i++) {
            for (let n = 0; n < AppConstants.maxNumberOfObjects; n++) {
                const symbol = new BaseObject(`${i}`);
                symbol.moveEngine = new MoveEngine();
                this._objectsPool.push(symbol);
            }
        }

        for (let n = 0; n < AppConstants.maxNumberOfObjects; n++) {
            const symbol = new BaseObject(AppConstants.symbolName.symbolK);
            symbol.moveEngine = new MoveEngine();
            this._objectsPool.push(symbol);
        }

        // create logo object
        const logo = new BaseObject(AppConstants.logoName);
        this._objectsPool.push(logo);
    }

    public releaseObject(id: string): BaseObject {

        const i = this._objectsPool.findIndex(object => {
            return object.id === id;
        });

        if (i === -1) {
            console.log('object not found');
            return;
        }

        const object = this._objectsPool.splice(i, 1);
        return object[0];
    }

    public returnObject(object: BaseObject): void {

        this._objectsPool.push(object);
    }

}