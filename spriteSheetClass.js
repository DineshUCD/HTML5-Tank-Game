var SpriteSheetClass = {
  getCachedImage: function(imageName) {
    if (imageCache[imageName] != null) {
      return imageCache[imageName];
    } else {
      var img = new Image();
      img.src = imageName;
      imageCache[imageName] = img;
      return img;
    }
  },
  //-----------------------------------------
  // Load the atlas at the path 'imgName' into
  // memory. This is similar to how we've
  // loaded images in previous units.
  load: function(imageName, jsonName) {
    var image = this.getCachedImage(imageName);
    this.parseAtlasDefinition(jsonName);
    spriteSheets[imageName] = {
      img: image,
      spt: sprites
    };
  },
  //-----------------------------------------
  // Define a sprite for this atlas
  defSprite: function(name, x, y, w, h, cx, cy) {
    // We create a new object with:
    // The name of the sprite as a string
    // The x and y coordinates of the sprite
    // in the atlas.
    // The width and height of the sprite in
    // the atlas.
    // The x and y coordinates of the center
    // of the sprite in the atlas. This is
    // so we don't have to do the calculations
    // each time we need this. This might seem
    // minimal, but it adds up!
    var spt = {
      "id": name,
      "x": x,
      "y": y,
      "w": w,
      "h": h,
      "cx": cx == null ? 0 : cx,
      "cy": cy == null ? 0 : cy
    };
    // We push this new object into
    // our array of sprite objects,
    // at the end of the array.
    sprites.push(spt);
  },
  //-----------------------------------------
  // Parse the JSON file passed in as 'atlasJSON'
  // that is associated to this atlas.
  parseAtlasDefinition: function(atlasJSON) {
    sprites = new Array();
    var request = new XMLHttpRequest();
    request.open("GET", atlasJSON, false);
    request.send(null);
    // Parse the input 'atlasJSON' using the
    // JSON.parse method and store it in a
    // variable.
    var parsed = JSON.parse(request.responseText);
    // For each sprite in the parsed JSON,
    // The parsed object actually has a frames dictionary.
    for (var key in parsed.frames) {
      var sprite = parsed.frames[key];
      var centerX = -sprite.frame.w * 0.5;
      var centerY = -sprite.frame.h * 0.5;
      var width = sprite.frame.w;
      var height = sprite.frame.h;
      if (sprite.rotated) {
        width = sprite.frame.h;
        height = sprite.frame.w;
      }
      if (sprite.trimmed) {
        centerX = sprite.spriteSourceSize.x - (sprite.sourceSize.w * 0.5);
        centerY = sprite.spriteSourceSize.y - (sprite.sourceSize.h * 0.5);
      }
      this.defSprite(sprite.filename, sprite.frame.x, sprite.frame.y,
        width, height, centerX, centerY);

      } //for
    }, //parseAtlasDefinition
  getStats: function(sheetName, name) {
    var length = spriteSheets[sheetName].spt.length;
    for (var find = 0; find < length; find++) {
      if (spriteSheets[sheetName].spt[find].id == name) {
        return spriteSheets[sheetName].spt[find];
      } //if
    } //for
    return null;
  } //getStats
} //SpriteSheetClass

function drawSprite(spriteName, posX, posY, angle, centerOfMass) {
  for (var sheetName in spriteSheets) {
    var sheet = spriteSheets[sheetName];
    var sprite = SpriteSheetClass.getStats(sheetName, spriteName);
    if (sprite == null) continue;
    __drawRotatedImage(context, sprite, sheet, posX, posY, angle, centerOfMass);
    return;
  }
} //drawSprite

function __drawRotatedImage(ctx, spt, sheet, posX, posY, angle, centerOfMass) {
  ctx.save();
  var rad = angle * Math.PI / 180;
  ctx.translate(posX + spt.w / 2, posY + spt.h / 2);
  ctx.rotate(rad);
  ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h,
  (spt.w / 2 * (-1) - centerOfMass.x), (spt.h / 2 * (-1) - centerOfMass.y),
  spt.w, spt.h);
  ctx.rotate(rad * (-1));
  ctx.translate((posX + spt.w / 2) * (-1), (posY + spt.h / 2) * (-1));
  ctx.restore();
}

function xhrJSONP(reqUri, callback)
{
  $.ajax(
  {
        'url': reqUri,
        'datatype': 'jsonp',
        'success': function(data, textStatus, jqXHR)
        {
          if (callback != null)
            callback(data);
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
          console.log(errorThrown);
        }
  });
}
