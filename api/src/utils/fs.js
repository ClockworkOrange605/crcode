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

async function listFolder(root, current = "/") {
  const dir = await fs.promises.opendir(root)
  let item, total = 0, res = []

  while (item = dir.readSync()) {
    const filePath = { name: item.name, path: current }
    const obj = !item.isDirectory() ? {
      ...filePath, size: fs.statSync(path.join(root, item.name)).size
    } : {
      ...filePath, dir: true,
      ...(await listFolder(path.join(root, item.name), path.join(current, item.name)))
    }

    res.push(obj)
    total += obj.size
  }

  //set folders firts and sort alphabetically
  res.sort((el1, el2) => el1.dir === el2.dir ?
    el1.name.localeCompare(el2.name) : el1.dir ? -1 : 1)

  dir.close()
  return { files: res, size: total }
}

const createFolder = async (currentPath) => fs.mkdirSync(currentPath)
const createFile = async (currentPath) => fs.closeSync(fs.openSync(currentPath, 'w'))

const remove = async (root, filepath, name) =>
  fs.rmSync(path.join(root, filepath, name), { recursive: true })

const rename = async (root, item_path, old_name, new_name) =>
  fs.renameSync(
    path.join(root, item_path, old_name), path.join(root, item_path, new_name))

export { createFile, createFolder, copyFolder, listFolder, rename, remove }