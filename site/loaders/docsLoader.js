const MT = require('mark-twain')
const fs = require('fs')
const path = require('path')
const { Project } = require('ts-morph')
const packageJson = require('../../package.json')

const lineBreak = process.platform === 'win32' ? /\r\n/g : /\n/g
const project = new Project({})
const projectPath = process.cwd()

let demos = []

const methods = {
  ts: (args, replaceString, source, loaderThis) => {
    if (args.length != 2) {
      throw new Error('参数不合法')
    }

    let [filePath, typeName] = args
    filePath = path.join(loaderThis.context, filePath)
    let tsFile = project.addSourceFileAtPath(filePath)
    let interface = tsFile.getInterfaceOrThrow(typeName)

    function handleProps() {
      let str = '| 参数 | 必传 | 说明 | 类型 | 默认值 | \n'
      str += '| - | - | - | - | - | \n'

      let props = interface.getProperties()
      for (const prop of props) {
        let type = ''
        let desc = '-'
        let defValue = '-'

        let docs = prop.getJsDocs()
        let tags = []
        if (docs.length > 0) {
          desc = docs[0].getDescription().trim().replace(lineBreak, '。')
          tags = docs[0].getTags().map(n => { return { text: n.getText(), define: n } })
        }
        if (tags.find(n => n.text.indexOf('@ignore') == 0)) {
          continue
        }

        let name = prop.getName()
        let required = prop.getText().indexOf(name + '?') == 0 ? '-' : '是'

        let defaultTag = tags.find(n => n.text.indexOf('@default ') == 0)
        if (defaultTag) {
          defValue = defaultTag.define.getComment()
        }
        let typeTag = tags.find(n => n.text.indexOf('@type ') == 0)
        if (typeTag) {
          type = typeTag.text.replace(/@type /g, '') || typeTag.define.getComment()
        }

        if (type == '') {
          type = prop.getType().getText()
        }
        type = type.replace(/import\(.*?\)\./g, '')
        type = type.replace(/ \| /g, ' \\\| ')

        str += `| ${name} | ${required} | ${desc} | ${type || '-'} | ${defValue} | \n`
      }

      return str
    }

    function handleExtends() {
      let str = ''
      let items = interface.getExtends()
      for (let i = 0; i < items.length; i++) {
        let text = items[i].getText()
        if (text.indexOf('Modify<') == 0) {
          text = items[i].getTypeArguments()[0].getText()
        }
        str += `\`${text}\`${(i != items.length - 1) ? ' 、' : ''}`
      }
      if (str) {
        return `> 继承 ${str} \n \n`
      }
      return ''
    }

    function handleRepoFileUrl() {
      let url = `${packageJson.repository.url}/blob/v${packageJson.version}${filePath.replace(projectPath, '')}#L` + interface.getStartLineNumber()
      return `[源文件](${url}) \n \n`
    }

    return `${handleRepoFileUrl()}${handleExtends()}${handleProps()}`
  },
  demo: (args, replaceString, source, loaderThis) => {
    if (args.length != 3) {
      throw new Error('参数不合法')
    }
    let filePath = path.join(loaderThis.context, args[2])
    let demo = {
      key: args[2],
      title: args[0],
      desc: args[1],
      repoFileUrl: toRepoFileUrl(filePath)
    }
    demos.push(demo)
    return ''
  },
  version: (args, replaceString, source, loaderThis) => {
    return packageJson.version
  },
  dependencies: (args, replaceString, source, loaderThis) => {
    let deps = packageJson.dependencies
    let result = ''
    for (const name in deps) {
      result += `- ${name}  -  ${deps[name]} \n`
    }
    return result
  },
  code: (args, replaceString, source, loaderThis) => {
    let [type, fileName] = [...args]
    let filePath = path.join(loaderThis.context, fileName)
    let code = fs.readFileSync(filePath)
    let result = '``` ' + type + '\n'
    result += code + '\n'
    result += '```'
    return result
  },
  repositoryUrl: (args, replaceString, source, loaderThis) => {
    return packageJson.repository.url
  }
}

function toRepoFileUrl(filePath) {
  return `${packageJson.repository.url}/blob/master${filePath.replace(projectPath, '')}`
}

function processor(source, loaderThis) {
  source = source.replace(/<!-- ud-(.*?)\((.*?)\) -->/g, (all, g1, g2) => {
    if (methods[g1]) {
      let args = []
      if (g2 != '') {
        if (g2[0] != '{' || g2[0] != '[') {
          g2 = '[' + g2 + ']'
        }
        args = JSON.parse(g2)
      }
      return methods[g1](args, all, source, loaderThis)
    } else {
      return all
    }
  })
  return source
}

module.exports = function (source) {
  demos = []

  source = processor(source, this)

  let obj = MT(source)
  obj.meta = obj.meta || {}
  obj.meta.repoFileUrl = toRepoFileUrl(this.context)
  obj.demos = demos

  let code = `module.exports = ${JSON.stringify(obj, null, 2)}`
  return code
}
