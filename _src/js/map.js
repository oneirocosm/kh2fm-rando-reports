/* global L */
/* global worldName */

class State {
  constructor() {
    this.markers = [];
    this.selected = undefined;
  }
}

const state = new State();

const processChest = function (chest) {
  let marker;
  // a debug mode to make develpment easier
  if (chest.mapLat == null || chest.mapLon == null) {
    console.log("debug");
    marker = L.marker([0.0, 0.0], {
      draggable: true,
    })
      .addTo(map)
      .bindPopup(chestPopup(chest));

    marker.on("dragend", function (e) {
      const marker = e.target;
      const position = marker.getLatLng();
      console.log(position.lat.toString() + " : " + position.lng.toString());
    });
  } else {
    marker = L.marker([chest.mapLat, chest.mapLon])
      .addTo(map)
      .bindPopup(chestPopup(chest));
  }
  return marker;
};

const chestPopup = function (chest) {
  return (
    `Journal World: ${chest.journalWorld}<br>` +
    `Journal Number: ${chest.journalId}<br>` +
    `ID: ${chest.gameId}`
  );
};

const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -1,
  maxZoom: 4,
  zoomSnap: 0.25,
});

const bounds = [
  [0, 0],
  [1000, 1000],
];
L.imageOverlay(`/img/${worldName}.png`, bounds).addTo(map);

fetch("/js/chests.json")
  .then((response) => response.json())
  .then((worlds) => {
    for (const chest of worlds[worldName]) {
      state.selected = "this works";
      const marker = processChest(chest);
      state.markers.push(marker);
    }
  });

map.fitBounds(bounds);
