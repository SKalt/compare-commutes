import debug from 'debug';
export default {
  computed: {
    shown() {
      return !!this.$route.query.info;
    }
  },
  methods: {
    toggle() {
      debug('components:info')('toggled');
      this.$router.push({query: {info: !!!this.shown}});
    }
  }
};
