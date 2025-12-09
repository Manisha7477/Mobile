export const formatDateTime = (inputDate: string) => {
  const date = new Date(inputDate)
  const formatedDate = `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" },
  )}`

  return formatedDate
}

export const formatDateOnly = (inputDate: string) => {
  const formatedDate =
    inputDate !== undefined && inputDate !== ""
      ? inputDate.split("T").shift()
      : ""

  return formatedDate
}

export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate)
  const formatedDate = `${date.toLocaleDateString('en-GB')}`

  return formatedDate
}
