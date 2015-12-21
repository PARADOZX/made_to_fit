function MadeToFit(newOptions) {
    this.options = {
        autoHeight : true,
        elementsHide : false,
        centerLeftovers : true,
        responsive : [],
        triggerPoint : null,
        tBuffer : 60
    };
    
    if(newOptions) $.extend(this.options, newOptions);
}

MadeToFit.prototype = (function(){
    
    var elementWidth = null,
        elementHeight = null,
        elementMobileWidth = null,
        elementMobileHeight = null;
    
    /**
     * Set the element(s) that will be manipulated.
     * @function
     * @param {Object} Jquery selector object 
     */
    function setElement(element) {
        if(element && element instanceof $) {
            this.element = element;
        } else if (!element) {
            throw new Error('setElement accepts one jQuery selector as argument.');
        } else throw new Error('Only jQuery selectors are accepted as element at this time.');
    }
    
    function setContainer(container) {
        if(container && container instanceof $) {
            this.container = container;
        } else if (!container) {
            throw new Error('container accepts one jQuery selector as argument.');
        } else throw new Error('Only jQuery selectors are accepted as container at this time.');
    }

    
    /**
     * Sets the top and left positioning of the elements based on screen size and element size.
     * @function
     * @param {Number} clientWidth
     * @param {Number} elemWidth
     * @param {Number} elemHeight
     * @param {Object} scope Context object
     */
    
    function _boxShift(clientWidth, elemWidth, elemHeight, scope) {
        var countwidth = 0,
            countheight = 0,
            clientWidth = clientWidth,
            elemWidth = elemWidth,
            elemHeight = elemHeight,
            elemPerLine = parseInt(clientWidth / elemWidth, 10),
            counter = 0,
            elemLength = scope.element.length,
            buffer = (clientWidth - (elemWidth*elemPerLine))/(elemPerLine+1),
            topBuffer = scope.options.tBuffer;

            /** 
             * if clientWidth < elemWidth (screen width less than element) set buffer to 10  
             * otherwise margin settings will not be appropriate.
             */
            if(0 === elemPerLine) {
                buffer = 10;
                elemPerLine = 1;
            }
            
            var leftovers = elemLength%elemPerLine;
            var lastLine = Math.ceil(elemLength / elemPerLine)-1;
        
        // iterate through every element to determine its unique position    
        scope.element.each(function(){
            $this = $(this);

            /**
             *check if there are leftovers; meaning the elements on the last line do not equal the 
             *the amount of elements that can fit the screen (elemPerLine)
             */
            if(scope.options.centerLeftovers && countheight === lastLine && leftovers!==0) _setBufferForLeftovers();
            
            if(countwidth < elemPerLine) {

                $this.css({
                    'left' : (countwidth * elemWidth) + (buffer * (countwidth + 1)) + 'px',
                    'top'  : (countheight * elemHeight) + (topBuffer * (countheight + 1)) + 'px'
                });
                counter++;
                countwidth++;
            } else {
                countwidth = 0;
                countheight++;
                
                if(scope.options.centerLeftovers && countheight === lastLine && leftovers!==0) _setBufferForLeftovers();
                
                $this.css({
                    'left' : (countwidth * elemWidth) + (buffer * (countwidth + 1)) + 'px',
                    'top'  : (countheight * elemHeight) + (topBuffer * (countheight + 1)) + 'px'
                });
                counter++;
                countwidth++;
            }
            
            // if autoHeight option is true, adjust the container's height to fit all elements once above iteration is complete.
            if(scope.options.autoHeight) {
                if(counter === elemLength) {
                    _heightAdjust.apply(scope, [countheight+1, elemHeight, topBuffer, 120]);
                }
            } 
             
        });
        
        function _setBufferForLeftovers() {
            buffer = (clientWidth - (elemWidth*leftovers))/(leftovers+1);
        }
        
    } // end _boxShift
    
    /**
     * Since elements have "absolute" positions the height of the container in which they reside must be adjusted due to the 
     * dynamic positioning of the elements. 
     * @function
     * @param {Number} countheight
     * @param {Number} elemHeight
     * @param {Number} buffer
     * @param {Number} addtlBuffer
     */ 
    function _heightAdjust(countheight, elemHeight, buffer, addtlBuffer) {
        if(!this.container) throw new Error('Please set container using setContainer method.');
        if(this.container.length === 0) throw new Error('Container does not exist on page.');
        
        var newHeight = countheight * (buffer + elemHeight) + addtlBuffer;
        this.container.css('height', newHeight);
    }
    
    
    /**
     * Checks if any 'responsive' breakpoints should be triggered and sets the elemWidth accordingly
     * @function
     * @param {Number}
     * @returns {Number} 
     */
    function _getElemWidth(clientWidth) {
        var elemWidth = elementWidth,
            responsive = this.options.responsive,
            responsiveLen = this.options.responsive.length;
        
        if(responsiveLen === 1) {
            if ((clientWidth+17) <= responsive[0][0]) elemWidth = responsive[0][1];
        }
    
        if(responsiveLen >= 1 && responsive[0] instanceof Array === false) {
            if ((clientWidth+17) <= responsive[0]) elemWidth = responsive[1];
        } 
        
        if(responsiveLen >=1 && responsive[0] instanceof Array === true) {
            var combinedArr = [];
            for (x in responsive) {
                combinedArr.push(responsive[x]);
            }
            
            combinedArr.sort(function(a,b){
                return a[0]-b[0];
            });
            
            for (i=0; i<combinedArr.length; i++) {
                if(0 === i)
                    if ((clientWidth+17) <= combinedArr[i][0]) elemWidth = combinedArr[i][1];
                    
                if(i !== 0) 
                    if ((clientWidth+17) <= combinedArr[i][0] && (clientWidth+17) > combinedArr[i-1][0]) elemWidth = combinedArr[i][1];
            }
        }
        
        return elemWidth;
    }
    
    
    /**
     * Checks if any 'responsive' breakpoints should be triggered and sets the elemHeight accordingly
     * @function
     * @param {Number}
     * @returns {Number} 
     */
    function _getElemHeight(clientWidth) {
        var elemHeight = elementHeight,
            responsive = this.options.responsive,
            responsiveLen = this.options.responsive.length;
    
        if(responsiveLen === 1) {
            if ((clientWidth+17) <= responsive[0][0]) elemHeight = responsive[0][2];
        }
    
        if(responsiveLen >= 1 && responsive[0] instanceof Array === false) {
            if ((clientWidth+17) <= responsive[0]) elemHeight = responsive[2];
        } 
        
        if(responsiveLen >=1 && responsive[0] instanceof Array === true) {
            var combinedArr = [];
            for (x in responsive) {
                combinedArr.push(responsive[x]);
            }
            
            combinedArr.sort(function(a,b){
                return a[0]-b[0];
            });
            
            for (i=0; i<combinedArr.length; i++) {
                if(0 === i)
                    if ((clientWidth+17) <= combinedArr[i][0]) elemHeight = combinedArr[i][2];
                    
                if(i !== 0) 
                    if ((clientWidth+17) <= combinedArr[i][0] && (clientWidth+17) > combinedArr[i-1][0]) elemHeight = combinedArr[i][2];
            }
        }
        
        return elemHeight;
    }
    
    
    //Checks that 'responsive' option settings has correct format.
    function _checkResponsiveSettings() {
        var responsive = this.options.responsive,
            responsiveLen = this.options.responsive.length,
            truthy = null;
        
        if(responsive instanceof Array === false)
            throw new Error('Responsive option value must be an array.');
        
        //only case when responsiveLen is 1 and is acceptable is when user passes a single array within an array.
        if(1 === responsiveLen) 
            if(responsive[0] instanceof Array === false)
                throw new Error('Please check README for proper parameter settings for the \'responsive\' option.');
        
        for (x in responsive) {
            if(responsive[x] instanceof Array) {
                if(truthy !== null) {
                    if(!truthy) throw new Error('Pleaseee check README for proper parameter settings for the \'responsive\' option.');
                }
                truthy = true;
            } else {
                if(truthy !== null) {
                    if(truthy) throw new Error('Please check README for proper parameter settings for the \'responsive\' option.');
                }
                truthy = false;
            }
        }
        
        if(truthy) {
            //check arrays
        } else 
            if(responsiveLen !== 3) throw new Error('Please check README for proper parameter settings for the \'responsive\' option.');
            
    } //end _checkResponsiveSettings method
    
    function setElementDimensions(width, height) {
        elementWidth = width;
        elementHeight = height;
    }
    
    function hideElements(elemWidth, elemHeight, clientWidth) {
        var left = true,
            topcountA = 0,
            topcountB = 0,
            buffer = 50;
        
        this.element.each(function(){
            var $this = $(this),
                leftOffset = $this.position().left;
        
            if(left) {
                $this.css({
                    'left' : '-' + elemWidth + 'px',
                    'top'  : (topcountA * elemHeight) + buffer + 'px'
                });
                left = false;
                topcountA++;
            } else {
                $this.css({
                    'left' : clientWidth + 'px',
                    'top'  : (topcountB * elemHeight) + buffer + 'px'
                });
                left = true;
                topcountB++;
            }
        });
    }
    
    function _setElementsCSSProps() {
        this.element.each(function(){
           $(this).css({
               'position' : 'absolute',
               'transition' : '1s'
            }); 
        });
    }
    
    function _checkElemSameSize() {
        var width = null,
            height = null;
        
        this.element.each(function(){
            if(width !== null) {
                if($(this).width() !== width) throw new Error('Elements must all have the same width.');
            }
            if(height !== null) {
                if($(this).height() !== height) throw new Error('Elements must all have the same height.');
            }
            
            width = $(this).width();
            height = $(this).height();
        });
    }
    
    function init() {
        if(!this.element) throw new Error('Please set element before initializing.');
        if(this.element.length === 0) throw new Error('Element does not exist on page.  Please check element setting.');
        
        var clientHeight = document.body.clientHeight,
            clientWidth = document.body.clientWidth, 
            that = this;
            
        //length will be undefined if responsive option is an integer
        if(this.options.responsive.length > 0 || this.options.responsive.length === undefined) _checkResponsiveSettings.apply(this);    
            
        var elemWidth = _getElemWidth.apply(this, [clientWidth]);
        var elemHeight = _getElemHeight.apply(this, [clientWidth]);
        
        //set element's CSS position to absolute
        _setElementsCSSProps.apply(this);
        
        //check that all elements are of the same height and width
        _checkElemSameSize.apply(this);
        
        if(this.options.elementsHide) {
            
            hideElements.apply(this, [elemWidth, elemHeight, clientWidth]);
            
            if(this.options.triggerPoint) {

                var scrollFlag = true;
                
                $(document).scroll(function(){
                    var scroll = window.pageYOffset,
                        bottomScroll = clientHeight + scroll;
            
                    if(bottomScroll >= that.options.triggerPoint && scrollFlag) {
                        scrollFlag = false;
                        _boxShift(clientWidth, elemWidth, elemHeight, that);
                    }
                });
            } else {
                _boxShift(clientWidth, elemWidth, elemHeight, that);
            }
        } else {
                _boxShift(clientWidth, elemWidth, elemHeight, this);
        }
        
        window.onresize = function() {
            clientWidth = document.body.clientWidth;
            var elemWidth = _getElemWidth.apply(that, [clientWidth]);
            var elemHeight = _getElemHeight.apply(that, [clientWidth]);
            _boxShift(clientWidth, elemWidth, elemHeight, that);
        }
    }  // end init
    
    return {
        setElement : setElement,
        setContainer : setContainer,
        setElementDimensions : setElementDimensions,
        init : init
    }
})();

  