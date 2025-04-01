import simpleGit, { type SimpleGit } from 'simple-git'
// @ts-ignore
import dayjs from 'dayjs'

import path from 'path'

const git: SimpleGit = simpleGit()

// getFilesCommit(['../1-基础知识/2-JavaScript系列/start.html']).then(res => console.log(JSON.stringify(res)))

/**
 * 批量获取文件的首次提交时间
 * @param {string[]} filePaths 文件路径数组
 * @returns {Promise<{file: string, firstCommit: string}[]>}
 */
export async function getFilesCommit(filePaths) {
  return await Promise.all(
    filePaths.map((filePath) => {
      return git
        .log({ file: path.resolve(__dirname, filePath) })
        .then((data) => {
          return {
            updateTime: dayjs(data.all?.[0]?.date || dayjs()).format('YYYY-MM-DD'),
            createTime: dayjs(data.all?.at?.(-1)?.date || dayjs()).format('YYYY-MM-DD'),
            filePath,
            message: data.all?.length ? '获取成功' : '获取失败',
          }
        })
        .catch((err) => {
          console.log(err)
          return {
            createTime: dayjs().format('YYYY-MM-DD'),
            updateTime: dayjs().format('YYYY-MM-DD'),
            message: '获取失败',
            filePath,
          }
        })
    }),
  )
}
