function sizeConverter(Num = 0, dec = 2) {
  if (Num < 1000)
    return Num + " Bytes"
  Num = ("0".repeat((Num += "").length * 2 % 3) + Num).match(/.{3}/g)
  return Number(Num[0]) + "." + Num[1].substring(0, dec) + " " + "  kMGTPEZY"[Num.length] + "B"
}

export { sizeConverter }