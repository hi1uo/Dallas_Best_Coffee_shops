var map;
var
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

  var locations = [
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
      lat: 32.811740,
      lng: -96.774498
    },
    {
      title: "Urban COFFEE",
      lat: 32.780040,
      lng: -96.803787
    },
    {
      title: "Weekend Coffee",
      lat: 32.780326,
      lng: -96.798355
    },
    {
      title: "Stupid Good",
      lat: 32.782541,
      lng: -96.795324
    },
    {
      title: "ASCENSION COFFEE",
      lat: 32.793629,
      lng: -96.803780
    };
  ];

  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++){
    var position: new google.maps.LatLng(locations[i].lat, locations[i].lng);
    var title = locations[i].title;
    // create a maker per location and put into makers array
    var maker = new google.maps.Maker({
      position: position,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

  }



}
