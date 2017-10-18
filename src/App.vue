<template>
  <div id="app">
    <partyHeader></partyHeader>
    <div class="auto">
      <div class="main-content">
        <div class="content">
          <!--<transition>-->
            <router-view></router-view>
          <!--</transition>-->
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
  .fade-enter{
    opacity: 0;
  }
  .fade-leave{
    opacity: 1;
  }
  .fade-enter-active{
    transition: opacity .5s;
    -moz-transition: opacity .5s;
    -webkit-transition: opacity .5s;
    -o-transition: opacity .5s;
  }
  .fade-leave-active{
    opacity:0;
    transition: opacity .5s;
    -moz-transition: opacity .5s;
    -webkit-transition: opacity .5s;
    -o-transition: opacity .5s;
  }
</style>
