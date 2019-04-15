export default function resolveStyleSheet(path, elem) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.onload = resolve;
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    elem.appendChild(link);
  })
}