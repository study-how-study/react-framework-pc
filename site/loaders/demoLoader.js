module.exports = function (source) {
  let obj = {
    showCode: source
  }
  obj.showCode = obj.showCode.replace(/import .*? from '(\.\.\/.*?index)'/g, (all, g1) => {
    return all.replace(g1, '@ud/admin-framework')
  })

  source = source + `
let obj = ${JSON.stringify(obj, null, 2)}
export {obj}
  `
  return source
}
