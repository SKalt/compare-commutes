import info from '@/components/Info/Info.vue';
import vSelect from 'vue-multiselect';
export default {
  components: {info, vSelect},
  computed: {
    includedLocations() {
      return Object.values(this.$store.getters['locations/included'])
        .map((loc) => {
          let name = loc.alias || loc.address || loc.id;
          return {name, value: loc};
        });
    }
  }
};
