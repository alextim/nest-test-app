export const getRandomFilename = (originalname: string) => {
  const stringDate = new Date().toISOString().slice(0, 10);

  const randomPart = new Array(10)
    .fill(0)
    .map(() => (Math.random() * 10).toFixed(0).toString())
    .join('');

  const normalized = originalname.replace(/\s+/g, '-');

  return `${stringDate}-${randomPart}-${normalized}`;
};
