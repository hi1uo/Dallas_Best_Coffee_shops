## Neighborhood Map project
### Best Coffee Shops in Dallas
#### Project Overview
In this project, I developed a single page application featuring a map of 12 high rated coffee shops in Dallas Neighborhood.

Technology Used: HTML, CSS, bootstrap, JavaScript, jQuery, Ajax, knockoutJS, Google Maps API, Yelp API, and Gulp.

#### How to Open the App:
1. Open online via github page: https://jerryluo1989.github.io/Neighborhood-Map/dist/index.html
2. Host the app locally on localhost:
  * Download/Clone the code from [here](https://github.com/jerryluo1989/Neighborhood-Map)
  * Run a local server as following:  
    ```bash
    $> cd /path/to/your-project-folder
    $> python -m SimpleHTTPServer 8080
    ```
  * Open a browser and visit localhost:8080
3. Simple open the index.html file
    ```bash
    $> cd /path/to/your-project-folder/src
    ```

#### Gulp Setup
Gulp is configured to resize img, minify js/css/html/img, and cleaning up the existing. For more detail, please Refer to gulpfile.js file and [Gulp tutorial for beginner](https://css-tricks.com/gulp-for-beginners/)

1. Required dependencies or packages
  - htmlmin:  npm i gulp-htmlmin --save-dev
  - cssnano:  npm i cssnano --save-dev
  - uglify:   npm i uglify --save-dev
  - cache: npm i cache --save-dev
  - del: npm i del --save-dev
  - run-sequence: npm i run-sequence --save-dev

2. As run-sequence has been setup, By using one command 'gulp', all the previous optimized file will be cleared out, and html,css,js will be minified and saved under dist folder.
```bash
gulp.task('default', function(){
  runSequence(['clean:dist', 'htmlmin', 'cssmin', 'js']);
});
```
3. Run gulp to optimize the files as above:
```bash
$> gulp
```

#### Desktop User
- Design:
  * A shop list on the left
  * Search bar floating on the map
  * Maker window. Including the shops' name, address, phone number and Yelp link/reviews.
- How to use:
  * User can search the shops in the search bar anytime. Shops in the list and map will be filtered as user types in.
  * When click the marker or the shop name in the list or press ENTER after searching, the selected shop will be centered and zoomed in, with Marker window popping up.

![alt text](screenshots/Desktop.png "Description goes here")

#### Mobile User
- Design:
  * A hamburger icon. This will trigger the hidden shop list
  * Search bar floating on the map
  * Bottom card. Including the shops' name, address, phone number and Yelp link/reviews.
- How to use:
  * User can search the shops in the search bar anytime. Shops in the list and map will be filtered as user types in.
  * When click the marker or the shop name in the list or press ENTER after searching, the selected shop will be centered and zoomed in, with Bottom card popping up.

![alt text](screenshots/mobile.png "Description goes here")
