export default {
  data() {
    return {time: null, date: null};
  },
  computed: {
    ready() {
      return this.time && this.date;
    },
    value() {
      return new Date(`${this.date} ${this.time}`);
    }
  },
  methods: {
    _set(name, e) {
      this[name] = e.target.value;
      if (this.ready) {
        this.$emit('input', this.value);
      }
    },
    setTime(e) {
      this._set('time', e);
    },
    setDate(e) {
      this._set('date', e);
    }
  }
};
