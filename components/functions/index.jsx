export function convertFD2JSON(formData) {
  let obj = {}
  for (let key of formData.keys()){
    obj[key] = formData.get(key)
  }
  return JSON.stringify(obj)
}

