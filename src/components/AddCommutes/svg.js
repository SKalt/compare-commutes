import Vue from 'vue';
import Inline from 'vue-inline';
const walking = require(`@/assets/ic_directions_walk_black_24px.svg`);
const driving = require(`@/assets/ic_directions_car_black_24px.svg`);
const transit = require(`@/assets/ic_directions_bus_black_24px.svg`);
const bicycling = require(`@/assets/ic_directions_bike_black_24px.svg`);
// import maki from 'maki';
// let req = require.context( maki.dirname + '/icons', true, /\.svg$/);
// const all = ['bicycle', 'bus', 'car'];
const icons = {
  walking, bicycling, transit, driving
};
// const all = new Set();
// req.keys().forEach((key) => {
//   // console.log(key);
//   icons[key] = req(key);
//   all.add(key
//     .replace('.svg', '')
//     .replace('-15', '')
//     .replace('-11', '')
//     .replace('./', '')
//   );
// });
Vue.use(Inline, {
  data: icons
});
const modes = Object.keys(icons);
console.log(icons);
export default modes;
