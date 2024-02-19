class MapEditor {
     constructor (parent, x, z, editorArea) {
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

          this.editorArea = editorArea;

          this.editor = {
               title: null,
               heightInput: null,
               typeInput: null,
               directionInput: null,
               currentlyEditing: null,
               form: null
          }

          this.map_starting_point = [
              parseInt(document.forms[0].startX.value), parseInt(document.forms[0].startZ.value)
          ]
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
          this._createMapRepr(true);
          this._setupEditor();
          this._addListeners()
     }

     _setupEditor() {
          this.editorArea.innerHTML = '<div id="editor-title" style="opacity: 0.5; font-style: italic; font-weight: bold;">Waiting for tile selection...</div><div><form id="tile-form">height: <input min="0" type="number" value="1" name="height"><br>type: <input type="text" value="path" name="type"><br>dir: <input min="1" max="4" type="number" value="1" name="direction"></form></div><textarea id="map-text"></textarea>';
          var editorForm = document.getElementById("tile-form")
          this.editor.heightInput = editorForm.height;
          this.editor.typeInput = editorForm.type;
          this.editor.directionInput = editorForm.direction;
          this.editor.form = editorForm;
          this.editor.title = document.getElementById("editor-title");

          document.forms[0].startX.onchange = ()=>{ this.updateTile(this.map_starting_point, "path"); this.map_starting_point[0] = parseInt(document.forms[0].startX.value); this.updateTile(this.map_starting_point, "start"); this._createMapRepr(); };
          document.forms[0].startZ.onchange = ()=>{ this.updateTile(this.map_starting_point, "path"); this.map_starting_point[1] = parseInt(document.forms[0].startZ.value); this.updateTile(this.map_starting_point, "start"); this._createMapRepr(); };


          this.editor.heightInput.disabled = true;
          this.editor.typeInput.disabled = true;
          this.editor.directionInput.disabled = true;
     }

     updateTile(coordinateArray, designation) {
          if (this.map[coordinateArray[0]]) {
               if (this.map[coordinateArray[1]]) {
                    this.map[coordinateArray[0]][coordinateArray[1]].blockType = designation;
               }
          }
     }

     startEditing(i,j) {
          this.editor.heightInput.disabled = false;
          this.editor.typeInput.disabled = false;
          this.editor.directionInput.disabled = false;
          this.editor.title.innerText = `Editing ${i},${j} (i,j)...`;

          this.editor.heightInput.value = this.map[i][j].height;
          this.editor.typeInput.value = this.map[i][j].blockType;
          this.editor.directionInput.value = this.map[i][j].direction;

          this.editor.heightInput.onchange = ()=>{this.map[i][j].height = this.editor.heightInput.value; this._createMapRepr()};
          this.editor.typeInput.onchange = ()=>{if (this.editor.typeInput.value == "start") {this.editor.typeInput.value = "path"; return;}; this.map[i][j].blockType = this.editor.typeInput.value; this._createMapRepr()};
          this.editor.directionInput.onchange = ()=>{this.map[i][j].direction = this.editor.directionInput.value; this._createMapRepr()};
     }

     _generateMap() {
          var mapArray = [];
          for (let i = 0; i < this.z; i++) {
               var line = [];
               for (let j = 0; j < this.x; j++) {
                    line.push({
                         "blockType": (this._arraysAreEqual([j,i], this.map_starting_point) ? "start" : "path"),
                         "height": 1,
                         "direction": 1
                    });
               }
               mapArray.push(line)
          }
          this.map = mapArray;
     }

     _arraysAreEqual(a,b) {
          if (a === b) return true;
          if (a == null || b == null) return false;
          if (a.length !== b.length) return false;
          for (var i = 0; i < a.length; ++i) {
               if (a[i] !== b[i]) return false;
          }
          return true;
     }

     _createMapRepr(genMap) {

          console.log(this.map_starting_point)
          this._fillBackground()
          if (genMap){this._generateMap()}

          for (let i_raw = 0; i_raw < this.map.length; i_raw++) {
               const row = this.map[i_raw];
               for (let j_raw = 0; j_raw < row.length; j_raw++) {
                    const tile = row[j_raw];
                    
                    const i = ((this.canvas.height-(this.map.length*50))/2)+i_raw*50;
                    const j = ((this.canvas.width-(row.length*50))/2)+j_raw*50;

                    this.ctx.fillStyle = "#fff";
                    this.ctx.fillRect((j), (i), 50, 50);

                    const img = new Image();
                    // directions --
                    //   1
                    // 4 0 2
                    //   3
                    img.addEventListener("load", () => {
                         this._rotateAndPaintImage(img, (tile.direction-1)*Math.PI/2, j, i, 50, 50)
                    });
                    img.src = `/images/${tile.blockType}-thumb.png`;
               }
          }

          if (document.getElementById("map-text")) {
               document.getElementById("map-text").value = JSON.stringify({
                    name: document.forms[0].name.value,
                    map: this.map,
                    starting_point: this.map_starting_point
               });
          }
     }

     _rotateAndPaintImage( image, angleInRad, positionX, positionY, w, h  ) {
          this.ctx.save();
          this.ctx.translate((positionX+w/2), (positionY+h/2));
          this.ctx.rotate(angleInRad);
          this.ctx.translate(-w/2,-h/2);
          this.ctx.drawImage(image,0,0,w,h);
          this.ctx.restore();
     }

     _addListeners() {
          this.overlayCanvas.onclick = null;
          this.overlayCanvas.getContext("2d").clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
          var map = this.map;
          var editor = this;
          const handler = function (event) {
               this.map = map;
               this.editor = editor;
               this.ctx = this.getContext("2d");
               this.ctx.clearRect(0, 0, this.width, this.height);
               for (let i_raw = 0; i_raw < this.map.length; i_raw++) {
                    const row = this.map[i_raw];
                    for (let j_raw = 0; j_raw < row.length; j_raw++) {
                         
                         const i = ((this.height-(this.map.length*50))/2)+i_raw*50;
                         const j = ((this.width-(row.length*50))/2)+j_raw*50;
     
                         const cell = new Path2D();
                         cell.rect(j,i,50,50);
                         if (this.ctx.isPointInPath(cell, event.offsetX, event.offsetY)) {
                              this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
                              this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                              this.ctx.fill(cell);
                              this.editor.startEditing(i_raw,j_raw)
                         } else {
                              this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
                              this.ctx.fillRect((j), (i), 40, 40);
                         }
                    }
               }
          };
          this.overlayCanvas.onclick = handler;
     }

     _updateGrid(x, z) {
          if (!confirm("ALL DATA WILL BE LOST!\n\nCONTINUE WITH UPDATE OPERATION?")) return;
          this.z = z;
          this.x = x;
          console.log(this);
          this._createMapRepr(true);
          this._addListeners()
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