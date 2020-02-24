import React, { FunctionComponent } from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import TrackList from './TrackList'
import "../../styles/trackList.scss"

const Queue = observer(({ store, header }: { store: PlaybackStore, header: JSX.Element }) => {
    return (
        <div className="queue">
            <TrackList header={header} tracks={store.queue} />
        </div>
    )
})

export default Queue