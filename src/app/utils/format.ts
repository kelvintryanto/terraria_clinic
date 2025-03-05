export function formatDogAge(age: number): string {
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);

  if (years === 0) {
    return `${months} bulan`;
  }

  if (months === 0) {
    return `${years} tahun`;
  }

  return `${years} tahun ${months} bulan`;
}
