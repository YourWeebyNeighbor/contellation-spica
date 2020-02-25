import React from 'react'
import PlaybackStore from '../../model/store/playback/PlaybackStore'
import { observer } from 'mobx-react'
import TrackList from './TrackList'
import "../../styles/trackList.scss"
import ColorStore from '../../model/store/color/ColorStore'

const History = observer(({ store, footer, colorStore }: { store: PlaybackStore, footer: JSX.Element, colorStore: ColorStore }) => {
    return (
        <div className="history">
            <TrackList header={undefined} footer={footer} tracks={store.history.slice().reverse()} colorStore={colorStore}/>
        </div>
    )
})

export default History