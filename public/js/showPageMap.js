
mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: campgroundData.geometry.coordinates, // starting position [lng, lat]
    zoom: 11.5, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campgroundData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 20 })
            .setHTML(
                `<h3>${campgroundData.title}</h3> <p>${campgroundData.location}</p>`
            )
    )
    .addTo(map)
