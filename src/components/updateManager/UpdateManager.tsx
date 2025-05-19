import { useEffect, useState } from 'react';

export default function UpdateManager() {
    const [updateState, setUpdateState] = useState({
        available: false,
        downloaded: false,
        progress: 0,
        error: '',
        version: '',
        currentVersion: ''
    });

    useEffect(() => {
        const getVersion = async () => {
            const versionInfo = await window.electronAPI.getAppVersion();
            setUpdateState(prev => ({ ...prev, currentVersion: versionInfo.version }));
        };

        getVersion();
    }, []);

    useEffect(() => {
        const { electronAPI } = window;

        const updateAvailableHandler = (event: Event, info: { version: string }) => {
            setUpdateState(prev => ({ ...prev, available: true, version: info.version }));
        };

        const progressHandler = (event: Event, progress: { percent: number }) => {
            setUpdateState(prev => ({ ...prev, progress: Math.round(progress.percent) }));
        };

        const updateDownloadedHandler = (event: Event, info: { version: string }) => {
            setUpdateState(prev => ({ ...prev, downloaded: true, version: info.version }));
        };

        const errorHandler = (event: Event, error: string) => {
            setUpdateState(prev => ({ ...prev, error }));
        };

        electronAPI.onUpdateAvailable(updateAvailableHandler);
        electronAPI.onDownloadProgress(progressHandler);
        electronAPI.onUpdateDownloaded(updateDownloadedHandler);
        electronAPI.onUpdateError(errorHandler);

        return () => {
            electronAPI.onUpdateAvailable(updateAvailableHandler);
            electronAPI.onDownloadProgress(progressHandler);
            electronAPI.onUpdateDownloaded(updateDownloadedHandler);
            electronAPI.onUpdateError(errorHandler);
        };
    }, []);

    if (updateState.error) {
        return (
            <div className="update-error">
                Update error: {updateState.error}
            </div>
        );
    }

    if (!updateState.available) return (
        <div>
            current version {updateState.currentVersion}
        </div>
    );

    return (
        <div className="update-manager">
            Downloading update
            {updateState.downloaded ? (
                <div className="update-ready">
                    Version {updateState.version} ready!
                    <button onClick={() => window.electronAPI.restartApp()}>
                        Restart Now
                    </button>
                </div>
            ) : (
                <div className="update-progress">
                    Downloading update {updateState.version}...
                    <progress value={updateState.progress} max="100" />
                    {updateState.progress}%
                </div>
            )}
        </div>
    );
}