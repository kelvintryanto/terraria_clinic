export function formatDogAge(birthYear: string, birthMonth: string): string {
  if (!birthYear || !birthMonth) return 'Unknown';

  const today = new Date();
  const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1);

  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    years--;
  }

  // Calculate months
  const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;

  if (years === 0) {
    return `${months} bulan`;
  } else if (months === 0) {
    return `${years} tahun`;
  } else {
    return `${years} tahun ${months} bulan`;
  }
}
