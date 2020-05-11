import React from 'react'
import AlbumRoundedIcon from '@material-ui/icons/AlbumRounded';
import "../../../styles/commonComponents.scss"
import { Thumbnail } from '../../../model/store/playback/PlayableTrack';
import toSrcSet from '../../../utils/Srcset';
import { Flipped } from 'react-flip-toolkit';
import { HsvColor, getCssHsvColorString } from '../../../utils/ColorTools';

export default function FixedSizeAlbumArt({ thumbnails, backgroundColor }: { thumbnails: Thumbnail[] | null, backgroundColor: HsvColor }) {

    return (
        <div className="fixed-album-art" style={{ backgroundColor: getCssHsvColorString(backgroundColor, 0.4) }}>
            {thumbnails == null
                ? (
                    <AlbumRoundedIcon className="album-art-placeholder" />
                )
                : (
                    <img className="album-art-loaded"
                        srcSet={toSrcSet(thumbnails)} alt=""
                    />
                )}
        </div>
    )
}