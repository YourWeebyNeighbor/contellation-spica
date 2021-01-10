import React from 'react'
import AlbumRoundedIcon from '@material-ui/icons/AlbumRounded';
import { Thumbnail } from '../../../model/store/playback/PlayableTrack';
import toSrcSet from '../../../utils/Srcset';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    albumArt: {
        height: '100%',
        width: 'auto',

        position: 'relative',
        zIndex: 1
    },

    placeholder: {
        height: '100%',
        width: 'auto',

        backgroundColor: 'rgb(201, 201, 201)',
        color: 'rgb(51, 51, 51)'
    },

    image: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        WebkitUserDrag: 'none'
    }
})

export default function AlbumArt({ thumbnails }: { thumbnails: Thumbnail[] | null }) {

    const styles = useStyles()

    if (thumbnails == null) {
        return (
            <AlbumRoundedIcon className={styles.placeholder} />
        )
    }

    return (
        <div className={styles.albumArt}>
            <img className={styles.image}
                srcSet={toSrcSet(thumbnails)} alt=""
            />
        </div>
    )
}