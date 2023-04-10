import { getRandomStr } from '@/utils/utils'
export default {
  data() {
    return {
      headers: {},
      test: ''
    }
  },
  computed: {},
  methods: {
    onDownload(content, cb = false) {
      try {
        const fileName = window.decodeURI(content.headers['filename'])
        // const random = getRandomStr()
        // const fileName = `${random}.xlsx`
        // this.headers = content
        const blob = new Blob([content.data], {
          type: 'application/vnd.ms-excel'
        })
        // 获取后端设置的文件名称
        // 非IE下载
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
        cb && cb()
      } catch (error) {
        console.log(error)
        this.test = error
        this.$Spin.hide()
        this.$Message.error('操作失败')
      }
    }
  }
}
