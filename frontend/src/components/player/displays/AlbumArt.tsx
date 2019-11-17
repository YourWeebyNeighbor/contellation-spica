import React from 'react'
import { ColorExtractor } from 'react-color-extractor'

const AlbumArt: React.FC<{ path: string | null, colorsCallBack: (colors: number[][]) => void }> = ({ path, colorsCallBack }) => {
    console.log("album art rendering - path=" + path);

    return (path == null
        ? (<div className="album-art-placeholder">Album art placeholder</div>)

        : (<ColorExtractor rgb={true} getColors={colorsCallBack}>
            <img src={path} alt="Album" />
        </ColorExtractor>)
    )
}

export default AlbumArt;