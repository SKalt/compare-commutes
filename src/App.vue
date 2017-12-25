<template>
  <div id="app">
    <nav>
      <router-link
        id="to-add-origins"
        :to="sameQuery('/add/locations/origin')"
        class="btn router-btn">
        Add Origins
      </router-link>
      <!-- :to="{ path: '/add/locations/origin', query: {...$router.query} }"> -->
      <router-link
        id="to-add-destinations"
        class="btn router-btn"
        :to="sameQuery('/add/locations/destination')">
        Add Destinations
      </router-link>
      <!-- :to="{ path: '/add/locations/destination', query: {...$router.query} }"> -->
      <router-link
        class="btn router-btn"
        id="to-add-commutes"
        :to="sameQuery('/add/commutes')">
        Add Commutes
      </router-link>
      <router-link
        id="to-compare"
        class="btn router-btn"
        :to="sameQuery('/compare')">
        Compare
      </router-link>
    </nav>
    <h2>{{title}}</h2>
    <router-view>
    </router-view>
  </div>
</template>

<script>
let titleCase = (word) => (word[0] || '').toUpperCase() + word.slice(1);
export default {
  computed: {
    title() {
      switch (this.$route.path) {
      case '/add/locations/origin':
        return 'Add Origins';
      case '/add/locations/destination':
        return 'Add Destinations'
      default:
        return this.$route.path.split('/')
          .map((word) => titleCase(word)).join(' ');
      }
    }
  },
  methods: {
    sameQuery(path) {
       return {path, query: this.$route.query}
    }
  },
  name: 'app',
}
</script>

<style>
.router-btn {
  border: 1px solid #ccc;
  border-radius: 2px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
