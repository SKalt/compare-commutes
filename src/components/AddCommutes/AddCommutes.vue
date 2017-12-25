<template>
  <div class="col-xs-12">
    <info>
      <span>
        A commute is a trip you plan on doing with any sort of frequency.  To add a
        destination, select a start and end location, select a mode of transit and a
        sample time you would commute, then click 'Add'.  When you've entered the
        commutes you want, click 'Get Commute Durations' to bulk-search how long
        each commute takes.
      </span>
    </info>
    <v-select
      class="col-md-4"
      track-by="name"
      label="name"
      placeholder="from"
      :options="includedLocations"
      @input="e => endpoint('from', e)"
      ></v-select>
    <v-select
      class="col-md-4"
      placeholder="to"
      track-by="name"
      label="name"
      :options="includedLocations"
      @input="e => endpoint('to', e)"
      ></v-select>
      <mode-checkbox
        v-for="mode in modes"
        :key="mode"
        :mode="mode"
        @click="select(mode)"
        ></mode-checkbox>
  </div>
</template>

<script src="./logic.js"></script>

<style src="./style.css"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
