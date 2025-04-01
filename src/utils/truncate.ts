const truncate = (text: string | null | undefined, n: number) => {
  if (!text) return text;

  if (text.length >= n) {
    return text.slice(0, n) + '...'
  }

  return text
}

export default truncate
