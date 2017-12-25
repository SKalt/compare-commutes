import info from '@/components/Info/Info.vue';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import EditLocation from '@/components/EditLocation/EditLocation.vue';
export default {
  props: ['type'], // type = origin | destination
  components: {info, VueGoogleAutocomplete, EditLocation},
  computed: {
    aLocationSelected() {
      let {type} = this.$store.getters['selection/selected'];
      return type && type != 'commute';
    }
  },
  methods: {
    unselectOnEmpty(e) {
      if (!e.newVal) this.$store.commit('selection/select', {id: '-1'});
    },
    handleSelection(...e) {
      let {
        administrative_area_level_1: state,
        // country,
        latitude: lat,
        longitude: lng,
        locality: town,
        postal_code: zipCode
        // route: rd,
        // street_number
      } = e[0];
      let {foramatted_address: address, name, url} = e[1];
      const submission = {
        lat, lng, alias: name, type: this.type, isOrigin: this.type == 'origin',
        address, notes: `${town}, ${state} ${zipCode}\n${url}`
      };
      this.$store.dispatch('locations/add', submission);
    }
  }
};
