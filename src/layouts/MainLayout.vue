<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Toolbar :title=title></Toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Toolbar from 'components/Toolbar.vue'

export default {
  name: 'MainLayout',
  components: { Toolbar },
  data () {
    return {
      title: 'PDF Utility'
    }
  }
}
</script>
