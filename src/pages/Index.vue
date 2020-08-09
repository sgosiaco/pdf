<template>
  <q-page class="flex flex-center">
    <draggable :list="files">
      <div v-for="file in files" :key="file"> {{ file }} </div>
    </draggable>
    <q-btn icon="save" color="blue" @click="combine" />
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
        this.files.push(file.filePaths[0])
      } else {
        console.log('No file chosen')
      }
    },
    async combine () {
      const saveDir = await this.$q.electron.ipcRenderer.invoke('PDF', 'combine', { files: this.files })
      if (!saveDir.canceled) {
        this.files = []
      } else {
        console.log('No save dir chosen')
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
