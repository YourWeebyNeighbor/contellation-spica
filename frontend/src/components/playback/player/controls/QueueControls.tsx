import React from 'react'
import ShuffleIcon from '@material-ui/icons/ShuffleRounded';
import RepeatOneIcon from '@material-ui/icons/RepeatOneRounded';
import QueueMusicIcon from '@material-ui/icons/QueueMusicRounded';
import { HsvColor, getCssHsvColorString } from '../../../../utils/ColorTools';
import { ButtonBase, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    queueControls: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        height: 'fit-content',
        alignSelf: 'center',
    },

    button: {
        height: 30,
        width: 30,

        borderRadius: 15,

        '& svg': {
            height: '80%',
            width: '80%'
        }
    }
})

export default function QueueControls({ base, accent }: { base: HsvColor, accent: HsvColor }) {
    const styles = useStyles()

    return (
        <div className={styles.queueControls}>
            <ButtonBase className={styles.button}>
                <ShuffleIcon style={{ color: getCssHsvColorString(base) }} />
            </ButtonBase>
            <ButtonBase className={styles.button}>
                <RepeatOneIcon style={{ color: getCssHsvColorString(base) }} />
            </ButtonBase>
            <ButtonBase className={styles.button}>
                <QueueMusicIcon style={{ color: getCssHsvColorString(base) }} />
            </ButtonBase>
        </div>
    )
}