import React from 'react'
import AlbumRoundedIcon from '@material-ui/icons/AlbumRounded';
import { Thumbnail } from '../../../../model/store/playback/PlayableTrack';
import toSrcSet from '../../../../utils/Srcset';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    image: {
        height: 'inherit',
        width: 'inherit',
        objectFit: 'inherit',
        WebkitUserDrag: 'none'
    }
})

export default function PlayerAlbumArt({ thumbnails }: { thumbnails: Thumbnail[] | null }) {

    const styles = useStyles()

    return (
        thumbnails == null
            ? (
                <AlbumRoundedIcon className={styles.image} />
            )
            : (
                <img className={styles.image}
                    srcSet={toSrcSet(thumbnails)} alt=""
                />
            )
    )
}