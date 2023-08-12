function load(num) {
  class Jane {}
  class Tom {
    constructor() {
      this.jane = new Jane()
    }
  }
  let list = Array(num)
    .fill('')
    .map(() => new Tom())
  window.globalList = [list]
}
