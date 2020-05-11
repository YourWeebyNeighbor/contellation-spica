import React from 'react'
import Artist from '../../../model/libraryEntities/Artist'
import ArtistCard from './ArtistCard'
import { ColorSet } from '../../../utils/ColorTools'

import '../../../styles/commonComponents.scss'

export default function ArtistList({ artists, colors }: { artists: Artist[], colors: ColorSet }) {
    const cards = artists.map((artist: Artist) => {


        return (
            <ArtistCard key={artist.uuid} name={artist.name} avatarPath={null} background={colors.text} text={colors.background} />
        )
    })

    return (
        <div className="artist-list">
            {cards}
        </div>
    )
}