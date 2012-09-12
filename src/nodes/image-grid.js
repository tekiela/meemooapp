// extends src/nodes/image.js which extends src/node-box-native-view.js

$(function(){

  Iframework.NativeNodes["image-grid"] = Iframework.NativeNodes["image"].extend({

    info: {
      title: "grid",
      author: "forresto",
      description: "grid of images"
    },
    initializeModule: function(){
    },
    _tileWidth: 50,
    _tileHeight: 50,
    _tileCount: 100,
    _tiles: [],
    inputimage: function (image) {
      this._image = image;
      var data = image.getContext('2d').getImageData(0, 0, this._tileWidth, this._tileHeight);
      this._tiles.unshift(data);
      if (this._tiles.length>this._tileCount) {
        this._tiles.pop();
      }
      this._triggerRedraw = true;
    },
    inputwidth: function (i) {
      this._width = i;
      this._regrid = true;
      this._triggerRedraw = true;
    },
    inputheight: function (i) {
      this._height = i;
      this._regrid = true;
      this._triggerRedraw = true;
    },
    inputrows: function (i) {
      this._rows = i;
      this._regrid = true;
      this._triggerRedraw = true;
    },
    inputcolumns: function (i) {
      this._columns = i;
      this._regrid = true;
      this._triggerRedraw = true;
    },
    inputsend: function () {
      this.send("image", this.canvas);
    },
    _regrid: false,
    regrid: function() {
      if (this.canvas.width !== this._width || this.canvas.height !== this._height) {
        this.canvas.width = this._width;
        this.canvas.height = this._height;
      }
      this._tileWidth = Math.floor(this._width / this._columns);
      this._tileHeight = Math.floor(this._height / this._rows);
      this._tileCount = this._rows * this._columns;
      if (this._tiles.length>this._tileCount) {
        this._tiles = this._tiles.splice(0,this._tileCount);
      }
      this._regrid = false;
    },
    redraw: function(){
      // Called from NodeBoxNativeView.renderAnimationFrame()
      if (this._regrid) {
        this.regrid();
      }
      if (this._image) {
        // Too expensive
        // // Shift previous tiles
        // var r, c;
        // for (r=this._rows-1; r>=0; r--) {
        //   for (c=this._columns-1; c>=0; c--) {
        //     if (r===0 && c===0) {
        //       // Last tile
        //       continue;
        //     }
        //     var previousX = c>0 ? (c-1)*this._tileWidth : (this._columns-1)*this._tileWidth;
        //     var previousY = c>0 ? r*this._tileHeight : (r-1)*this._tileHeight;
        //     // Blurs out in Chrome
        //     // this.context.drawImage(this.canvas, previousTile.x, previousTile.y, this._tileWidth, this._tileHeight, c*this._tileHeight, r*this._tileWidth, this._tileWidth, this._tileHeight );
        //     var previous = this.context.getImageData(previousX, previousY, this._tileWidth, this._tileHeight);
        //     this.context.putImageData(previous, c*this._tileWidth, r*this._tileHeight);
        //   }
        // }
        // Draw new tile
        // this.context.drawImage(this._image, 0, 0, this._tileWidth, this._tileHeight );

        var r, c;
        for (r=0; r<this._rows; r++) {
          for (c=0; c<this._columns; c++) {
            var tile = this._tiles[r*this._columns+c];
            if (tile) {
              this.context.putImageData(tile, c*this._tileWidth, r*this._tileHeight);
            }
          }
        }
        this.inputsend();
      }
    },
    inputs: {
      image: {
        type: "image",
        description: "image to add to grid"
      },
      width: {
        type: "int",
        description: "grid width",
        "default": 500
      },
      height: {
        type: "int",
        description: "grid height",
        "default": 500
      },
      rows: {
        type: "int",
        description: "grid row count",
        "default": 10
      },
      columns: {
        type: "int",
        description: "grid column count",
        "default": 10
      },
      send: {
        type: "bang",
        description: "send the image"
      }
    },
    outputs: {
      image: {
        type: "image"
      }
    }

  });


});
