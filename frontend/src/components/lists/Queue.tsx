import React from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import TrackList from './TrackList'
import "../../styles/trackList.scss"
import ColorStore from '../../model/store/color/ColorStore'

const Queue = observer(({ store, header, colorStore }: { store: PlaybackStore, header: JSX.Element, colorStore: ColorStore }) => {
    return (
        <div className="queue">
            <TrackList header={header} footer={undefined} tracks={store.queue} colorStore={colorStore}/>
        </div>
    )
})

export default Queue