/**
 * Places poster-style text inside a container
 *
 * The container will be emptied of whatever children it has (which allows successive invocations).
 *
 * @param {HTMLElement} container
 *  A block element in which to place the text.
 * @param {String} text
 *  The text to typeset
 * @param {Object} options
 *  Options:
 *    - maxLineHeight (default: 0.2) Maximum line height (as a percentage of the block's width)
 *    - minLineHeight (default: 0.044) Minimum line height (as a percentage of the block's width)
 *    - lineSpacing (default: 0) Space, in pixels, to place between lines.
 */
function render(container, text, options = {}) {
  const defaultOptions = {
    maxLineHeight: 0.2,
    minLineHeight: 0.044,
    lineSpacing: 0,
  };

  const { maxLineHeight, minLineHeight, lineSpacing } = Object.assign({}, defaultOptions, options);

  // Clear the container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const lineContainer = document.createElement('div');
  lineContainer.classList.add('line-container');
  container.append(lineContainer);

  let lastHeight = 0;
  const lines = text.split('\n').filter(each => each.length > 0);
  lines.forEach((line) => {
    const words = line.split(' ');
    let fromWord = 0;
    let toWord = 0;

    while (fromWord < words.length) {
      const lineElement = document.createElement('div');
      lineElement.classList.add('line');
      lineContainer.append(lineElement);
      let sizeFactor = 1;
      do {
        toWord += 1;
        lineElement.textContent = words.slice(fromWord, toWord).join(' ');
        sizeFactor = container.clientWidth / lineElement.clientWidth;
      } while (toWord < words.length
        && (lineElement.clientHeight * sizeFactor) / container.clientHeight > minLineHeight);
      if (toWord < words.length) {
        toWord -= 1;
      }
      lineElement.textContent = words.slice(fromWord, toWord).join(' ');
      sizeFactor = container.clientWidth / lineElement.clientWidth;
      if ((lineElement.clientHeight * sizeFactor) / container.clientHeight > maxLineHeight) {
        sizeFactor = (maxLineHeight * container.clientHeight) / lineElement.clientHeight;
        lineElement.style.left = `${(container.clientWidth - lineElement.clientWidth * sizeFactor) / 2}px`;
      }
      lineElement.style.transform = `scale(${sizeFactor})`;
      lineElement.style.top = `${lastHeight}px`;
      lastHeight += (lineElement.clientHeight * sizeFactor) + lineSpacing;
      fromWord = toWord;
    }
  });

  lineContainer.style.top = `${(container.clientHeight - lastHeight) / 2}px`;
}

module.exports = {
  render,
};
