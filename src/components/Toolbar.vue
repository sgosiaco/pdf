<template>
  <q-bar class="q-electron-drag bg-black text-white">
    <div>{{title}}</div>
    <q-space/>
    <q-btn dense flat icon="minimize" @click="minimize"/>
    <q-btn dense flat :icon="isMaximized ? 'filter_none' : 'crop_square'" @click="maximize"/>
    <q-btn dense flat icon="close" @click="closeWindow"/>
  </q-bar>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    minimize () {
      this.$q.electron.ipcRenderer.invoke('window', 'minimize')
    },
    maximize () {
      this.$q.electron.ipcRenderer.invoke('window', 'maximize')
        .then((res) => {
          this.isMaximized = res
        })
    },
    closeWindow () {
      this.$q.electron.ipcRenderer.invoke('window', 'close')
    }
  },
  data () {
    return {
      isMaximized: false
    }
  }
}
</script>
