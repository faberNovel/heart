export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return (error as NodeJS.ErrnoException).code === "ENOENT"
}
