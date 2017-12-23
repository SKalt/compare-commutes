# compare-commutes

> Vue ui to compare aggregate commutes between apartments

# How Much Is Your Commute Worth?
Choosing where to live is a delicate balance of rent, roommates, amenities, and
commute.  This is a tool put hard numbers on how much commute time a location
will cost you.

## How this helps
This application selects candidate home locations and commute destinations, from
work to the gym to cool-looking cafes and restaurants. The application then uses
the Mapzen time-distance API to grab the commute times via specified modes of
transport at specified times of day.  The application finally compares weighted
sums of commute time (+ cost) for each candidate home location.

Using this saves you re-re-re-searching the commute times for each apartment you
 consider.

## Prior art
- [Trulia's commute map](https://www.trulia.com/local/los-angeles-ca/driving:0|transit:1|position:34.052218;-118.243389|time:60_commute)
- [Mapbox's time map](https://blog.mapbox.com/a-new-kind-of-map-its-about-time-7bd9f7916f7f)
- [Mapbox's isochrone plugin](https://blog.mapbox.com/add-isochrones-to-your-next-application-e9e84a62345f)
- the saying "time is money"
- Discussing distances in terms of time
- Theory of general relativity(?)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
