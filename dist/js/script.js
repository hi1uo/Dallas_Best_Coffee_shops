var map,infowindow=new google.maps.InfoWindow,bounds=new google.maps.LatLngBounds,Store=function(e){"use strict";this.title=ko.observable(e.title),this.address=ko.observable(e.address),this.lat=ko.observable(e.lat),this.lng=ko.observable(e.lng);var t=new google.maps.LatLng(this.lat(),this.lng());this.position=ko.observable(t);var o=new google.maps.Marker({position:this.position(),map:map,title:this.title(),animation:google.maps.Animation.DROP});this.marker=ko.observable(o)},ViewModel=function(){"use strict";var e=this;e.shopList=ko.observableArray([]),e.filterList=ko.observableArray([]),e.query=ko.observable(""),e.init=function(){map=new google.maps.Map(document.getElementById("map-area"),{center:{lat:32.7767,lng:-96.797},mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI:!0})},e.buildLocations=function(){shopDatabase.forEach(function(t){e.shopList.push(new Store(t))})},e.setClickFunction=function(){e.shopList().forEach(function(t){bounds.extend(t.position()),t.marker().addListener("click",function(){e.showStoreInfo(t)})})},e.showStoreInfo=function(t){map.setCenter(t.position()),map.setZoom(15);var o='<div><h4 id="store-name">'+t.title()+"</h4><p>Address: "+t.address()+'</p><p><a target="_blank" id="yelp-url">yelp </a>: <span id="rating"></span> <img id="yelp"> <span id="reviews"></span></p><p>Phone: <span id="phone"></span></p></div>',s=window.matchMedia("(max-width: 700px)");s.matches?(document.getElementById("Mobilenav").style.height="150px",closeNav(),$("#Mobilenav").empty(),$("#Mobilenav").append(o)):(infowindow.setContent(o),infowindow.open(map,t.marker())),e.getYelpData(t)},e.search=function(t){e.filterList([]);for(var o in e.shopList()){var s=e.shopList()[o],a=s.title().toLowerCase();a.indexOf(t.toLowerCase())>=0?(e.filterList.push(e.shopList()[o]),s.marker().setMap(map),bounds.extend(s.position()),map.fitBounds(bounds)):s.marker().setMap(null)}$("#search").keypress(function(t){13==t.which&&e.showStoreInfo(e.filterList()[0])})},e.getYelpData=function(e){var t="https://api.yelp.com/v2/search/",o=function(e){for(var t="",o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",s=0;s<e;s++)t+=o.charAt(Math.floor(Math.random()*o.length));return t},s={oauth_consumer_key:"FBk0ZuP0PRBTekezNCM7xA",oauth_token:"Ix8AXGdC8aLnJQjnXTblYit7i64UnKzt",oauth_nonce:o(20),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",oauth_version:"1.0",callback:"cb",term:e.title(),location:"Dallas, tx",limit:1},a="X12-e9Q1AsLvNKGDpjKgMTZ4ep8",i="0sPuxJzhbHOK8YVc2iAdgih6v5A",n=oauthSignature.generate("GET",t,s,a,i);s.oauth_signature=n;var r={url:t,data:s,cache:!0,dataType:"jsonp",success:function(e){$("#yelp").attr("src",e.businesses[0].rating_img_url),$("#yelp-url").attr("href",e.businesses[0].url),$("#rating").text(e.businesses[0].rating+"/5"),$("#reviews").text(e.businesses[0].review_count+" reviews"),$("#phone").text(e.businesses[0].display_phone)},error:function(){$("#yelp").html("Error: No DATA.")}};$.ajax(r)},google.maps.event.addDomListener(window,"load",function(){e.init(),e.buildLocations(),e.setClickFunction(),e.filterList(e.shopList()),e.query.subscribe(e.search),map.fitBounds(bounds)})};ko.applyBindings(new ViewModel);