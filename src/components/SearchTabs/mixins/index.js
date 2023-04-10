import { setSearchId } from '@/utils/query-string'

export default {
  data() {
    return {
      keyword: '',
      resourceIds: null
    }
  },
  computed: {
    // ...mapState('search', ['gradeSearchConfig'])
  },
  methods: {
    setQuery(type = 'base') {
      const {
        keyword,
        resourceIds,
        field,
        searchLogic,
        fields,
        config: { disabledGradeSearch }
      } = this
      if (!resourceIds || !resourceIds.length)
        return this.$Message.info('请选择资源类型')
      const query = {
        resourceIds
      }
      if (type === 'base' && keyword && keyword.trim()) {
        query.keyword = keyword
      }
      if (type === 'base' && field) {
        query.field = field
        const [current] = fields.filter(item => item.name === field)
        query.fieldLabel = current.label
      }
      if (type === 'advanced') {
        query.searchLogic = searchLogic
      }
      return setSearchId(query)
    },
    setUnion(arr1, arr2, key = 'name') {
      const arr1Names = arr1.map(item => item.name)
      const arr1Labels = arr1.map(item => {
        if (typeof item.label === 'string') {
          item.label = item.label.split('/')
          return item.label
        } else {
          return item.label
        }
      })
      var result = arr2
        .filter(function(v) {
          const index = arr1Names.indexOf(v[key])
          return index !== -1
        })
        .map(item => {
          const index = arr1Names.indexOf(item.name)
          if (index !== -1) {
            if (arr1Labels[index].indexOf(item.label) === -1) {
              console.log(arr1Labels[index])
              item.label = [...arr1Labels[index], item.label]
            } else {
              item.label = arr1Labels[index]
            }
          }
          return item
        })
      return result.map(item => {
        return {
          ...item,
          label: item.label.join('/')
        }
      })
    }
  }
}
