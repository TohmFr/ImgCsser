/**
 * POC Q&D convert Image in css with box-shadow
 * Thomas BARDY (2019-04-04)
 */
(function(){
    const canvas            = document.getElementById("canvas");
    const context           = canvas.getContext("2d"); 
    const fileinput         = document.getElementById('fileinput'); // input file
    const fileinputUrl      = document.getElementById('fileinputUrl'); // input file
    const psinput           = document.getElementById('psinput'); // input file
    const cssStyleSheet     = document.getElementById('cssStyle').sheet;
    const cssCode           = document.getElementById('cssCode');
    const backgroundColor   = document.getElementById('backgroundColor');
    const convertButton     = document.getElementById('convertButton');

    const img = new Image();
    fileinput.onchange = function(evt) {
        const files = evt.target.files; // FileList object
        const file = files[0];
        fileinputUrl.value = "";

	    if(file.type.match('image.*')) {           
            readImage(file);      

	    } else {
            alert("not an image");
        }
    };

    fileinputUrl.onblur = function(evt){       
        openFromUrl();
    };

    convertButton.onclick= function(evt){
        setTimeout(convertToCss,100);
    };
    
    function openFromUrl(){
        const val       = fileinputUrl.value;
        fileinput.value = "";
        if(val!=""){
            var request = new XMLHttpRequest();
            request.open('GET', val, true);
            request.responseType = 'blob';
            request.onload = function() {
                readImage(request.response);               
            };
            request.send();
        }
    }

    // Read in the image file as a data URL.
    function readImage(file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(evt){
            if( evt.target.readyState == FileReader.DONE) {
                img.src = evt.target.result;
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                context.drawImage(img,0,0);
                setTimeout(convertToCss,100);                    
            }
        }    
    }

    function convertToCss(){
        let css = "#imgCss "+ ImageToCss();
        cssCode.innerHTML=css;
       
        if(cssStyleSheet.cssRules.length>0){
            cssStyleSheet.deleteRule(0);
        }
        cssStyleSheet.insertRule(css,0);
    }

    function ImageToCss(){
        const maxWidth  = img.width;
        const maxHeight = img.height;
        const pxSize    = parseInt(psinput.value);
        const tCss      = [];
        const bgColor   = backgroundColor.value;
        tCss.push("display: block");
        tCss.push("width: " + pxSize + "px");
        tCss.push("height: " + pxSize + "px");

        let marginRight = maxWidth;
        let marginBottom= maxHeight;
        tCss.push("margin: 0 "+marginRight+"px "+marginBottom+"px 0");
        tCss.push("background: "+getColor(0,0,pxSize));

        let tBoxShadow = [];
        for(let x=pxSize;x<=maxWidth-pxSize;x+=pxSize){
            for(let y=pxSize;y<=maxHeight-pxSize;y+=pxSize){
                let color = getColor(x,y,pxSize);
                if(color!==bgColor){
                    tBoxShadow.push((x-pxSize)+'px '+(y-pxSize)+'px 0 0 '+color);
                }
            }
        }
        tCss.push('box-shadow: '+tBoxShadow.join(',\n '));

        let css= '{\n'+ tCss.join(";\n") + '\n}';
        return css;
    }

    function getColor(x,y,pixelSize){
        const c = context.getImageData(x,y, pixelSize, pixelSize).data;
        let pixel ='';

        pixel=rgbToHex(c[0],c[1],c[2]);
        
        return pixel;
        
    }
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    setTimeout(openFromUrl,100);

})();
