import React from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import "../../styles/trackList.scss"
import ColorStore from '../../model/store/color/ColorStore'
import TrackList from '../common/lists/TrackList'

const History = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {
    return (
        <React.Fragment>
            <TrackList direction="down" tracks={store.history.slice().reverse()} colorStore={colorStore} />
        </React.Fragment>
    )
})

export default History