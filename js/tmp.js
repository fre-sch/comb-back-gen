
Images = {
  total: 0,
  loaded: 0,
  onload: null
};

Images.load = function(name, src) {
  this.total += 1;
  this[name] = new Image();
  this[name].onload = function () {
    console.info("image '" + name + "' loaded...");
    
    Images.loaded += 1

    if (Images.loaded == Images.total && Images.onload) {
      Images.onload();
    }
  };
  this[name].src = src;
};

function channel_levels(r, g, b) {
  return function(canvas) {
    var context = canvas.getContext("2d");
    var im_data = context.getImageData(0, 0, canvas.width, canvas.height);
    var px_data = im_data.data;
    for (var i = 0, n = px_data.length; i < n; i+= 4) {
      px_data[i] *= r;
      px_data[i + 1] *= g;
      px_data[i + 2] *= b;
    }
  };
}

function chain() {

  function build(a, i) {    
    if (i+1 < a.length) {
      var fn = build(a, i+1);
      return function() { a[i].apply(null, arguments); fn.apply(null, arguments); };
    }
    else {
      return function() { a[i].apply(null, arguments); };
    }
  }

  if (arguments.length == 1 && (arguments[0] instanceof Array)) {
    arguments = arguments[0];
  }

  return build(arguments, 0);
}

function draw_image(img) {
  return function(canvas, context) {
    context.drawImage(img, 0, 0);
  }
}

function global_alpha(a, fn) {
  return function(canvas, context) {
    context.save();
    context.globalAlpha = a;
    fn(canvas, context);
    context.restore();
  };
}

function global_composite_operation(composite_operation, fn) {
  return function(canvas, context) {
    context.save();
    context.globalCompositeOperation = composite_operation;
    fn(canvas, context);
    context.restore();
  };
}

$(function () {
  var canvas = document.getElementById("backdrop");
  var context = canvas.getContext("2d");


  Images.onload = function() {
    var s = [
      global_alpha(0.5, draw_image(Images.plate)),
      draw_image(Images.edges),
      global_alpha(1, draw_image(Images.controls)),
    ];
    var c = chain(s);
    c(canvas, context);
  };
  
  Images.load("controls", "./overlay/controls.png");
  Images.load("edges", "./overlay/edges.png");
  Images.load("plate", "./plates/wood.png");
});
