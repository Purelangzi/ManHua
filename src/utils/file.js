// 引入xlsx和file-saver 实现excel表格导入和导出
import * as XLXS from 'xlsx'
import FileSaver from 'file-saver'

/**
 * 导入表格
 * @param file 当前上传的文件对象
 * @returns 
 */
export const ImportXlsx = file =>{
    return new Promise((resolve, reject) => {
        try {
            let files = { 0: file.raw }
            // 拿到文件的数据
            console.log(files[0], 'file');
            // 创建文件读取对象
            const reader = new FileReader()
            // 开始读取指定的Blob对象或File对象中的内容
            reader.readAsArrayBuffer(files[0])
            // 读取操作完成时触发onload事件,e是事件对象
            reader.onload = e => {
                // 拿到所读取文件的数据
                let data = e.target && e.target.result
                // read方法将data转换成一个workbook 对象（Excel工作簿），type指定了data格式是二进制，cellDates保留单元格中的日期格式
                const workbook = XLXS.read(data, { type: 'binary', cellDates: true })
                // 获取第一个工作表的名称，SheetNames表示工作簿中所有工作表的名称
                const wsname = workbook.SheetNames[0]
                // sheet_to_json将指定名称的工作表转换为一个JSON数组数组
                const outdata = XLXS.utils.sheet_to_json(workbook.Sheets[wsname])
                resolve(outdata)
            }

        } catch (error) {
            // 错误返回个空数组
            reject([])
        }
    })
}