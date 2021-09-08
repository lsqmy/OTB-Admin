// 先引入垫片，以支持低版本内核，如IE9
import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import {apiFetch} from '../axios/api'

Vue.use(Vuex);


const store = new Vuex.Store({
  state:{
    token:sessionStorage.getItem("token"),
    rightCodeList:[],
    userInfo:{},
    currencyList:[],
    siteList:[],
    platformList:[],
    tagsList: []
  },
  mutations:{
    SET_TOKEN:(state,newToken) => {
      state.token = newToken;
      sessionStorage.setItem("token",state.token)
    },
    SET_RIGHT_CODE:(state,rightCodeList) => {
      state.rightCodeList = rightCodeList
    },
    pushRightCode(state, rightCode) {
      state.rightCodeList.push(rightCode)
    },
    setTagsList(state) {
      state.tagsList = sessionStorage.tagsList ? JSON.parse(sessionStorage.tagsList) : []
    },
    createTag(state, tagObj) {
      state.tagsList.push(tagObj)
      sessionStorage.tagsList = JSON.stringify(state.tagsList)
    },
    removeTag(state, name) {
      state.tagsList.map((item, index) => {
        if (item.fName === name) {
          state.tagsList.splice(index, 1)
        }
      })
      sessionStorage.tagsList = JSON.stringify(state.tagsList)
    },
    download(state, data) {
      data.title = data.title || ''
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a')
        elink.download = data.title
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(data.blob)
        elink.setAttribute('download', data.title)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        // IE10+下载
        navigator.msSaveBlob(data.blob, data.title)
      }
    }
  },
  actions: {
    setToken({ commit }, userinfo) {
      let data=new FormData();
      data.append('userName',userinfo.userName);
      data.append('pwd',userinfo.pwd);
      return new Promise((resolve, reject) => {
        apiFetch({
          url: '/cts/user/login',
          method: 'post',
          data: data,
        })
          .then(response => {
            if (response.data.status === 1) {
              const newToken = response.data.data.token
              commit('SET_TOKEN', newToken)
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getRightCodeList({ commit }) {
      const api = {
        url: '/menu/selectMenuTreeByCurrentUser',
        method: 'get'
      }
      return new Promise((resolve, reject) => {
        apiFetch(api)
          .then(response => {
            if (response.data.code === '0') {
              commit('SET_RIGHT_CODE', [])
              store.dispatch('pushRightCodeList', response.data.data)
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    pushRightCodeList({ commit }, data) {
      if (data.length > 0) {
        data.forEach(item => {
          if (item.nodeType === '2' && item.hasRight === 1) {
            commit('pushRightCode', item.menuRightCode)
          }
          if (item.childList) {
            store.dispatch('pushRightCodeList', item.childList)
          }
        })
      }
    },
    getSiteList({ state }) {
      apiFetch({
        url: '/common/siteList',
        method: 'get'
      })
        .then(response => {
          console.log('siteList', response.data);
          if (response.data.status === 1) {
            state.siteList=response.data.data||{}
          }
        })
    },
    getPlatformList({ state }) {
      apiFetch({
        url: '/common/platformList',
        method: 'get'
      })
        .then(response => {
          console.log('platformList', response.data);
          if (response.data.status === 1) {
            state.platformList=response.data.data||{}
          }
        })
    },
  }
})

export default store

