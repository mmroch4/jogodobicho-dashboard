export const copyToClipboard = (value: any) => {
  navigator.clipboard.writeText(value);

  return alert("Copiado!");
};
