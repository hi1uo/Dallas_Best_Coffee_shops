//create a map object
var map;

// info window
var infowindow = new google.maps.InfoWindow();

var bounds = new google.maps.LatLngBounds();

// to get the data from Model, and make it an Class
var Store = function(data){
  //swtich variables to Knockout observables
  this.title = ko.observable(data.title);
  this.address = ko.observable(data.address);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);

  var position = new google.maps.LatLng(this.lat(), this.lng());
  this.position = ko.observable(position);

  //to make a marker
  var marker = new google.maps.Marker({
    position: this.position(),
    map: map,
    title: this.title(),
    animation: google.maps.Animation.DROP,
  });
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
      // zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      //this will disable other option menu on the google map
      disableDefaultUI: true
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
      bounds.extend(store.position());
      store.marker().addListener('click', function(){
        self.showStoreInfo(store);
      });
    });
  };

  //show info window
  self.showStoreInfo = function(store){
    var storeDetail = '<div><h4 id="store-name">' + store.title() + '</h4>' +
                      '<p>Address: '+store.address()+'</p>'+
                      '<p><a target="_blank" id="yelp-url">yelp </a>: '+
                      '<span id="rating"></span> <img id="yelp"> '+
                      '<span id="reviews"></span></p>'+
                      '<p>Phone: '+'<span id="phone"></span>'+'</p></div>';
    self.getYelpData(store);
    map.setCenter(store.position());
    map.setZoom(15);
    //media query
    var mq = window.matchMedia( "(max-width: 700px)" );
    if(mq.matches){
      //when on the mobile device, all info will show in the bottom.
      document.getElementById("Mobilenav").style.height = "150px";
      closeNav();
      $('#Mobilenav').empty();
      $('#Mobilenav').append(storeDetail);
    }
    else {
      infowindow.setContent(storeDetail);
      infowindow.open(map, store.marker());
    }
  };

  //live search function
  //credit: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
  self.search = function(value){
    //clear out filterList
    self.filterList([]);

    for(var i in self.shopList()){
      var storeIndex = self.shopList()[i];
      var storeName = storeIndex.title().toLowerCase();
      if(storeName.indexOf(value.toLowerCase())>= 0){
        self.filterList.push(self.shopList()[i]);
        storeIndex.marker().setMap(map);
        bounds.extend(storeIndex.position());
        map.fitBounds(bounds);
      }
      else {
        storeIndex.marker().setMap(null);
      }
    }

    //press Enter to get the first shop info in the filterList
    $("#search").keypress(function(e){
      if(e.which == 13){
        self.showStoreInfo(self.filterList()[0]);
      }
    });
  };

  //Yelp info
  self.getYelpData = function(store){
    // Use the GET method for the request
    var url = 'https://api.yelp.com/v2/search/';

    var nonce = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    var parameters = {
      oauth_consumer_key: 'FBk0ZuP0PRBTekezNCM7xA',
      oauth_token: 'Ix8AXGdC8aLnJQjnXTblYit7i64UnKzt',
      oauth_nonce: nonce(20),
      oauth_timestamp: Math.floor(Date.now() / 1000),
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
    var encodedSignature = oauthSignature.generate('GET', url, parameters, consumerSecret, tokenSecret);

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
        $('#rating').text(response.businesses[0].rating +"/5");
        $('#reviews').text(response.businesses[0].review_count+" reviews");
        $('#phone').text(response.businesses[0].display_phone);
      },
      error: function() {
        $('#yelp').html('Error: No DATA.');
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
    // subscribe to updates on query and call a search function
    self.query.subscribe(self.search);
    map.fitBounds(bounds);

  });
};

ko.applyBindings(new ViewModel());
