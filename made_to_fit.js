function MadeToFit() {}

MadeToFit.prototype = (function(){
    
    var autoHeight = true,
        elementsHide = true,
        elementWidth = 375,
        elementHeight = 275,
        elementMobileWidth = 250,
        elementMobileHeight = 183,
        tBuffer = 60;
    
    /**
     * Set the element(s) that will be made to fit.
     * 
     * @function
     * 
     * @param {jquery selector} 
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
    
    function getElement() {
        if(this.element) {
            return this.element;
        } else return 'Element not set.';
    }
    
    function setTriggerPoint(triggerPoint) {
        if(!triggerPoint) throw new Error('setTriggerPoint accepts a number as argument.');
        
        var triggerPoint = parseInt(triggerPoint);
        
        if(triggerPoint === 'NaN') throw new Error('setTriggerPoint argument is not a number.');
        
        this.triggerPoint = triggerPoint;
    }
    
    function _boxShift(clientWidth, elemWidth, elemHeight, scope) {
        var countwidth = 0,
            countheight = 0,
            clientWidth = clientWidth,
            elemWidth = elemWidth,
            elemHeight = elemHeight,
            elemPerLine = parseInt(clientWidth / elemWidth, 10),
            counter = 0,
            elemLength = scope.element.length,
            buffer = (clientWidth - (elemWidth*elemPerLine))/(elemPerLine+1)
            topBuffer = tBuffer;
            
        scope.element.each(function(){
            $this = $(this);
            
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
                $this.css({
                    'left' : (countwidth * elemWidth) + (buffer * (countwidth + 1)) + 'px',
                    'top'  : (countheight * elemHeight) + (topBuffer * (countheight + 1)) + 'px'
                });
                counter++;
                countwidth++;
            }
            
            if(autoHeight) {
                if(counter === elemLength) {
                    _heightAdjust.apply(scope, [countheight+1, elemHeight, topBuffer, 120]);
                }
            } 
             
        });
    }
    
    function _heightAdjust(countheight, elemHeight, buffer, addtlBuffer) {
        if(!this.container) throw new Error('Please set container using setContainer method.');
        if(this.container.length === 0) throw new Error('Container does not exist on page.');
        
        var newHeight = countheight * (buffer + elemHeight) + addtlBuffer;
        this.container.css('height', newHeight);
    }
    
    //to get correct elemWidth instantaneously; otherwise elemWidth reading lags behind window resize
    function _getElemWidth(clientWidth) {
        var elemWidth = elementWidth;
        if ((clientWidth+17) <= 450) elemWidth = elementMobileWidth;
        
        return elemWidth;
    }
    
    function _getElemHeight(clientWidth) {
        var elemHeight = elementHeight;
        if ((clientWidth+17) <= 450) elemHeight = elementMobileHeight;
        
        return elemHeight;
    }
    
    function setElementDimensions(width, height) {
        elementWidth = width;
        elementHeight = height;
    }
    
    function setMobileDimensions(width, height) {
        elementMobileWidth = width;
        elementMobileHeight = height;
    }
    
    function setTopBuffer(buffer) {
        tBuffer = buffer;
    }
    
    function disableAutoHeight() {
        autoHeight = false;
    }
    
    function setElementsShow() {
        elementsHide = false;
    }
    
    function setElementsHide() {
        elementsHide = true;
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
    
    function init() {
        if(!this.element) throw new Error('Please set element before initializing.');
        if(this.element.length === 0) throw new Error('Element does not exist on page.  Please check element setting.');
        
        var clientHeight = document.body.clientHeight,
            clientWidth = document.body.clientWidth, 
            that = this;
            
        var elemWidth = _getElemWidth.apply(this, [clientWidth]);
        var elemHeight = _getElemHeight.apply(this, [clientWidth]);
        
        if(elementsHide) {
            
            hideElements.apply(this, [elemWidth, elemHeight, clientWidth]);
            
            if(this.triggerPoint) {
                var scrollFlag = true;
                
                $(document).scroll(function(){
                    var scroll = window.pageYOffset,
                        bottomScroll = clientHeight + scroll;
            
                    if(bottomScroll >= that.triggerPoint && scrollFlag) {
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
        setMobileDimensions : setMobileDimensions,
        getElement : getElement,
        setTriggerPoint : setTriggerPoint,
        setTopBuffer : setTopBuffer,
        setElementsShow : setElementsShow,
        setElementsHide : setElementsHide,
        disableAutoHeight : disableAutoHeight,
        init : init
    }
})();

  