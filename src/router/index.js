import Vue from 'vue';
import Router from 'vue-router';
// import AddLocation
Vue.use(Router);

export default new Router({
  routes: [
    {path: '/',
      name: 'root',
      // main.js will redirect to /add/origins iff no db found.
      children: [
        {path: '/add',
          children: [
            {path: 'origins',
              name: 'addOrigins'
              // component:
            },
            {path: 'destinations',
              name: 'addDestinations'
              // component:
            },
            {path: 'commutes',
              name: 'addCommutes'
              // component:
            }
          ]
        },
        {path: '/compare',
          name: 'compare'
        // component: explore
        }
      ]
    }
  ]
});
