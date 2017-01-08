//create a map object
var map;

//Asynchronous initilization of google map
function initMap() {
  'use strict';
  map = new google.maps.Map(document.getElementById("map-area"), {
    center: {lat: 32.7767, lng: -96.7970},
    // zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //this will disable other option menu on the google map
    disableDefaultUI: true
  });

  // info window
  var infowindow = new google.maps.InfoWindow();

  var bounds = new google.maps.LatLngBounds();

  // to get the data from Model, and make it an Class
  var Store = function(data){
    //swtich variables to Knockout observables
    this.title = data.title;
    this.address = data.address;
    this.lat = data.lat;
    this.lng = data.lng;
    this.position = new google.maps.LatLng(this.lat, this.lng);
    this.marker = new google.maps.Marker({
      position: this.position,
      map: map,
      title: this.title,
      animation: google.maps.Animation.DROP,
    });
  };

  // ViewModel KO
  var ViewModel = function(){
    var self = this;
    self.shopList = ko.observableArray([]);
    self.filterList = ko.observableArray([]);
    self.query = ko.observable("");

    // Mobile bottom Panel and content observable
    self.showmobilepanel = ko.observable(false);
    self.shopDetailMobile = ko.observable("");

    //Depending on screen size, the sideList will show or hidde by default.
    var mq = window.matchMedia( "(max-width: 700px)" );
    if(mq.matches){
      self.showSidelist = ko.observable(false);
    }
    else
      self.showSidelist = ko.observable(true);

    self.closeNav = function(){
      self.showSidelist(false);
      // self.showmobilepanel(true);
    };

    self.openNav= function(){
      self.showSidelist(true);
      self.showmobilepanel(false);
    };

    //datas -> observableArray
    var buildLocations = function(){
      shopDatabase.forEach(function(store){
        self.shopList.push(new Store(store));
      });
    };

    //Click marker function
    var setClickFunction = function(){
      self.shopList().forEach(function(store){
        bounds.extend(store.position);
        store.marker.addListener('click', function(){
          self.showStoreInfo(store);
        });
      });
    };

    //When click the markers or name in the list, the marker will bounce
    var toggleBounce = function (marker){
      if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function(){marker.setAnimation(null);},700);
          }
        };

    //show info window
    var storeDetail;
    self.showStoreInfo = function(store){
      toggleBounce(store.marker);
      map.setCenter(store.position);
      map.setZoom(15);
      getYelpData(store);
      updateView(store, storeDetail);
    };

    var updateView = function(store, storeDetailDOM){
      var mq = window.matchMedia( "(max-width: 700px)" );
      if(mq.matches){
        //when on the mobile device, all info will show in the bottom panel.
        self.shopDetailMobile("");
        self.showmobilepanel(true);
        self.closeNav();
        self.shopDetailMobile(storeDetailDOM);
      }
      else {
        infowindow.setContent("");
        infowindow.setContent(storeDetailDOM);
        infowindow.open(map, store.marker);
      }
    };

    //live search function
    //credit: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
    self.search = function(value){
      //clear out filterList
      self.filterList([]);
      self.shopList().forEach(function(storeIndex){
        var storeName = storeIndex.title.toLowerCase();
        if(storeName.indexOf(value.toLowerCase())>= 0){
          self.filterList.push(storeIndex);
          // instead of setMap(map), usesetVisible(true|false), which only show/hide on the map
          storeIndex.marker.setVisible(true);
          bounds.extend(storeIndex.position);
          map.fitBounds(bounds);
        }
        else
          storeIndex.marker.setVisible(false);
        });
    };

    //press Enter to get the first shop info in the filterList
    //Credit: http://stackoverflow.com/questions/23087721/call-function-on-enter-key-press-knockout-js
    self.onEnter = function(d, e){
      if(e.keyCode === 13){
        self.showStoreInfo(self.filterList()[0]);
      }
    };

    //Yelp info
    var getYelpData = function(store){
      var url = "https://api.yelp.com/v2/search/";
      // Nnonce generator: https://blog.nraboy.com/2015/03/create-a-random-nonce-string-using-javascript/
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
        term: store.title,
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
        dataType: 'jsonp'
      };
      $.ajax(ajaxSettings)
      .done(function(response){
        // Either inform user that there's no data available or show data.
        var
        url = response.businesses[0].url ? response.businesses[0].url : url = 'No link',
        rating = response.businesses[0].rating ? response.businesses[0].rating : rating = 'No rating available',
        phone = response.businesses[0].display_phone ? response.businesses[0].display_phone: phone= 'No phone number provided',
        address = response.businesses[0].address ? response.businesses[0].address: address= 'Address not found',
        rating_img = response.businesses[0].rating_img_url ? response.businesses[0].rating_img_url: rating_img= ' ',
        total = response.businesses[0].review_count ? response.businesses[0].review_count: address= ' ';

        //Build the info window stream
        var storeNameHTML = '<h4 id="store-name">'+store.title+'</h4>';
        var storeAddressHTML = '<p>Address: <span>'+address+'</span></p>';
        var yelpURLHTML = '<a target="_blank" id="yelp-url" href="'+url+'">yelp:</a>';
        var yelpRatingHTML = '<span id="rating">'+rating +"/5 "+'</span>';
        var ratingImgHTML = '<img id="rating-img" src ="'+rating_img+'">';
        var reviewNumberHTML = '<span id="reviews">'+total+" reviews"+'</span>';
        var phoneHTML = '<p>Phone: '+phone+'</p>';
        storeDetail = storeNameHTML + storeAddressHTML + '<p>'+yelpURLHTML+yelpRatingHTML+ratingImgHTML+reviewNumberHTML+phoneHTML+'</p>';
        updateView(store, storeDetail);
      })
      .fail(function(){
        alert('No Yelp Data');});
    };


  //loading the page, and initilize
  google.maps.event.addDomListener(window, 'load', function(){
    buildLocations();
    setClickFunction();
    self.filterList(self.shopList());
    // subscribe to updates on query and call a search function
    self.query.subscribe(self.search);
    map.fitBounds(bounds);
  });

  //To make map display responsive. Thanks to the Code viewer's suggestion
  google.maps.event.addDomListener(window, 'resize', function() {
    map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
  });
};

ko.applyBindings(new ViewModel());
}

function googleError(){
  "use strict";
  alert("Oops! Cannot load the map");
}
