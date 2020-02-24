import React, { useState } from 'react'
import PlayableTrack from '../../model/store/playback/PlayableTrack'
import { observer } from 'mobx-react'
import ArtistList from '../player/displays/ArtistList'
import { DEFAULT_COLORS } from '../player/Player'
import { getCssHsvColorString } from '../../utils/ColorTools'
import { ButtonBase } from '@material-ui/core'
import TrackListItemActionOverlay from './TrackListItemActionOverlay'


const TrackListItem = observer(({ track }: { track: PlayableTrack }) => {

    if (track == null) {
        return null;
    }

    const colors = track.colorSet || DEFAULT_COLORS
    const artists = track.artists == null ? [] : track.artists.slice()

    const style = {
        backgroundColor: getCssHsvColorString(colors.background),
        color: getCssHsvColorString(colors.text)
    }

    return (
        <TrackListItemActionOverlay colors={colors}>
            <div className="track-list-item" style={style}>
                <div className="track-list-item-data">
                    <div className="track-list-item-name">
                        {track.name}
                    </div>
                    <ArtistList artists={artists} colors={colors} />
                </div>
                {track.thumbnail}
            </div>
        </TrackListItemActionOverlay>
    )
})

export default TrackListItem;