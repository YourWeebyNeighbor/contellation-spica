import React from 'react'
import { HsvColor, getCssHsvColorString } from '../../utils/ColorTools'
import { Avatar } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircleRounded'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    artist: {
        marginRight: "10px",
        height: "24px",
        maxWidth: "fit-content",

        overflow: "hidden",

        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",

        borderRadius: "12px"
    },

    avatar: {
        height: "24px",
        width: "24px",
        borderRadius: "12px"
    },

    placeholder: {
        height: "24px",
        width: "24px",
        borderRadius: "12px"
    },

    name: {
        marginLeft: "5px",
        marginRight: "10px",
        height: "fit-content",
        alignSelf: "center",

        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",

        fontSize: "11pt",
        fontWeight: "bold"
    }
})

export default function ArtistCard({ name, background, text, avatarPath }: { name: string, avatarPath: string | null, background: HsvColor, text: HsvColor }) {

    const styles = useStyles()

    return (
        <div className={styles.artist} style={{ backgroundColor: getCssHsvColorString(background), color: getCssHsvColorString(text) }}>
            {avatarPath == null

                ? (<AccountIcon className={styles.placeholder} />)
                : (<Avatar className={styles.avatar} src={avatarPath} />)
            }

            <div className={styles.name}>{name}</div>
        </div>
    )
}