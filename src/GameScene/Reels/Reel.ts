import { Container } from '@pixi/display';
import { BaseObject } from '../BaseObject';
import { AppConstants } from '../Constants';
import { ReleaseObjectFn, ReturnObjectFn } from '../Type';
import Emitter, { createRandomSymbol } from '../Util';
import { Graphics } from '@pixi/graphics';

export class Reel {
    private _reelId: number;
    private _usingSymbols: BaseObject[] = [];
    private _isRunning: boolean = false;
    private _runningTime: number = 0;
    private _isDataResponded: boolean = false;
    private _dataResponded: string[] = [];
    private _symbolContainer: Container;
    private _elementsOfDataRespondCount: number = 0;
    private _releaseObjectCallBack: ReleaseObjectFn;
    private _returnObjectCallBack: ReturnObjectFn;

    constructor(defaultBoard: string[], reelId: number, releaseObjectCall: ReleaseObjectFn, returnObjectCall: ReturnObjectFn) {
        this._releaseObjectCallBack = releaseObjectCall;
        this._returnObjectCallBack = returnObjectCall;

        this._reelId = reelId;

        this._init(defaultBoard);
    }

    private _init(defaultBoard: string[]) {
        // create container contain symbols
        this._symbolContainer = new Container();
        this._symbolContainer.position = { x: AppConstants.AppSize.width / 2, y: AppConstants.AppSize.height / 2 + 100 };

        // create a mask
        const mask = new Graphics();
        mask.beginFill(0xff0000);
        mask.drawRect(AppConstants.position.mask.x, AppConstants.position.mask.y, AppConstants.AppSize.width, AppConstants.symbolSize.height * 3);
        mask.endFill();

        // add mask to container
        this._symbolContainer.mask = mask;

        // add container to game scene
        Emitter.emit(AppConstants.eventName.addToScene, this._symbolContainer);

        // create symbols base on default data
        for (let i = 0; i < 3; i++) {
            const symbol = this._releaseObjectCallBack(defaultBoard[i]);

            const pos = { x: this._reelId * AppConstants.symbolSize.width - AppConstants.boardWidth / 2 + AppConstants.symbolSize.width / 2, y: i * AppConstants.symbolSize.height - AppConstants.boardHeight / 2 };

            symbol.position.x = pos.x;
            symbol.position.y = pos.y;

            this._usingSymbols[i] = symbol;
            this._symbolContainer.addChild(symbol.sprite);
        }
    }

    /**
     * method create symbol on reel
     * @param sym if a symbol was define. this method wont create random symbol
     */
    private _createSymbol(sym?: BaseObject): void {
        let symbol: BaseObject;

        if (sym) {
            symbol = sym;
        } else {
            const randomSymbolName = createRandomSymbol();
            symbol = this._releaseObjectCallBack(randomSymbolName);
        }

        symbol.position.x = this._reelId * AppConstants.symbolSize.width - AppConstants.boardWidth / 2 + AppConstants.symbolSize.width / 2;
        symbol.position.y = AppConstants.positionYCreateSymbol;

        this._usingSymbols.push(symbol);
        this._symbolContainer.addChild(symbol.sprite);

        symbol.isMoving = true;
    }

    set dataResponded(data: string[]) {
        this._dataResponded = data;
    }

    set isDataResponded(isResponded: boolean) {
        this._isDataResponded = isResponded;
    }

    set isRunning(isRunning: boolean) {
        this._isRunning = isRunning;
    }

    public update(dt: number) {
        // update symbols
        this._usingSymbols.forEach((symbol) => {
            // update symbol
            symbol.update(dt);

            // remove symbol if it out of display arena
            if (symbol.position.y > AppConstants.positionYMaxOfSymbol) {
                this._returnObjectCallBack(symbol);
                const i = this._usingSymbols.findIndex(symbolToRemove => symbolToRemove === symbol);
                this._usingSymbols.splice(i, 1);
                this._symbolContainer.removeChild(symbol.sprite);
            }

        });

        // check data received and send event to game scene, this happen in case reel got data or reel stopping
        if (!this._isDataResponded && !this._isRunning) {
            // to define this is case reel stopping and got no data.
            if (!this._dataResponded) return;

            // avoid case game just starting
            if (this._usingSymbols.length < 4) return;

            // in case got data responded
            const idArray: string[] = [];

            // get id from last 3 of symbol and transfer it to string array to compare with data
            for (let i = 3; i > 0; i--) {
                const id = this._usingSymbols[this._usingSymbols.length - i].id;
                idArray[3 - i] = id;
            }

            // compare that idArray to data responded
            if (JSON.stringify(idArray) === JSON.stringify(this._dataResponded)) {

                // define last 3 of usingSymbol array
                const lastSymbol = this._usingSymbols[this._usingSymbols.length - 1];
                const nextSymbol = this._usingSymbols[this._usingSymbols.length - 2];
                const nearNextSymbol = this._usingSymbols[this._usingSymbols.length - 3];

                // they still dropping and if the last symbol move to limit position, they will stop
                if (lastSymbol.position.y >= AppConstants.positionYStopSpin) {

                    // stop move of that 3 symbols
                    lastSymbol.isMoving = false;
                    nextSymbol.isMoving = false;
                    nearNextSymbol.isMoving = false;

                    // reset data
                    this._dataResponded = [];

                    // the spin text will available again
                    if (this._reelId === 4) {
                        Emitter.emit(AppConstants.eventName.activeSpinButton, null);
                    }
                }
            }

        }

        // if data responded, transfer data to object and assign them to this._usingSymbol
        if (this._isDataResponded) {

            // stop create new symbol
            this._isRunning = false;

            // in case all data responded had been transfer to symbol
            if (this._elementsOfDataRespondCount > 2) {
                this._isDataResponded = false;
                this._elementsOfDataRespondCount = 0;
                return;
            }

            this._runningTime += dt;

            // create symbol base on data responded
            if (this._runningTime >= AppConstants.timeCreateSymbol) {
                const symbol = this._releaseObjectCallBack(this._dataResponded[this._elementsOfDataRespondCount]);
                this._createSymbol(symbol);
                this._elementsOfDataRespondCount++;
                this._runningTime = 0;
            }
        }

        // create new symbol when running
        if (this._isRunning) {
            this._runningTime += dt;

            // for handle create symbol when speed is too fast
            if (this._usingSymbols.length > AppConstants.maxLengthOfReel) {
                this._runningTime = 0;
                return;
            }

            if (this._runningTime >= AppConstants.timeCreateSymbol) {
                this._runningTime = 0;
                this._createSymbol();
                this._usingSymbols.forEach(symbol => {
                    symbol.isMoving = true;
                });
            }
        }
    }
}