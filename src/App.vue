<template>
  <div id="app">
    <partyHeader></partyHeader>
    <div class="auto">
      <div class="main-content">
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <partyFooter></partyFooter>
  </div>
</template>

<script>
import partyHeader from './components/Header.vue'
import partyFooter from './components/Footer.vue'
export default {
  name: 'app',
  components: { partyHeader , partyFooter }
}
</script>

<style>

</style>
