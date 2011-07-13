function canvas_clear(canvas) {
  canvas.setAttribute("width", canvas.width);
}

function redraw(canvas) {
  var co = canvas.getContext("2d");
  canvas_clear(canvas);
  $("#layers").find(".palette-item").each(function(i, e) {
    var $e = $(e);

    if ($e.hasClass("image")) {
      co.drawImage($e.find("img")[0], 0, 0);
    }
    
  });
}


function placeholder() {
  $("#layers").html('<li class="placeholder">drop elements and effects here</li');
}

$(function() {
  var ca = document.getElementById("das-canvas");
  
  placeholder();
  
  Palettes.forEach(function(palette) {
    $("<h3><a href=\"#\">"+palette.title+"</a></h3>").appendTo("#palettes");
    var cont = $("<div></div>").addClass("palette-content").appendTo("#palettes");
    palette.content.forEach(function(e) {
      var itm = $("<div></div>").addClass("palette-item " +e.type).appendTo(cont);
      $("<img/>").attr("src", e.src).appendTo(itm);
      $("<div></div>").addClass("title").text(e.title).appendTo(itm);
      $("<div></div>").addClass("actions").appendTo(itm);
    });
  });

  $("#palettes").accordion({
    fillSpace: true
  });
  
  $(".palette-content .palette-item").draggable({
    appendTo: "body",
    helper: "clone"
  });
  
  $("#layers-container").droppable({
    accept: ":not(.ui-sortable-helper)",
    drop: function(event, ui) {
      $(this).find(".placeholder").remove();
      
      var itm = ui.draggable.clone();
      
      $("<li></li>").append(itm).appendTo("#layers");
      
      $("<button></button>").button({
        icons: { primary: "ui-icon-gear" }, text: false
      }).appendTo(itm.find(".actions"));
      
      $("<button></button>").button({
        icons: { primary: "ui-icon-trash" }, text: false
      }).click(function(e) {
        itm.remove();
        redraw(ca);
      }).appendTo(itm.find(".actions"));
      
      redraw(ca);
    }
  });
  
  $("#layers").sortable({
    items: "li:not(.placeholder)",
    stop: function(event, ui) {
      redraw(ca);
    }
  });

  $("#save-button").button().click(function(){
    $("#save-img").attr("src", ca.toDataURL());
    $("#save-dialog").dialog({modal:true});
  });
  
  $("#clear-button").button().click(function(){
    placeholder();
    canvas_clear(ca);
  });
});
