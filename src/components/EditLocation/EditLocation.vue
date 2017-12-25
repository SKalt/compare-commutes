<template>
  <div class="col-xs-12">
    <!-- type -->
    <input
      type="checkbox"
      id="include-as-origin"
      :checked="$store.getters['selection/selected'].isOrigin"
      @input="e => update('type', e)"
      />
    <label for="include-as-origin">Use this location as an origin</label>
    <!-- alias -->
    <input
      class="col-xs-12"
      type="text"
      :value="$store.getters['selection/selected'].alias"
      @input="e => update('alias', e)"
      />
    <!-- address -->
    <input
      class="col-xs-12"
      type="text"
      :value="$store.getters['selection/selected'].address"
      @input="e => update('address', e)"
      />
    <!-- notes -->
    <div contenteditable
      class="col-xs-12 notes-box"
      type="text"
      title="notes"
      data-placeholder="notes on this location"
      @input="e => update('notes', e)"
      v-html="notes"
      >
      {{notes}}
    </div>
    <!-- delete -->
    <div class="col-xs-12">
      <button
        class="btn btn-default"
        @click="remove">
        delete
      </button>
    </div>
  </div>
</template>

<script src="./logic.js"></script>

<style src="./style.css"></style>
