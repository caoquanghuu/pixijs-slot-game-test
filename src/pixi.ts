export * from '@pixi/core';
export * from '@pixi/app';
export * from '@pixi/display';
import '@pixi/mixin-get-child-by-name';
import '@pixi/mixin-get-global-position';
export * from '@pixi/sprite';
export * from '@pixi/events';
export * from '@pixi/text';
export * from '@pixi/graphics';

export * from '@pixi/ui';
export * from '@pixi/assets';

// Renderer plugins
import { extensions } from '@pixi/core';
import { BatchRenderer } from '@pixi/core';
extensions.add(BatchRenderer);

// Application plugins
import { TickerPlugin } from '@pixi/core';
extensions.add(TickerPlugin);

// Loader plugins

import { spritesheetAsset } from '@pixi/spritesheet';
extensions.add(spritesheetAsset);
