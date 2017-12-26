// import Autolinker from 'autolinker';
import debug from 'debug';
const log = debug('component:EditLocation');
debug.enable('component:*');
import {DateTimePicker} from 'vue-d-you-look-at-the-time';
export default {
  components: {'date-time-picker': DateTimePicker},
  props: ['type'],
  computed: {
    selected() {
      return this.$store.getters['selection/selected'];
    }
  },
  methods: {
    updateType(e) {
      let isOrigin = e.target.checked;
      let update = {
        id: this.selected.id, isOrigin
      };
      this.$store.commit('locations/update', update);
    },
    update(name, e) {
      let update = {
        id: this.selected.id, [name]: e.target.value
      };
      this.$store.commit('locations/update', update);
    },
    remove() {
      log('removing?');
      if (this.selected.included) {
        this.$store.commit('locations/remove', {id: this.selected.id});
        this.$store.commit('selection/select', {id: '-1', type: undefined});
      }
    }
  }
};
