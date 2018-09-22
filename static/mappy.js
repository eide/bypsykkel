(() => {
  function renderMap(stations) {
    const $map = document.querySelector(".map");
    const map = new google.maps.Map($map, {
      center: { lat: 59.911491, lng: 10.757933 },
      zoom: 12
    });

    let openInfoWindow = null;

    for (const station of stations) {
      const marker = new google.maps.Marker({
        map,
        position: {
          lat: station.center.latitude,
          lng: station.center.longitude
        }
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `
        <h2>${station.title}<h2>
        <h3>${station.subtitle}</h3>
        <p>${station.bikes} ledige sykler<p>
        <p>${station.locks} ledige låser<p>
        `
      });
      marker.addListener("click", () => {
        if (openInfoWindow) {
          openInfoWindow.close();
        }
        openInfoWindow = infoWindow;
        infoWindow.open(map, marker);
      });
    }
  }

  window.initMap = function initMap() {
    renderMap(window.stations);
  };
})();
