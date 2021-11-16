export type GlobalArtControllerWindow = {
    ['globalArtController']: {
      loadTokenId: (tokenId: string) => Promise<void>;
    };
};
