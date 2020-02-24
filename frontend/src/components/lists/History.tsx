import React, { FunctionComponent } from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import TrackList from './TrackList'
import "../../styles/trackList.scss"

const History = observer(({ store, header }: { store: PlaybackStore, header: JSX.Element }) => {
    return (
        <div className="history">
            <TrackList header={header} tracks={store.history.reverse()} />
        </div>
    )
})

export default History