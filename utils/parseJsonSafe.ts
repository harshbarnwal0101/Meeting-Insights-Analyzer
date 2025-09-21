/**
 * Attempts to parse a JSON string. If it fails, it tries to extract the first
 * valid JSON object from the string and parse that.
 * @param str The string to parse.
 * @returns The parsed JSON object, or null if parsing fails.
 */
export function parseJsonSafe(str: string): any | null {
  try {
    return JSON.parse(str);
  } catch (e) {
    // If parsing fails, try to find the first '{' and last '}'
    const startIndex = str.indexOf('{');
    const endIndex = str.lastIndexOf('}');
    if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
      const jsonBlock = str.substring(startIndex, endIndex + 1);
      try {
        return JSON.parse(jsonBlock);
      } catch (e2) {
        console.error('Failed to parse extracted JSON block:', e2);
        return null;
      }
    }
    console.error('Failed to parse JSON and could not find a valid block:', e);
    return null;
  }
}
