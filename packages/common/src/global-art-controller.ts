import { GameRenderMode } from "./game-render-mode";

export type GlobalArtControllerWindow = {
    ['globalArtController']: {
      loadTokenImage: (tokenId: string, renderMode: GameRenderMode) => Promise<void>;
    };
};
