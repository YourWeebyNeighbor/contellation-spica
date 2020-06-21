import React from 'react'
import AlbumRoundedIcon from '@material-ui/icons/AlbumRounded';
import { Thumbnail } from '../../../../model/store/playback/PlayableTrack';
import toSrcSet from '../../../../utils/Srcset';
import { HsvColor, getCssHsvColorString } from '../../../../utils/ColorTools';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    albumArt: {
        height: 130,
        width: 130,
    },

    image: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },

    placeholder: {
        height: '100%',
        width: '100%'
    }
})

export default function PlayerAlbumArt({ thumbnails, backgroundColor }: { thumbnails: Thumbnail[] | null, backgroundColor: HsvColor }) {

    const styles = useStyles()

    return (
        <div className={styles.albumArt} style={{ backgroundColor: getCssHsvColorString(backgroundColor, 0.4) }}>
            {thumbnails == null
                ? (
                    <AlbumRoundedIcon className={styles.placeholder} />
                )
                : (
                    <img className={styles.image}
                        srcSet={toSrcSet(thumbnails)} alt=""
                    />
                )}
        </div>
    )
}