<template>
  <div id="app">
    <notifications />
    <master />
  </div>
</template>

<script>
  import master from './components/master'
  export default {
    name: 'app',
    components: {
      master
    }
  }
</script>
<style scoped>
.notifications{
	position: fixed;
	right: 30px;
	top: 60px !important;
	width: 25%;
	min-width: 240px;
	max-width: 480px;
  z-index: 10000;
}
</style>
