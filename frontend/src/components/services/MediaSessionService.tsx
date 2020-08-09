import React from 'react';
import { observer } from 'mobx-react';
import PlaybackStore from '../../model/store/playback/PlaybackStore';

const MediaSessionService = observer(({ store }: { store: PlaybackStore }) => {

    const track = store.current
    const mediaSession = navigator.mediaSession

    if (mediaSession != null) {

        if (track != null) {

            mediaSession.metadata = new MediaMetadata({
                title: track.name,
                artist: (track.artists || []).map(artist => artist.name).join(", "),
                album: (track.releases || []).map(release => release.name).join(", "),
                artwork: [{ src: track.albumArtUrl }],
            })
        }

        mediaSession.playbackState = store.playbackState

        mediaSession.setActionHandler('play', store.play)
        mediaSession.setActionHandler('pause', store.pause)
        mediaSession.setActionHandler('nexttrack', store.skipNext)
        mediaSession.setActionHandler('previoustrack', store.skipPrevious)
    }

    return (
        <audio
            loop autoPlay={store.playbackState === "playing"}
            src="data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=="
        />
    )
})

export default MediaSessionService