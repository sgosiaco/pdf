<template>
  <q-page class="flex flex-center">
    <draggable :list="files">
      <q-card v-for="file in files" :key="file.time">
        <q-card-section>
          {{ file.name }}
        </q-card-section>
      </q-card>
    </draggable>
    <q-btn icon="merge_type" color="blue" @click="combine" />
    <q-btn icon="save" color="blue" @click="rotate" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="blue" @click="addPDF" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'Index',
  components: {
    draggable
  },
  methods: {
    async addPDF () {
      const file = await this.$q.electron.ipcRenderer.invoke('PDF', 'add')
      if (!file.canceled) {
        const name = await this.$q.electron.ipcRenderer.invoke('path', file.filePaths[0])
        this.files.push({
          name: name,
          path: file.filePaths[0],
          angle: 0,
          time: Date.now()
        })
      } else {
        console.log('err')
        this.$q.notify({
          message: 'No file chosen',
          actions: [
            { label: 'Dismiss', color: 'white', handler: () => { } }
          ]
        })
      }
    },
    async combine () {
      const saveDir = await this.$q.electron.ipcRenderer.invoke('PDF', 'combine', { files: this.files })
      if (!saveDir.canceled) {
        this.files = []
      } else {
        this.$q.notify({
          message: 'No save directory chosen',
          actions: [
            { label: 'Dismiss', color: 'white', handler: () => { } }
          ]
        })
      }
    },
    async rotate () {
      const saveDir = await this.$q.electron.ipcRenderer.invoke('PDF', 'rotate', { files: this.files })
      if (!saveDir.canceled) {
        this.files = []
      } else {
        this.$q.notify({
          message: 'No save directory chosen',
          actions: [
            { label: 'Dismiss', color: 'white', handler: () => { } }
          ]
        })
      }
    }
  },
  data () {
    return {
      files: []
    }
  }
}
</script>
