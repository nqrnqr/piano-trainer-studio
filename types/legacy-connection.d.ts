interface Window {
    showMidiPermissionHelp: typeof showMidiPermissionHelp;
    clearMidiPermissionHelp: typeof clearMidiPermissionHelp;
    showWledPermissionHelp: typeof showWledPermissionHelp;
    clearWledPermissionHelp: typeof clearWledPermissionHelp;
}
declare function getLegacyMidiPort(direction: 'input' | 'output', id: string): {state: string} | undefined;
declare function syncMidiOutChannelVisibility(): void;
declare function syncWledStatus(): void;
