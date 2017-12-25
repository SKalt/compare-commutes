import Autolinker from 'autolinker';
import debug from 'debug';
const log = debug('component:EditLocation');
debug.enable('component:*');
export default {
  computed: {
    notes() {
      return Autolinker.link(this.$store.getters['selection/selected'].notes);
    }
  },
  methods: {
    update(name, e) {
      let updated;
      log(name, e);
      updated = e.target[name == 'type' ? 'checked' : 'textContent'];
      if (updated !== undefined) {
        let update = {
          id: this.$store.getters['selection/selected'], [name]: update
        };
        this.$store.commit('locations/update', update);
      }
    },
    remove(e) {
      if (this.id) this.$store.commit('locations/remove', {id: this.id});
    }
  }
};
