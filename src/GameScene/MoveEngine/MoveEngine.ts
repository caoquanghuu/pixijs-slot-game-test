import { AppConstants } from '../Constants';
import { MoveStatus } from '../Type';

export class MoveEngine {
    private _moveStatus: MoveStatus = MoveStatus.stop;
    private _acceleration: number = 0;

    constructor() {
    }

    set moveStatus(moveStatus: MoveStatus) {
        this._moveStatus = moveStatus;

    }

    get moveStatus(): MoveStatus {
        return this._moveStatus;
    }

    get acceleration(): number {
        return this._acceleration;
    }

    public update(): void {

        // set acceleration to 0 and stop move
        if (this._moveStatus === MoveStatus.stop) {
            this._acceleration = 0;
            return;
        }

        // check moving status and set acceleration
        if (this._moveStatus === MoveStatus.moving) {
            this._acceleration = AppConstants.acceleration.dropDown;
        }

        // slowly stop and bound back
        if (this._moveStatus === MoveStatus.slowly) {

            // stop
            if (this._acceleration < AppConstants.acceleration.maxSlow) {
                this._moveStatus = MoveStatus.stop;
            }

            // speed reduce to bound back
            this._acceleration -= AppConstants.acceleration.slowDownRate;
        }
    }
}