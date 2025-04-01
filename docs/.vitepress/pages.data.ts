// 获取所有markdown的元数据
import { createContentLoader } from 'vitepress'
import { getFilesCommit } from './git-log'

export default {
  async load() {
    const pages = await createContentLoader('**/*.md', {
      // includeSrc: true, // 包含原始文件路径
      // render: true
    }).load()
    const pageInfo = await getFilesCommit(
      pages.map((item) => `..${item.url}`.replace(/(.html$)/, '.md')),
    )
    return pageInfo
  },
}
