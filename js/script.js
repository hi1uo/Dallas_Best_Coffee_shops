var map;
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.7767, lng: -96.7970},
    zoom: 13
  });

  var utd = {lat: 32.984813, lng: -96.749689};
  var maker = new google.maps.Marker({
    position: utd,
    map:map,
    title: 'UT Dallas'
  });

  var markers = [
    {
      title: "Lockhart Smokehouse",
      lat: 33.019405,
      lng: -96.699501
    },
    {
      title: "Pecan Lodge",
      lat: 32.784795,
      lng: -96.783753
    },
    {
      title: "Smoke",
      lat: 32.769271,
      lng:-96.837296
    },
    {
      title: "Off the Bone Barbeque",
      lat: 32.765962,
      lng:-96.792241
    },
    {
      title: "Sammy’s Bar-B-Q",
      lat: 32.794459,
      lng: -96.799984
    },
    {
      title: "HOUNDSTOOTH COFFEE",
      lat:
      lng:
    },
    {
      title: "GLOBAL PEACE FACTORY",
      lat:
      lng:
    },
    {
      title: "COFFEE HOUSE CAFE",
      lat:
      lng:
    },
    {
      title: "CULTIVAR",
      lat:
      lng:
    },
    {
      title: "ASCENSION COFFEE",
      lat: 32.793629,
      lng: -96.803780
    }

  ];

}
