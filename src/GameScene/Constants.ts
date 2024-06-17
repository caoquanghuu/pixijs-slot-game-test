
import { BlurFilter } from '@pixi/filter-blur';
import { TextStyle } from '@pixi/text';
export namespace AppConstants {
    export const AppSize = {
        width: 720,
        height: 960
    };

    export const textStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440 });

    export const symbolName = {
        symbol1: '1',
        symbol2: '2',
        symbol3: '3',
        symbol4: '4',
        symbol5: '5',
        symbol6: '6',
        symbol7: '7',
        symbol8: '8',
        symbolK: 'K',
    };

    export const eventName = {
        addToScene: 'add-to-scene',
        removeFromScene: 'remove-from-scene',
        activeSpinButton: 'active-spin-button'
    };

    export const logoName = 'logo';

    export const defaultBoard = ['2', '7', '3', '4', '6', '8', '7', '3', 'K', '1', '5', '3', '4', '5', '6'];

    export const text = {
        startSpin: 'Start Spin'
    };


    // free to change number of reels. but when fix more than 5. please handle data sever and default board.
    export const numberOfReels = 5;
    export const numberOfRows = 3;

    export const symbolSize = {
        width: 140,
        height: 150
    };

    // if change speed too fast, please handle positionYMaxOfSymbol by increase it until last result not be remove
    export const speed = 3000;

    export const timeDelayAfterGotData = 2000;
    export const timeDelayBetweenReel = 50;
    export const timeCreateSymbol = (symbolSize.height / (speed) * 1000);

    export const positionYMaxOfSymbol = 450;
    export const positionYCreateSymbol = -375;
    export const positionYStopSpin = -210;
    export const position = {
        logo: { x: AppSize.width / 2, y: 100 },
        mask: { x: 0, y: 275 }
    };

    export const maxLengthOfReel = 6;
    export const maxNumberOfObjects = 15;

    export const boardWidth = symbolSize.width * numberOfReels;
    export const boardHeight = symbolSize.height * numberOfRows;

    export const blurFilter1 = new BlurFilter();
    blurFilter1.blur = 0;
    export const blurFilter2 = new BlurFilter();
    blurFilter2.blur = 5;

    export const acceleration = {
        dropDown : 1,
        maxSlow: -1,
        slowDownRate: 0.03
    };
}