import Autolinker from 'autolinker';
import debug from 'debug';
const log = debug('component:EditLocation');
debug.enable('component:*');
export default {
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
    remove(e) {
      if (this.id) this.$store.commit('locations/remove', {id: this.id});
    }
  }
};
