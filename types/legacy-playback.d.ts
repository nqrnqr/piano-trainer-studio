declare function isFullscreenActive(): boolean;
declare function hideToolbarPanels(): void;
declare function requestAppFullscreen(): Promise<void>;
declare function updatePlayPauseButton(): void;
declare function preserveMusicAreaScroll(callback: () => void): void;
declare function updateTempo(source: 'percent', value: number): void;
