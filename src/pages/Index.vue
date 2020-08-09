<template>
  <q-page class="flex flex-center">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="blue" @click="addPDF" />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    addPDF () {
      this.$q.electron.ipcRenderer.invoke('PDF', 'add', {
        file: 'test'
      })
      console.log('add')
    }
  }
}
</script>
