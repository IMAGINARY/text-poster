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
    let lineText = line;
    let smallText = false;
    // Check for escape characters
    if (line.trim().substr(0, 2) === '@@') {
      lineText = line.trim().substr(2).trim();
      smallText = true;
    }
    if (lineText.length > 0) {
      const words = lineText.split(' ');
      let fromWord = 0;
      let toWord = 0;

      while (fromWord < words.length) {
        const lineElement = document.createElement('div');
        lineElement.classList.add('line');
        lineContainer.append(lineElement);
        let sizeFactor = 1;
        // Add words until the line's height becomes smaller than the minimum
        do {
          toWord += 1;
          lineElement.textContent = words.slice(fromWord, toWord).join(' ');
          sizeFactor = container.clientWidth / lineElement.clientWidth;
        } while (toWord <= words.length
          && (lineElement.clientHeight * sizeFactor) / container.clientHeight >= minLineHeight);

        // If we exited the loop because the height became less than the minimum
        if (toWord <= words.length) {
          // If possible remove one word to go back above the minimum
          if (toWord > fromWord + 1) {
            toWord -= 1;
          }
        }
        lineElement.textContent = words.slice(fromWord, toWord).join(' ');

        if (smallText) {
          // Make the line the minimum height unless it doesn't fit and it needs shrinking
          // (this happens with single words that are very long)
          sizeFactor = Math.min(container.clientWidth / lineElement.clientWidth,
            (minLineHeight * container.clientHeight) / lineElement.clientHeight);
        } else {
          // Make the line the full width unless it goes over the max height and it needs
          // shrinking
          sizeFactor = Math.min(container.clientWidth / lineElement.clientWidth,
            (maxLineHeight * container.clientHeight) / lineElement.clientHeight);
        }
        // Center the line
        lineElement.style.left = `${(container.clientWidth - lineElement.clientWidth * sizeFactor) / 2}px`;
        lineElement.style.transform = `scale(${sizeFactor})`;
        lineElement.style.top = `${lastHeight}px`;
        lastHeight += (lineElement.clientHeight * sizeFactor) + lineSpacing;
        fromWord = toWord;
      }
    }
  });

  lineContainer.style.top = `${(container.clientHeight - lastHeight) / 2}px`;
}

module.exports = {
  render,
};
