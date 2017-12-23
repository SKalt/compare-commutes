import Vue from 'vue';
import Router from 'vue-router';
// import AddLocation
Vue.use(Router);

export default new Router({
  routes: [
    {path: '/',
      name: 'root',
      // redirect to /add/origins iff no db found.
      children: [
        {path: '/add',
          children: [
            {path: '/origin',
              name: 'addOrigin'
              // component:
            },
            {path: '/destination',
              name: 'addDest'
              // component:
            },
            {path: '/commute',
              name: 'addCommute'
              // component:
            }
          ]
        },
        {path: '/explore'
        // component: explore
        }
      ]
    }
  ]
});
