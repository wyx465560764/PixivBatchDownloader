import { store } from '../Store'
import { EVT } from '../EVT'
import { fileName } from '../FileName'
import { lang } from '../Lang'
import config from '../Config'

// 预览文件名
class PreviewFileName {
  constructor() {
    this.bindEvent()
  }

  private bindEvent() {
    window.addEventListener(EVT.list.previewFileName, () => {
      this.previewFileName()
    })
  }

  private previewFileName() {
    if (store.result.length === 0) {
      EVT.sendMsg({
        msg: lang.transl('_没有数据可供使用'),
        type: 'error',
      })
      return
    }

    // 使用数组储存和拼接字符串，提高性能
    const resultArr: string[] = []

    const length = store.result.length
    for (let i = 0; i < length; i++) {
      const data = store.result[i]
      // 为默认文件名添加颜色。默认文件名有两种处理方式，一种是取出用其他下载软件下载后的默认文件名，一种是取出本程序使用的默认文件名 data.id。这里使用前者，方便用户用其他下载软件下载后，再用生成的文件名重命名。
      const defaultName = data.original.replace(/.*\//, '')
      const fullName = fileName.getFileName(data)
      let nowResult = `${defaultName}: ${fullName}<br>`

      if (length < config.outputMax) {
        // 为生成的文件名添加颜色。只有当文件数量少于一定数值时才添加颜色。这是因为添加颜色会导致生成的 HTML 元素数量增多，复制时资源占用增加。有些用户电脑配置差，如果生成的结果很多，还添加了颜色，可能复制时会导致这个页面卡死。
        const defaultNameHtml = `<span class="color999">${defaultName}</span>`
        const part = fullName.split('/')
        const length = part.length
        for (let i = 0; i < length; i++) {
          const str = part[i]
          if (i < length - 1) {
            // 如果不是最后一项，说明是文件夹名，添加颜色
            part[i] = `<span class="color666">${str}</span>`
          } else {
            // 最后一项，是文件名，添加颜色
            part[i] = `<span class="color000">${str}</span>`
          }
        }
        const fullNameHtml = part.join('/')
        nowResult = `<p class="result">${defaultNameHtml}: ${fullNameHtml}</p>`
      }

      // 保存本条结果
      resultArr.push(nowResult)
    }

    // 拼接所有结果
    const result = resultArr.join('')
    EVT.fire(EVT.list.output, {
      content: result,
      title: lang.transl('_预览文件名'),
    })
  }
}

new PreviewFileName()
export {}
