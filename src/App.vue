<template>
  <div id="app">
    <nav-header></nav-header>
    <router-view/>
  </div>
</template>

<script>
  import navHeader from './components/header'
  export default {
    name: 'App',
    components: {navHeader},
  }
</script>
<style lang="less">
  @import 'assets/css/index.less';
  #app{
    height: 100%;
  }
</style>
