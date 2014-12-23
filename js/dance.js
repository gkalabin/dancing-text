function displayImage(img, setEditorContentFxn) {
  var displayFrame = function(frame) {
    var image = "";
    for (var y = 0; y < frame.height; y++) {
      for(var x = 0; x < frame.width; x++) {
        var pixelBytesStart = y * frame.width * 4 + x * 4;
        var r = frame.data[pixelBytesStart + 0];
        var g = frame.data[pixelBytesStart + 1];
        var b = frame.data[pixelBytesStart + 2];
        image += getColor((r + g + b) / 3);
      }
      image += "\n";
    }
    setEditorContentFxn(image);
  };
  
  var animate = function(frames) {
    var step = function(idx) {
      idx = idx < frames.length ? idx : -1;
      if (idx < 0) {
        return;
      }
      var frame = frames[idx];
      displayFrame(frame.data);
      window.setTimeout(function(){step(idx + 1);}, frame.delay * 5);
    };
    step(0);
  };

  var gif = new SuperGif({ gif: document.getElementById(img)} );
  gif.load(function() {
    var frames = gif.frames();
    animate(frames);
  });
}

function getColor(pixel) {
  var color = pixel > 128 ? 1 : 0;
  if (color === 1 || color === 0) {
    return color == 1 ? "." : "#";
  }
  console.error("Got bad color: " + color);
  return 1;
}

var aceEditor = ace.edit("editor");
displayImage("dance", function(text) {aceEditor.getSession().setValue(text);});
