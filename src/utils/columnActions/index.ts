import _ from 'lodash'

let columnActions = {
  go: (to: string) => {
    let compiledTo = _.template(to)
    return (text: any, record: any, index: number): void => {
      let path = compiledTo(record)
      window.location.hash = path
    }
  }
}

export { columnActions }
