import React, { Component, FunctionComponent } from 'react'
import { observer } from 'mobx-react'
import { Virtuoso, GroupedVirtuoso } from 'react-virtuoso'
import PlayableTrack from '../../model/store/playback/PlayableTrack'
import TrackListItem from './TrackListItem'
import "../../styles/trackList.scss"

const TrackList = observer(({ tracks, header }: { tracks: PlayableTrack[], header: JSX.Element }) => {
    return (
        <div className="track-list">
            <GroupedVirtuoso
                item={index => {
                    const track = tracks[index];
                    return <TrackListItem track={track} />
                }}
                groupCounts={[tracks.length]}
                group={index => { return header }}
            />
        </div>
    )
})


export default TrackList