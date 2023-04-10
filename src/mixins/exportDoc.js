import html2canvas from 'html2canvas'
import JsPdf, { jsPDF } from 'jspdf'

// import docxtemplater from 'docxtemplater'
// import JSZipUtils from 'jszip-utils'
// import { saveAs } from 'file-saver'
// import PizZip from 'pizzip'
// import 'pizzip/dist/pizzip.js'
// import 'pizzip/dist/pizzip-utils.js'

const CONFIG = {
  allowTaint: true,
  taintTest: false,
  useCORS: true,
  dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
  scale: 4
}

export default {
  data() {
    return {}
  },
  computed: {},
  methods: {
    imgToPdf(id, name, textArray = [], cb = false) {
      console.log(
        document.getElementById(id).getElementsByClassName('chart-wrap')
      )
      let PDF = new JsPdf('p', 'pt', [595.28, 1500])
      // #FIXME
      // PDF.addFileToVFS('FZYTK-normal.ttf', font)
      // PDF.addFont('MyFont.ttf', 'FZYTK', 'normal')
      // PDF.setFont('FZYTK')
      // PDF.setFontSize(12)
      const elements = Array.from(
        document.getElementById(id).getElementsByClassName('chart-wrap')
      )
      let totalH = 20
      elements.map(async (element, index) => {
        const canvas = await html2canvas(element, { ...CONFIG })
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = (contentWidth / 555.28) * 841.89
        let leftHeight = contentHeight
        let position = 12
        let imgWidth = 555.28
        let imgHeight = (555.28 / contentWidth) * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let y = totalH
        totalH += imgHeight + 40
        if (leftHeight < pageHeight) {
          // PDF.text(20, y, `${index + 1}. ${textArray[index]}`, {})
          console.log(y, imgWidth, imgHeight)
          PDF.addImage(pageData, 'JPEG', 20, y + 20, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        if (index === elements.length - 1) {
          PDF.save(name + '.pdf')
          cb && cb()
        }
      })
    },
    pageToPdf(id, name, cb = false) {
      html2canvas(
        // 'echarts-item'
        document.getElementById(id).getElementsByClassName('analysis-field')[0],
        {
          allowTaint: true,
          taintTest: false,
          useCORS: true,
          dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
          scale: 4 //按比例增加分辨率}
        }
      ).then(function(canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = (contentWidth / 555.28) * 841.89
        let leftHeight = contentHeight
        let position = 12
        let imgWidth = 555.28
        let imgHeight = (555.28 / contentWidth) * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new jsPDF('p', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(name + '.pdf')
        cb && cb()
      }).catch(reason => {
        console.log(reason)
        })
    }
  }
}
