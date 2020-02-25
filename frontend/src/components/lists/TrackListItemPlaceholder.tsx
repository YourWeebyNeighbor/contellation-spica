import React from 'react'
import ArtistList from '../player/displays/ArtistList'
import { DEFAULT_COLORS } from '../player/Player'
import { getCssHsvColorString } from '../../utils/ColorTools'
import AlbumArt from '../player/displays/AlbumArt'
import Artist from '../../model/libraryEntities/Artist'


const TrackListItemPlaceholder = ({ name }: { name: string }) => {
    const colors = DEFAULT_COLORS;

    const style = {
        backgroundColor: getCssHsvColorString(colors.background),
        color: getCssHsvColorString(colors.text)
    }

    return (
        <div className="track-list-item" style={style}>
            <div className="track-list-item-data">
                <div className="track-list-item-name">
                    {name}
                </div>
                <ArtistList artists={[{ name: "...", uuid: "0" } as Artist]} colors={colors} />
            </div>
            <AlbumArt thumbnails={null} />
        </div>
    )
}

export default TrackListItemPlaceholder;