const fs = require('fs')
const path = require('path')

if (process.argv.length < 4) {
    console.log(`参数错误，应为：node index.js "sourceDir" "targetDir"`)
    return
}
const sourceDir = path.resolve(process.argv[2])
const targetDir = path.resolve(process.argv[3])

function overrideFile(sPath, destPath) {
    fs.readFile(sPath, (err, buffer) => {
        if (err) console.error(sPath, err)
        fs.writeFile(destPath, buffer, () => {
            console.log('替换成功', destPath)
        })
    })
}

function override(sPath, destPath) {
    findPath(destPath, (data) => {
        const src = data.src
        const stat = data.stat
        if (stat.isFile() && path.basename(src) === path.basename(sPath)) {
            overrideFile(sPath, src)
        } else if (stat.isDirectory()) {
            // 递归
            override(src)
        }
    })
}

function findPath(destPath, cb) {
    fs.readdir(destPath, (err, files) => {
        if (err) throw err
        files.forEach(filename => {
            const src = path.join(destPath, filename)
            fs.stat(src, function (err, stat) {
                cb({ stat, src })
            })
        })
    })
}

function readyFiles(dir, tDir) {
    findPath(dir, (data) => {
        if (data.stat.isFile()) {
            override(data.src, tDir)
        } else if (data.stat.isDirectory()) {
            // 递归
            readyFiles(dir)
        }
    })
}

readyFiles(sourceDir, targetDir)

//override(path.resolve(__dirname, './path1/bt_com_menu_cart_active.png'), path.resolve(__dirname, './path2'))
