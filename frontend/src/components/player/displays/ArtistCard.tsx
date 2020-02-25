import React from 'react'
import { HsvColor, getCssHsvColorString } from '../../../utils/ColorTools'
import { Avatar } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'

export default function ArtistCard({ name, background, text, avatarPath }: { name: string, avatarPath: string | null, background: HsvColor, text: HsvColor }) {
    return (
        <div className="artist" style={{ backgroundColor: getCssHsvColorString(background), color: getCssHsvColorString(text) }}>
            {avatarPath == null

                ? (<AccountIcon className="artist-placeholder" />)
                : (<Avatar className="artist-avatar" src={avatarPath} />)
            }

            <div className="artist-name">{name}</div>
        </div>
    )
}