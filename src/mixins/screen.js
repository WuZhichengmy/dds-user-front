export default {
  data() {
    return {
      screenWidth: 0
    }
  },
  computed: {},
  mounted() {
    this.initScreenWidth()
  },
  beforeDestroy() {
    this.screenWidth = 0
    // window.removeEventListener('resize')
  },
  methods: {
    initScreenWidth() {
      this.screenWidth = document.body.clientWidth
      window.addEventListener('resize', () => {
        this.screenWidth = document.body.clientWidth
      })
    }
  }
}
