(function (window, document) {
    // adding drawBreakingText method to the 2D context
    CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
        // local variables and defaults
        var textSize = parseInt(this.font.replace(/\D/gi, ''));
        var textParts = [];
        var textPartsNo = 0;
        var words = [];
        var currLine = '';
        var testLine = '';
        str = str || '';
        x = x || 0;
        y = y || 0;
        w = w || this.canvas.width;
        lh = lh || 1;
        method = method || 'fill';

        // manual linebreaks
        textParts = str.split('\n');
        textPartsNo = textParts.length;

        // split the words of the parts
        for (var i = 0; i < textParts.length; i++) {
            words[i] = textParts[i].split(' ');
        }

        // now that we have extracted the words
        // we reset the textParts
        textParts = [];
        // calculate recommended line breaks
        // split between the words
        for (var i = 0; i < textPartsNo; i++) {

            // clear the testline for the next manually broken line
            currLine = '';
            for (var j = 0; j < words[i].length; j++) {
                testLine = currLine + words[i][j] + ' ';
                // check if the testLine is of good width
                if (this.measureText(testLine).width > w && j > 0) {
                    textParts.push(currLine);
                    currLine = words[i][j] + ' ';
                } else {
                    currLine = testLine;
                }
            }
            // replace it to remove trailing whitespace
            textParts.push(currLine);
        }
        // render the text on the canvas
        for (var i = 0; i < textParts.length; i++) {
            if (method === 'fill') {
                this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
            } else if (method === 'stroke') {
                this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
            } else if (method === 'none') {
                return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
            } else {
                console.warn('drawBreakingText: ' + method + 'Text() does not exist');
                return false;
            }
        }

        return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
    };
})(window, document);


var canvas = document.createElement('canvas');
var canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 550; 
var ctx = canvas.getContext('2d');
var padding = 15;
var textTop = 'Welcome to Memehub';
var textBottom = 'Where you can create your own memes!';
var textSizeTop = 10;
var textSizeBottom = 10;
var image = document.createElement('img');


image.onload = function (ev) {
    draw();
};

document.getElementById('imgURL').oninput = function (ev) {
    image.src = this.value;
};

document.getElementById('imgFile').onchange = function (ev) {
    var reader = new FileReader();
    reader.onload = function (ev) {
        image.src = reader.result;
    };
    reader.readAsDataURL(this.files[0]);
};


document.getElementById('textTop').oninput = function (ev) {
    textTop = this.value;
    draw();
};

document.getElementById('textBottom').oninput = function (ev) {
    textBottom = this.value;
    draw();
};


document.getElementById('textSizeTop').oninput = function (ev) {
    textSizeTop = parseInt(this.value);
    draw();
    document.getElementById('textSizeTopOut').innerHTML = this.value;
};
document.getElementById('textSizeBottom').oninput = function (ev) {
    textSizeBottom = parseInt(this.value);
    draw();
    document.getElementById('textSizeBottomOut').innerHTML = this.value;
};
document.getElementById('export').onclick = function () {
    var img = canvas.toDataURL('image/png');
    var link = document.createElement("a");
    link.download = 'My Meme';
    link.href = img;
    link.click();

    var win = window.open('', '_blank');
    win.document.write('<img style="box-shadow: 0 0 1em 0 dimgrey;" src="' + img + '"/>');
    win.document.write('<h1 style="font-family: Helvetica; font-weight: 300">Right Click > Save As<h1>');
    win.document.body.style.padding = '1em';
};

function style(font, size, align, base) {
    ctx.font = size + 'px ' + font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
}
document.getElementById('textColorTop').oninput = function (ev) {
    var colorTop = this.value;
    var colorBottom = document.getElementById('textColorBottom').value;
    draw(colorTop, colorBottom); 
};

document.getElementById('textColorBottom').oninput = function (ev) {
    var colorBottom = this.value;
    var colorTop = document.getElementById('textColorTop').value;
    draw(colorTop, colorBottom); 
};

function draw(colorTop, colorBottom) {
    var top = textTop.toUpperCase();
    var bottom = textBottom.toUpperCase();
    canvas.width = 500;
    canvas.height = 550;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colorTop;
    ctx.strokeStyle = colorTop;
    ctx.lineWidth = canvas.width * 0.004;

    var _textSizeTop = textSizeTop / 100 * canvas.width;
    var _textSizeBottom = textSizeBottom / 100 * canvas.width;

    // Draw top text
    style('Arial', _textSizeTop, 'center', 'bottom');
    ctx.drawBreakingText(top, canvas.width / 2, _textSizeTop + padding, null, 1, 'fill');
    ctx.drawBreakingText(top, canvas.width / 2, _textSizeTop + padding, null, 1, 'stroke');

    // Draw bottom text with its own font size
    ctx.fillStyle = colorBottom;
    ctx.strokeStyle = colorBottom;

    var height = ctx.drawBreakingText(bottom, 0, 0, null, 1, 'none').textHeight;

    style('Arial', _textSizeBottom, 'center', 'top');
    ctx.drawBreakingText(bottom, canvas.width / 2, canvas.height - padding - height, null, 1, 'fill');
    ctx.drawBreakingText(bottom, canvas.width / 2, canvas.height - padding - height, null, 1, 'stroke');
}


image.src = 'https://imgflip.com/s/meme/The-Most-Interesting-Man-In-The-World.jpg';
document.getElementById('textSizeTop').value = textSizeTop;
document.getElementById('textSizeBottom').value = textSizeBottom;
document.getElementById('textSizeTopOut').innerHTML = textSizeTop;
document.getElementById('textSizeBottomOut').innerHTML = textSizeBottom;
