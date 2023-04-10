import {
  mapState,
  mapActions
} from 'vuex'


export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('project', ['projectId', 'widgetIds', 'copyright', 'logo'])
  },
  methods: {
    ...mapActions('project', ['getWidgetConfig', 'commonWidget']),
  },
}
