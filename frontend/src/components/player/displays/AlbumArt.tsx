import React from 'react'
import AlbumRoundedIcon from '@material-ui/icons/AlbumRounded';
import "../../../styles/commonComponents.scss"
import { Thumbnail } from '../../../model/store/playback/PlayableTrack';
import toSrcSet from '../../../utils/Srcset';

export default function AlbumArt({ thumbnails }: { thumbnails: Thumbnail[] | null }) {

    if (thumbnails == null) {
        return (
            <AlbumRoundedIcon className="album-art-placeholder" />
        )
    }

    return (
        <div className="album-art">
            <img className="album-art-loaded"
                srcSet={toSrcSet(thumbnails)} alt=""
            />
        </div>
    )
}