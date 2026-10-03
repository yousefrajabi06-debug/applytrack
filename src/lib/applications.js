export const stages = ["Saved", "Applied", "Interview", "Offer", "Closed"];
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export function safeUrl(value) {
  if (!value.trim()) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
export const validApplications = (value) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      ["id", "company", "role", "notes", "url", "date", "followUp"].every(
        (key) => typeof item[key] === "string",
      ) &&
      stages.includes(item.stage) &&
      safeUrl(item.url) !== null,
  );
