import info from '@/components/Info/Info.vue';
import vSelect from 'vue-multiselect';
import modes from './svg.js';
import ModeCheckbox from '@/components/ModeCheckbox/ModeCheckbox.vue';
export default {
  data() {
    return {value: {}, modes};
  },
  components: {info, vSelect, ModeCheckbox},
  computed: {
    includedLocations() {
      return Object.values(this.$store.getters['locations/included'])
        .map((loc) => {
          let name = loc.alias || loc.address || loc.id;
          return {name, value: loc};
        });
    }
  },
  methods: {
    endpoint(end, e) {
      console.log(e);
      this.value[end] = e.value.id;
    }
  }
};
