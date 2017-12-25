<template>
  <div class="info-panel">
    <span
      @click="toggle"
      class="glyphicon glyphicon-question-sign"></span>
    <span v-show="shown">
      <slot>
        <!-- Text passed here -->
      </slot>
    </span>
  </div>
</template>

<script src="./logic.js"></script>

<style src="./style.css"></style>
