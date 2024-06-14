/* eslint-disable no-unused-vars */
import { BaseObject } from './BaseObject';


export type ReleaseObjectFn = (id: string) => BaseObject;

export type ReturnObjectFn = (object: BaseObject) => void;

export enum MoveStatus {
    moving,
    slowly,
    stop
}
