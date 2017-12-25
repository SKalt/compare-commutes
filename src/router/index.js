import Vue from 'vue';
import Router from 'vue-router';
// import AddLocation
Vue.use(Router);
import AddLocations from '@/components/AddLocations/AddLocations.vue';
import Compare from '@/components/CompareCommutes/CompareCommutes.vue';
import Pass from '@/components/Pass/Pass.vue';
import AddCommutes from '@/components/AddCommutes/AddCommutes.vue';
export default new Router({
  routes: [
    {path: '/',
      name: 'root',
      component: Pass,
      children: [
        {path: '/add',
          component: Pass,
         // main.js will redirect to /add/origins iff no db found.
          children: [
            {path: 'locations/:type',
              component: AddLocations,
              props: true
            },
            {path: 'commutes',
              name: 'addCommutes',
              component: AddCommutes
            }
          ]
        },
        {path: '/compare',
          name: 'compare',
          component: Compare
        }
      ]
    }
  ]
});
