export default function(Vue) {
  const globalComponentsFn = require.context('./', true, /\.vue$/)
  globalComponentsFn.keys().forEach(path => {
    const componentObj = globalComponentsFn(path).default
    Vue.component(componentObj.name, componentObj)
  })
}