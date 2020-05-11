import React from 'react'
import { observer } from 'mobx-react'
import PlaybackStore from '../model/store/playback/PlaybackStore'
import MediaSession from '@mebtte/react-media-session';

const MediaSessionController = observer(({ store }: { store: PlaybackStore }) => {
    const track = store.current || null

    return track ? (
        <MediaSession
            title={track.name}
            artist={(track.artists || []).map(artist => artist.name).join(", ")}
            album={(track.releases || []).map(release => release.name).join(", ")}
            artwork={[{ src: track.albumArtUrl, size: "" }]}
            onPlay={store.play}
            onPause={store.pause}
            onPreviousTrack={store.skipPrevious}
            onNextTrack={store.skipNext}
        />
    ) : null
})

export default MediaSessionController