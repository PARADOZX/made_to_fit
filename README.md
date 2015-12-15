# Made To Fit

Made to Fit is an extremely lightweight Javascript program that arranges and shifts the positions of elements smoothly employing CSS transitions based on the size of the browser window.  

## Installation

Installation is easy.  Simply clone Made To Fit <b>(git clone https://github.com/PARADOZX/made_to_fit.git)</b> to the appropriate directory. The last step is to include the javascript file <b>made_to_fit.js</b> in your HTML using the 'script' tag.

The only dependency is jQuery.

## Usage

HTML

1. Create the HTML elements.  HTML element rules are as follows:
  - You can create any number of elements.
  - Elements must all share the same dimensions (width and height).
  - Percentages must not be used for the width and height.  
  - Elements must all have a class attribute and be of the same class.

2. Create a MadeToFit object using the MadeToFit constructor.  `var mtf = new MadeToFit();`

3. The elements that are to be arranged must be registered using setElement method.  The setElement method takes a jQuery collection as the argument.  For instance, assign the elements a class of 'fit'.  Then pass the jQuery collection of class 'fit' as the argument.  `mtf.setElement($(".fit"));` 

4. All the elements must be placed within a single "container".  For instance, if we have 3 divs of class 'fit', they must all be direct children of the same "container".  

```
<div id="fit-container">
  <div class="fit"></div>
  <div class="fit"></div>
  <div class="fit"></div>
</div> //end container
```
The container must be registered using the setContainer method.  The method takes a jQuery selector as the argument. `mtf.setContainer($("#container"));`


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license
