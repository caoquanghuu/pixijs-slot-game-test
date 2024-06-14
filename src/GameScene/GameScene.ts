import { Container } from '@pixi/display';
import { ObjectPool } from '../ObjectsPool/ObjectsPool';
import { BaseObject } from './BaseObject';
import Server from 'src/Server';
import { AppConstants } from './Constants';
import { Text } from '@pixi/text';
import { Reel } from './Reels/Reel';
import Emitter, { splitData } from './Util';

export class GameScene extends Container {

    private _server: Server;
    private _objectPool: ObjectPool;
    private _spinText: Text;
    private _isRunning: boolean = false;
    private _isDataResponded: boolean =false;
    private _dataResponded: string[] = [];
    private _runningTime: number = -1;
    private _reels: Reel[] = [];

    constructor(sever: Server) {
        super();
        // assign sever
        this._server = sever;
        this._server.registerDataRespondEvent(this._onSpinDataResponded.bind(this));

        // create object pool
        this._objectPool = new ObjectPool();

        this.init();

        this._useEventEffect();

        // create reels and their default data
        const reel1DefaultData = splitData(AppConstants.defaultBoard, 1);
        const reel1 = new Reel(reel1DefaultData, 0, this._releaseObject.bind(this), this._returnObject.bind(this));

        const reel2DefaultData = splitData(AppConstants.defaultBoard, 2);
        const reel2 = new Reel(reel2DefaultData, 1, this._releaseObject.bind(this), this._returnObject.bind(this));

        const reel3DefaultData = splitData(AppConstants.defaultBoard, 3);
        const reel3 = new Reel(reel3DefaultData, 2, this._releaseObject.bind(this), this._returnObject.bind(this));

        const reel4DefaultData = splitData(AppConstants.defaultBoard, 4);
        const reel4 = new Reel(reel4DefaultData, 3, this._releaseObject.bind(this), this._returnObject.bind(this));

        const reel5DefaultData = splitData(AppConstants.defaultBoard, 5);
        const reel5 = new Reel(reel5DefaultData, 4, this._releaseObject.bind(this), this._returnObject.bind(this));

        this._reels.push(reel1, reel2, reel3, reel4, reel5);
    }

    public init() {

        // create logo
        const logo = this._objectPool.releaseObject(AppConstants.logoName);
        logo.position = AppConstants.position.logo;
        this.addChild(logo.sprite);

        // create spin text
        this._spinText = new Text(AppConstants.text.startSpin, AppConstants.textStyle);
        this._spinText.x = AppConstants.AppSize.width / 2 - this._spinText.width / 2;
        this._spinText.y = AppConstants.AppSize.height - 100 + Math.round((100 - this._spinText.height) / 2);
        this.addChild(this._spinText);

        // add event for spin text
        this._spinText.cursor = 'pointer';
        this._spinText.eventMode = 'static';
        this._spinText.addListener('pointerdown', this._startSpin.bind(this));
    }

    private _useEventEffect(): void {
        Emitter.on(AppConstants.eventName.addToScene, this.addChild.bind(this));
        Emitter.on(AppConstants.eventName.removeFromScene, this.removeChild.bind(this));
        Emitter.on(AppConstants.eventName.activeSpinButton, () => {
            this._spinText.filters = [AppConstants.blurFilter1];
            this._spinText.eventMode = 'static';
        });
    }

    private _startSpin(): void {
        console.log(' >>> start spin');

        this._server.requestSpinData();

        this._isRunning = true;
        this._runningTime = 0;

        this._spinText.filters = [AppConstants.blurFilter2];
        this._spinText.eventMode = 'none';
    }

    private _onSpinDataResponded(data: string[]): void {
        console.log(` >>> received: ${data}`);

        setTimeout(() => {
            this._dataResponded = data;

            this._isDataResponded = true;

            this._isRunning = false;

            this._runningTime = 0;
        }, AppConstants.timeDelayAfterGotData);

    }
    /**
     * method to get objects from object pool
     * @param id id of object
     * @returns return object after success get from object pool
     */
    private _releaseObject(id: string): BaseObject {
        return this._objectPool.releaseObject(id);
    }
    /**
     * method return object to object pool after used
     * @param object object to return
     */
    private _returnObject(object: BaseObject): void {
        this._objectPool.returnObject(object);
    }

    public update(dt: number) {

        // update reels
        this._reels.forEach(reel => {
            reel.update(dt);
        });

        // check and update reels when data responded
        if (!this._isRunning && this._isDataResponded) {

            // in case reels is still in  creating symbol progress
            if (this._runningTime === -1) return;
            // in case data is empty
            if (!this._dataResponded) return;

            this._runningTime += 1;

            // when got data then send it to reel to process
            this._reels.forEach((reel, idx) => {

                // delay time to assign data to reels
                if (this._runningTime / AppConstants.timeDelayBetweenReel === (idx + 1)) {

                    reel.isDataResponded = true;
                    const dataOfReel = splitData(this._dataResponded, idx + 1);
                    reel.dataResponded = dataOfReel;

                    this._runningTime++;

                    // in case the last reel have been assign data
                    if (idx === 4) {
                        this._runningTime = -1;
                        this._dataResponded = [];
                        this._isDataResponded = false;
                    }
                }
            });
        }

        // start running and make symbol in reels spin with delay time
        if (this._isRunning) {

            // spin not run yet
            if (this._runningTime === -1) return;

            this._runningTime += 1;

            this._reels.forEach((reel, idx) => {
                if (this._runningTime / AppConstants.timeDelayBetweenReel === (idx + 1)) {
                    reel.isRunning = true;
                    this._runningTime++;

                    // in case the last reel was success running
                    if (idx === 4) this._runningTime = -1;
                }
            });
        }
    }
}