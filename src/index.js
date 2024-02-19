import MapEditor from "./mapEditor";

var form = document.forms[0];

form.tilesX.addEventListener("change", function () {
	mapEditor._updateGrid(form.tilesX.value, form.tilesZ.value)
});

form.tilesZ.addEventListener("change", function () {
	mapEditor._updateGrid(form.tilesX.value, form.tilesZ.value)
});

var x = 5;
var z = 5;

var mapEditor = new MapEditor(document.getElementById("map"), x,z, document.getElementById("tileEditor"))
mapEditor.initialize()