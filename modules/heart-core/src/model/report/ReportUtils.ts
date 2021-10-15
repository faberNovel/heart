const getNormalizedNote = ({
  normalizedNote,
  note,
}: {
  normalizedNote?: number
  note?: string
}): number => {
  if (normalizedNote !== undefined) {
    return normalizedNote;
  }
  if (note !== undefined) {
    return parseInt(note, 10);
  }
  return 0;
};

const ReportUtils = { getNormalizedNote };
export default ReportUtils;
