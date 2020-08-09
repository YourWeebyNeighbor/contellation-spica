import React from 'react'
import Artist from '../../../model/libraryEntities/Artist'
import ArtistCard from './ArtistCard'
import { ColorSet } from '../../../utils/ColorTools'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    list: {
        marginTop: 5,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        minHeight: 24,
    }
})

export default function ArtistList({ artists, colors }: { artists: Artist[], colors: ColorSet }) {
    const styles = useStyles()

    const cards = artists.map((artist: Artist) => {
        return (
            <ArtistCard key={artist.uuid} name={artist.name} avatarPath={null} background={colors.text} text={colors.background} />
        )
    })

    return (
        <div className={styles.list}>
            {cards}
        </div>
    )
}