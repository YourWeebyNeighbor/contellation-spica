import React from 'react'
import { observer } from 'mobx-react'
import { Virtuoso } from 'react-virtuoso'
import PlayableTrack from '../../model/store/playback/PlayableTrack'
import TrackListItem from './TrackListItem'
import "../../styles/trackList.scss"
import ColorStore from '../../model/store/color/ColorStore'

const TrackList = observer(({ tracks, header, footer, colorStore }: { tracks: PlayableTrack[], header: JSX.Element | undefined, footer: JSX.Element | undefined, colorStore: ColorStore }) => {
    const totalCount = tracks.length + (header ? 1 : 0) + (footer ? 1 : 0)

    return (

        <Virtuoso className="track-list"
            item={index => {
                if (index === 0 && header) {
                    return header
                }

                if (index === totalCount - 1 && footer) {
                    return footer
                }

                const track = tracks[index - (header ? 1 : 0)];
                return <TrackListItem track={track} colorStore={colorStore} />
            }}
            defaultItemHeight={65}
            totalCount={totalCount}
        />
    )
})


export default TrackList