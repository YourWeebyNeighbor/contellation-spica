import React from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import ColorStore from '../../model/store/color/ColorStore'
import TrackList from '../common/lists/TrackList'

const Queue = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {
    return (
        <React.Fragment>
            <TrackList direction="up" tracks={store.queue} colorStore={colorStore}/>
        </React.Fragment>
    )
})

export default Queue