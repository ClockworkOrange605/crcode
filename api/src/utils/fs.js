import fs from 'fs'
import path from 'path'
import glob from 'glob'

function copyFolder(from, to) {
  const wildcard = from.indexOf('*') !== -1;
  const pattern = !wildcard && fs.lstatSync(from).isDirectory() ? `${from}/**/*` : from;
  glob.sync(pattern).forEach(file => {
    const fromDirname = path.dirname(from.replace(/\/\*.*/, '/wildcard'));
    const target = file.replace(fromDirname, to);
    const [targetDir, recursive] = [path.dirname(target), true];
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive });
    fs.lstatSync(file).isDirectory() ?
      fs.mkdirSync(target, { recursive }) : fs.copyFileSync(file, target);
  })
}

async function listFolder(path) {
  const dir = await fs.promises.opendir(path)
  const res = []

  let item, total = 0
  while (item = dir.readSync()) {
    const [name, size] = [item.name, fs.statSync(`${path}/${item.name}`).size]

    if (item.isDirectory()) {
      const { files, size } = await listFolder(`${path}/${item.name}/`)
      res.push({ name, size, dir: true, files })
      total += size
    } else {
      res.push({ name, size })
      total += size
    }
  }

  dir.close()
  return { files: res, size: total }
}

export { copyFolder, listFolder }