export const isEmptyObj = (obj: object) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

export const isEmptyArr = (arr: Array<object>) => {
  for (var key in arr) {
    if (arr.hasOwnProperty(key)) return false
  }
  return true
}
