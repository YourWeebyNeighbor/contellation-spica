import React from 'react'
import ShuffleIcon from '@material-ui/icons/ShuffleRounded';
import RepeatOneIcon from '@material-ui/icons/RepeatOneRounded';
import QueueMusicIcon from '@material-ui/icons/QueueMusicRounded';
import { HsvColor, getCssHsvColorString } from '../../../utils/ColorTools';
import { ButtonBase } from '@material-ui/core';

const INACTIVE_ALPHA = 0.4

export default function QueueControls({ base, accent }: { base: HsvColor, accent: HsvColor }) {
    return (
        <div>
            <ButtonBase className="button-shuffle">
                <ShuffleIcon style={{ color: getCssHsvColorString(accent) }} />
            </ButtonBase>
            <ButtonBase className="button-repeat">
                <RepeatOneIcon style={{ color: getCssHsvColorString(base, INACTIVE_ALPHA) }} />
            </ButtonBase>
            <ButtonBase className="button-queue">
                <QueueMusicIcon style={{ color: getCssHsvColorString(base) }} />
            </ButtonBase>
        </div>
    )
}