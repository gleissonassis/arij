<template>
  <div>
    <navbar />
    <div class="container-fluid main-container">
      <router-view />
    </div>
    </div>
</template>

<script>
  import Navbar from './navbar'
  export default {
    name: 'Main',
    components: {
      Navbar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  padding-top: 50px;
}
.main-container {
  padding: 60px 15px;
}
</style>
