function displayImage(img, setEditorContentFxn) {
  var displayFrame = function(frame) {
    var editorHeight = Math.floor(aceEditor.container.clientHeight / aceEditor.renderer.layerConfig.lineHeight) - 2;
    var scale = editorHeight / frame.height;
    var scaledCtx = $("<canvas>")[0].getContext("2d");
    var tmpImageHolder = $("<canvas>").attr("width", frame.width).attr("height", frame.height)[0];
    tmpImageHolder.getContext("2d").putImageData(frame, 0, 0);
    scaledCtx.drawImage(tmpImageHolder, 0, 0, frame.width * scale, frame.height * scale);
    var scaledFrame = scaledCtx.getImageData(0, 0, frame.width * scale, frame.height * scale);

    var image = "";
    for (var line = 0; line < scaledFrame.height; line++) {
      for(var column = 0; column < scaledFrame.width; column++) {
        var pixelBytesStart = line * scaledFrame.width * 4 + column * 4;
        var r = scaledFrame.data[pixelBytesStart + 0];
        var g = scaledFrame.data[pixelBytesStart + 1];
        var b = scaledFrame.data[pixelBytesStart + 2];
        image += getColor((r + g + b) / 3);
      }
      image += "\n";
    }
    setEditorContentFxn(image);
  };
  
  var animate = function(frames) {
    var step = function(idx) {
      idx = idx < frames.length ? idx : 0;
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
  return pixel < 170 ? "#" : ".";
}

var aceEditor = ace.edit("editor");
displayImage("dance", function(text) {aceEditor.getSession().setValue(text);});
