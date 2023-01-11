import { emptyDir } from 'fs-extra'
import { writeFile } from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { FETCH_HEADERS as headers } from './config'
import { getEntrySaveName, getFontFileName } from './utils'
import { Presets, SingleBar } from 'cli-progress';

/**
 * 命令参数
 */
interface AppCommandOptions {
    dist: string
    concurrent: string
}

export const downloadFont = async (sourceEntryUrl: string, options: AppCommandOptions): Promise<void> => {
    // console.log('options', sourceEntryUrl, options)
    const { downloadUrl, fontName } = getEntrySaveName(sourceEntryUrl)
    const distDir = path.resolve(process.cwd(), options.dist, fontName)

    await emptyDir(distDir)

    const downloadFormat = 'downloading font source {value}';
    const downloadBar = new SingleBar({ format: downloadFormat, fps: 10 }, Presets.legacy);

    downloadBar.start(0, 0);

    for (let i = 0; true; i += +options.concurrent) {
        downloadBar.update(i)

        const tasks = Array.from({ length: +options.concurrent }, (_, index) => {
            const fileName = getFontFileName(i + index)
            return downloadFile(downloadUrl + fileName, path.resolve(distDir, fileName))
        })
        const results = await Promise.all(tasks)

        if (results.includes(false)) break
    }

    downloadBar.stop()
    console.log(`download complate, save to ${distDir}`)
}

const downloadFile = async (url: string, savePath: string) => {
    const resp = await fetch(url, { headers })
    if (resp.status === 404) return false;

    await writeFile(savePath, await resp.buffer())
    return true;
}