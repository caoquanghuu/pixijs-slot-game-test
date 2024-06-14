import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../AssetsLoader';
import { IPointData } from 'pixijs';
import { MoveEngine } from './MoveEngine/MoveEngine';
import { MoveStatus } from './Type';
import { AppConstants } from './Constants';

export class BaseObject {
    private _sprite: Sprite;
    private _id: string;
    private _moveEngine: MoveEngine;
    private _isMoving: boolean = false;
    private _speed: number;

    constructor(nameTexture: string) {
        // use name img to create sprite of object
        this._sprite = new Sprite(AssetsLoader.getTexture(nameTexture));

        this._id = nameTexture;

        this._speed = AppConstants.speed;

        // set middle point for sprite
        this._sprite.anchor.set(0.5);

    }

    get position(): IPointData {
        return this.sprite.position;
    }

    set position(position: IPointData) {
        this.sprite.position = position;
    }

    get id(): string {
        return this._id;
    }

    get sprite(): Sprite {
        return this._sprite;
    }

    get moveEngine(): MoveEngine {
        return this._moveEngine;
    }

    set moveEngine(moveEngine: MoveEngine) {
        this._moveEngine = moveEngine;
    }

    get isMoving(): boolean {
        return this._isMoving;
    }

    set isMoving(isMoving: boolean) {
        // return if it duplicate
        if (this._isMoving === isMoving) return;

        // set this is moving
        this._isMoving = isMoving;

        // change texture when moving or stop
        this._changeTexture(isMoving);

        // update move status for move engine
        if (isMoving) {
            this._moveEngine.moveStatus = MoveStatus.moving;
        } else {
            this._moveEngine.moveStatus = MoveStatus.slowly;
        }
    }

    /**
     * method to change sprite of symbol if it running or stopping
     * @param isRunning status of symbol
     */
    private _changeTexture(isMoving: boolean): void {
        if (isMoving) {
            this._sprite.texture = AssetsLoader.getTexture(`${this._id}-blur`);
        } else {
            this._sprite.texture = AssetsLoader.getTexture(`${this._id}`);
        }
    }

    public update(deltaTime: number) {
        // no update for object not move
        if (!this._moveEngine) return;

        this._moveEngine.update();

        this._sprite.position.y = (this._sprite.position.y + ((this._moveEngine.acceleration * (this._speed * deltaTime)) / 1000));
    }
}