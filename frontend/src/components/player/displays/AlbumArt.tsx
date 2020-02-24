import React from 'react'
import { ColorExtractor } from 'react-color-extractor'
import AlbumRoundedIcon from '@material-ui/icons/AlbumRounded';
import "../../../styles/commonComponents.scss"

export default function AlbumArt({ path, colorsCallBack }: { path: string | null, colorsCallBack: (colors: number[][]) => void }) {
    const albumArt = (path == null
        ? (<AlbumRoundedIcon className="placeholder" />)

        : (<ColorExtractor rgb={true} getColors={colorsCallBack}>
            <img src={path} alt="Album" />
        </ColorExtractor>)
    )

    return (
        <div className="album-art">
            {albumArt}
        </div>
    )
}