import { Application } from './pixi';
import bundles from './bundles.json';
import { AssetsLoader } from './AssetsLoader';
import { GameScene } from './GameScene/GameScene';
import { AppConstants } from './GameScene/Constants';
import Server from './Server';

export class Main {

    public static inst: Main;
    private _gameScene: GameScene;
    private _pixiApp: Application;

    constructor() {
        // Create application
        this._pixiApp = new Application({
            width: AppConstants.AppSize.width,
            height: AppConstants.AppSize.height,
            backgroundColor: 0xefe1de,
            antialias: true,
            resolution: 1
        });

        // @ts-ignore
        document.body.appendChild(this._pixiApp.view);

        this._pixiApp.start();

        this._init();
    }

    private async _init() {

        // load resources
        new AssetsLoader();
        await AssetsLoader.loadBundle(bundles);

        // create scene
        this._gameScene = new GameScene(new Server());

        // Add scene to render stage
        this._pixiApp.stage.addChild(this._gameScene);

        // Update function
        this._pixiApp.ticker.add(this._update.bind(this));

    }


    private _update(deltaTime: number) {

        const dt = deltaTime / 60 * 1000;

        this._gameScene.update(dt);

    }
}


window.onload = () => {
    new Main();
};