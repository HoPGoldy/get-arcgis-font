import { DEFAULT_ARCGIS_FONT_URL } from "./config";

/**
 * 解析字体链接
 */
export const getEntrySaveName = (entryUrl: string) => {
    if (entryUrl.startsWith('//') || entryUrl.startsWith('http')) {
        const downloadUrl = entryUrl.endsWith('/') ? entryUrl : `${entryUrl}/`
        const fontName = downloadUrl.split('/').slice(-2)[0]
        return { downloadUrl, fontName }
    }

    return {
        downloadUrl: `${DEFAULT_ARCGIS_FONT_URL}/${entryUrl}/`,
        fontName: entryUrl
    }
}

export const getFontFileName = (i: number) => `${i * 256}-${(i + 1) * 256 - 1}.pbf`