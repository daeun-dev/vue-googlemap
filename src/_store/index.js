import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pageTitle: '',
    currentPage: '',
    beforeListPage: '',
    beforeListParams: {},
    apiCallEnable: 'true'
  },
  mutations: {
    setPageTitle (state, titleText) {
      state.pageTitle = titleText
    },
    setCurrentPage (state, pageUrl) {
      state.currentPage = pageUrl
    },
    setBeforeListPage (state, pageUrl) {
      state.beforeListPage = pageUrl
    },
    setBeforeListParams (state, searchParams) {
      state.beforeListParams = searchParams
    },
    setApiCallEnable (state, flag) {
      state.apiCallEnable = flag
    }
  }
})

export default store
