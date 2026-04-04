export function delay(time = 300) {
  return new Promise((res) => {
    setTimeout(() => res(undefined), time)
  })
}
