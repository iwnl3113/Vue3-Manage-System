export const formatDate = (fmt) => {
    const date = new Date()
    const o = {
        'Y +': date.getFullYear(),
        'M +': date.getMonth() + 1, // 月
        'D +': date.getDate(), // 日
        'h +': date.getHours(), // 时
        'm +': date.getMinutes(), // 分
        's +': date.getSeconds(), // 秒
        W: date.getDay() // 周

    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, () => {
                if (k === 'W') {
                    // 星期几
                    const week = ['日', '一', '二', '三', '四', '五', '六']
                    return week[o[k]]
                } else if (k === 'Y +' || RegExp.$1.length === 1) {
                    // 年份 or 小于10不加0
                    return o[k]
                } else {
                    return ('00' + o[k]).substr(('' + o[k]).length) // 小于10补位0
                }
            })
        }
    }
    return fmt
}