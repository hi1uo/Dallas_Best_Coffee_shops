//create a map object
var map;

// info window
var infowindow = new google.maps.InfoWindow({
  // content: '<div><h4 id="store-name"></h4><p id="store-address"></p><p id="yelp"></p></div>'
});
var bounds = new google.maps.LatLngBounds();

// to get the data from Model, and make it an Class
var Store = function(data){
  //swtich variables to Knockout observables
  this.title = ko.observable(data.title);
  this.address = ko.observable(data.address);

  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  //to make a marker
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat(), this.lng()),
    map: map,
    title: this.title(),
    animation: google.maps.Animation.DROP,
  });
  // marker variables
  this.marker = ko.observable(marker);
};

// ViewModel KO
var ViewModel = function(){
  var self = this;
  self.shopList = ko.observableArray([]);
  self.filterList = ko.observableArray([]);
  self.query = ko.observable('');

  //initialize google map
  self.init = function(){
    map = new google.maps.Map(document.getElementById('map-area'), {
      center: {lat: 32.7767, lng: -96.7970},
      zoom: 15
    });
  };

  //datas -> observableArray
  self.buildLocations = function(){
    shopDatabase.forEach(function(store){
      self.shopList.push(new Store(store));
    });
  };

  //Click on shops, show more detail.
  self.setClickFunction = function(){
    self.shopList().forEach(function(store){
      var position = new google.maps.LatLng(store.lat(), store.lng());
      bounds.extend(position);
      store.marker().addListener('click', function(){
        self.showStoreInfo(store);
      });
    });
  };

  //show info window
  self.showStoreInfo = function(store){
    var storeDetail = '<div><h4 id="store-name">' + store.title() + '</h4>' +
                      '<p>'+store.address()+'</p>'+
                      '<p id="text">Rating on <a id="yelp-url">yelp</a>: ' +
                      '<img id="yelp"></p></div>';
    infowindow.setContent(storeDetail);
    self.getYelpData(store);
    infowindow.open(map, store.marker());
  };

  //live search function
  //credit: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
  self.search = function(value){
    self.filterList([]);

    for(var i in self.shopList()){
      var storeName = self.shopList()[i].title().toLowerCase();
      if(storeName.indexOf(value.toLowerCase())>= 0){
        self.filterList.push(self.shopList()[i]);
        self.shopList()[i].marker().setMap(map);
      }
      else {
        self.shopList()[i].marker().setMap(null);
      }
    }
  };

  //Yelp info
  self.getYelpData = function(store){
    //Not sure how to use YELP Fusion API, get stuck on Client Credentials of Oauth2
    // Use the GET method for the request
    var httpMethod = 'GET';
    var url = 'http://api.yelp.com/v2/search/';
    var parameters = {
      oauth_consumer_key: 'FBk0ZuP0PRBTekezNCM7xA',
      oauth_token: 'Ix8AXGdC8aLnJQjnXTblYit7i64UnKzt',
      oauth_nonce: '3uYSQ2pTgmZeNu2VS4cg',
      oauth_timestamp: '1477627865',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
      callback: 'cb',
      term: store.title(),
      location: 'Dallas, tx', // always search within Dallas, TX
      limit: 1
    };
    var consumerSecret = 'X12-e9Q1AsLvNKGDpjKgMTZ4ep8';
    var tokenSecret = '0sPuxJzhbHOK8YVc2iAdgih6v5A';

    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
    var encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

    // Add signature to list of parameters
    parameters.oauth_signature = encodedSignature;

    var ajaxSettings = {
      url: url,
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      success: function(response){
        $('#yelp').attr("src", response.businesses[0].rating_img_url);
        $('#yelp-url').attr("href", response.businesses[0].url);
      },
      error: function() {
        $('#text').html('Error: No DATA.');
      }
    };

    $.ajax(ajaxSettings);
  };

//loading the page
  google.maps.event.addDomListener(window, 'load', function() {
    self.init();
    self.buildLocations();
    self.setClickFunction();
    self.filterList(self.shopList());
    self.query.subscribe(self.search);
    map.fitBounds(bounds);
  });
};

ko.applyBindings(new ViewModel());
