import React from 'react';
import { observer } from 'mobx-react';
import PlaybackStore from '../../model/store/playback/PlaybackStore';

const MediaSessionKeeper = observer(({ store }: { store: PlaybackStore }) => {
    return (
        <audio
            loop autoPlay={store.playbackState === "playing"}
            src="data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=="
        />
    )
})

export default MediaSessionKeeper

