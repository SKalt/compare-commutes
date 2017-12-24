<template>
  <div id="app">
    <nav>
      <router-link
        id="to-add-origins"
        class="btn router-btn"
        :to="{ name: 'addOrigins', params: {} }">
        Add Origins
      </router-link>
      <router-link
        id="to-add-destinations"
        class="btn router-btn"
       :to="{ name: 'addDestinations', params: {} }">
        Add Destinations
      </router-link>
      <router-link
        class="btn router-btn"
        id="to-add-commutes"
        :to="{ name: 'addCommutes', params: {} }">
        Add Commutes
      </router-link>
      <router-link
        id="to-compare"
        class="btn router-btn"
        :to="{ name: 'compare',  params: {} }">
        Compare
      </router-link>
    </nav>
    <h2>{{title}}</h2>
    <router-view></router-view>
  </div>
</template>

<script>
let titleCase = (word) => (word[0] || '').toUpperCase() + word.slice(1);
export default {
  computed: {
    title(){
      return this.$route.path.split('/')
        .map((word) => titleCase(word)).join(' ')
    }
  },
  name: 'app'
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
