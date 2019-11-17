import tinycolor from 'tinycolor2'

export interface RgbColor {
    red: number,
    green: number,
    blue: number
}

export interface HsvColor {
    hue: number,
    saturation: number,
    value: number
}

export interface HslColor {
    hue: number,
    saturation: number,
    lightness: number
}

export interface ColorSet {
    background: HsvColor,
    text: HsvColor,
    accent: HsvColor
}

const VAL_BG = 25
const VAL_TEXT = 80

const SAT_BG_MAX = 40
const SAT_TEXT_MAX = 25

const SAT_ACCENT_MAX = 70
const VAL_ACCENT_MAX = 70
const VAL_ACCENT_MIN = 70


export function getColorSetFromSwatchArray(swatches: number[][]): ColorSet {
    const mainColor = rgbToHsv({ red: swatches[0][0], green: swatches[0][1], blue: swatches[0][2] })
    const secondaryColor = rgbToHsv({ red: swatches[1][0], green: swatches[1][1], blue: swatches[1][2] })

    return {
        background: { hue: mainColor.hue, saturation: Math.min(mainColor.saturation, SAT_BG_MAX), value: VAL_BG },
        text: { hue: mainColor.hue, saturation: Math.min(mainColor.saturation, SAT_TEXT_MAX), value: VAL_TEXT },
        accent: { hue: secondaryColor.hue, saturation: Math.min(secondaryColor.saturation, SAT_ACCENT_MAX), value: Math.min(Math.max(secondaryColor.value, VAL_ACCENT_MIN), VAL_ACCENT_MAX) }
    }
}

export function getCssHsvColorString(color: HsvColor, alpha: number = 1): string {
    return getCssHslColorString(hsvToHsl(color), alpha)
}

export function getCssHslColorString(color: HslColor, alpha: number = 1): string {
    return `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${alpha})`
}

export function hsvToHsl({ hue, saturation, value }: HsvColor): HslColor {
    const converted = tinycolor({ h: hue, s: saturation / 100, v: value / 100 }).toHsl()

    return { hue: converted.h, saturation: converted.s * 100, lightness: converted.l * 100 }
}

export function rgbToHsv({ red, green, blue }: RgbColor): HsvColor {
    const converted = tinycolor({ r: red, g: green, b: blue }).toHsv()

    return { hue: converted.h, saturation: converted.s * 100, value: converted.v * 100 }
}