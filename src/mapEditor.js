class MapEditor {
     constructor (parent, x, z) {
          this.parent = parent;
          this.map = [];
          this.canvas = document.createElement("canvas");
          this.canvas.width = this.parent.offsetWidth;
          this.canvas.height = this.parent.offsetHeight;
          this.ctx = this.canvas.getContext("2d");
          this.z = z;
          this.x = x;

          this.overlayCanvas = document.createElement("canvas");
          this.overlayCanvas.width = this.parent.offsetWidth;
          this.overlayCanvas.height = this.parent.offsetHeight;

          this.canvas.style = "position: absolute;";
          this.overlayCanvas.style = "position: absolute;";
     }

     initialize() {
          this.parent.appendChild(this.canvas);
          this.parent.appendChild(this.overlayCanvas);
          this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.fillStyle = "black";
          this.ctx.fill();
          this.ctx.font = "12px monospace";
          this.ctx.fillStyle = "white";
          this.ctx.fillText("canvas initialised, waiting form map...", 10, 50);
          this._createMapRepr()
     }

     _generateMap() {
          var mapArray = [];
          for (let i = 0; i < this.z; i++) {
               var line = [];
               for (let i = 0; i < this.x; i++) {
                    line.push({
                         "blockType": "path",
                         "height": "1",
                         "direction": "right"
                    })
               }
               mapArray.push(line)
          }
          this.map = mapArray;
     }

     _createMapRepr() {
          this._fillBackground()
          this._generateMap()

          for (let i_raw = 0; i_raw < this.map.length; i_raw++) {
               const row = this.map[i_raw];
               for (let j_raw = 0; j_raw < row.length; j_raw++) {
                    const tile = row[j_raw];
                    
                    const i = ((this.canvas.height-(this.map.length*50))/2)+i_raw*50;
                    const j = ((this.canvas.width-(row.length*50))/2)+j_raw*50;

                    this.ctx.fillStyle = "#d4bb7e";
                    this.ctx.fillRect((j), (i), 40, 40);
               }
          }
          
          this._addListeners()
     }

     _addListeners() {
          this.overlayCanvas.onclick = null;
          this.overlayCanvas.getContext("2d").clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
          var map = this.map;
          const handler = function (event) {
               this.map = map;
               this.ctx = this.getContext("2d");
               this.ctx.clearRect(0, 0, this.width, this.height);
               for (let i_raw = 0; i_raw < this.map.length; i_raw++) {
                    const row = this.map[i_raw];
                    for (let j_raw = 0; j_raw < row.length; j_raw++) {
                         
                         const i = ((this.height-(this.map.length*50))/2)+i_raw*50;
                         const j = ((this.width-(row.length*50))/2)+j_raw*50;
     
                         const cell = new Path2D();
                         cell.rect(j,i,40,40);
                         if (this.ctx.isPointInPath(cell, event.offsetX, event.offsetY)) {
                              this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
                              this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                              this.ctx.fill(cell);
                         } else {
                              this.ctx.fillStyle = "#d4bb7e";
                              this.ctx.fillRect((j), (i), 40, 40);
                         }
                    }
               }
          };
          this.overlayCanvas.onclick = handler;
     }

     _update(obj, i, j) {
          this.map[i][j] = obj;
     }

     _updateGrid(x, z) {
          if (!confirm("ALL DATA WILL BE LOST!\n\nCONTINUE WITH UPDATE OPERATION?")) return;
          this.z = z;
          this.x = x;
          console.log(this);
          this._createMapRepr();
     }

     _fillBackground() {
          this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
          var grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
          grd.addColorStop(0, "#aaa");
          grd.addColorStop(1, "#444");
          this.ctx.fillStyle = grd;
          this.ctx.fill();

          grd = this.ctx.createRadialGradient((this.canvas.width/2), -(this.canvas.height*1/100), 0, 
                                             (this.canvas.width/2), -(this.canvas.height*1.6), (this.canvas.height*2));
          grd.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          grd.addColorStop(0.99, 'rgba(255, 255, 255, 0.2)');
          grd.addColorStop(1, 'rgba(255, 255, 255, 0)');

          this.ctx.fillStyle = grd;
          this.ctx.fill();
     }
}

export default MapEditor;