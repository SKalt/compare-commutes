<template>
  <div>
    <info>
      <span class="info-panel">
        <span v-if="type == 'origin'">
          This app compares net commute times of 'origins'.  To add an origin,
        </span>
        <span v-else>
          A destination is a place you regularly go, such as work, the grocery store,
          or the gym.  To add a destination,
        </span>
        either click the map or look up an address using the geocoder,
        then click 'Add'.
      </span>
    </info>
    <!-- use className to pass classes to <input /> -->
    <!-- use id to pass id to the google autocomplete (required?) -->
    <VueGoogleAutocomplete
      id="autocompleteGeocoder"
      placeholder="Search for places"
      @placechanged="handleSelection"
      @inputChange="unselectOnEmpty"
    ></VueGoogleAutocomplete>
    <edit-location v-if="aLocationSelected"></edit-location>
  </div>
</template>

<script src="./logic.js"></script>

<style src="./style.css"></style>
