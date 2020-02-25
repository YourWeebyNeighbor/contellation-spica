import React from 'react'
import PlayableTrack from '../../model/store/playback/PlayableTrack'
import { observer } from 'mobx-react'
import ArtistList from '../player/displays/ArtistList'
import { DEFAULT_COLORS } from '../player/Player'
import { getCssHsvColorString } from '../../utils/ColorTools'
import TrackListItemActionOverlay from './TrackListItemActionOverlay'
import ColorStore from '../../model/store/color/ColorStore'
import AlbumArt from '../player/displays/AlbumArt'
import { getSmallThumbUrl } from '../../utils/ThumbTools'


const TrackListItem = observer(({ track, colorStore }: { track: PlayableTrack, colorStore: ColorStore }) => {

    if (track == null) {
        return null;
    }

    const thumbUrl = getSmallThumbUrl(track.thumbnails)

    colorStore.extractColor(thumbUrl)

    const colors = thumbUrl != null ? colorStore.cachedColorSets.get(thumbUrl) || DEFAULT_COLORS : DEFAULT_COLORS;

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
                <AlbumArt thumbnails={track.thumbnails}/>
            </div>
        </TrackListItemActionOverlay>
    )
})

export default TrackListItem;