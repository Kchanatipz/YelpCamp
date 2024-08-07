mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

// add marker to the map
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.name}</h3> <p>${campground.location}</p>`
    )
  )
  .addTo(map);
