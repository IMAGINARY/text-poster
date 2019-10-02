# text-poster
Web library for typesetting text within a rectangular area in a poster style.

This library places text on a container by using a maximum line height and a minimum line height. Text is 
distributed in lines trying to fit as much text as possible in a single line, down to the minimum line
height. Text will be stretched to meet the borders of the container but no more than the line exceeds the
maximum.

... It's hard to explain. Just try the [demo](https://imaginary.github.io/text-poster).

## Usage

This library can be imported through npm / yarn (`@imaginary-maths/text-poster`) or directly imported
through HTML and accessed through the global object `TextPoster`.

```
const TextPoster = require('@imaginary-maths/text-poster');
const container = document.getElementById('textContainer');
TextPoster.render(container, 'Hello world');
```

See `index.html` for a better example.

Check `src/main.js` for available options.

The font used is whatever was assigned to the container through the magic of CSS.  

## Credits

Created by [Eric Londaits](https://github.com/elondaits) for IMAGINARY gGmbH. 

## License

Copyright (c) 2019 IMAGINARY
Licensed under the MIT license. See LICENSE file.
