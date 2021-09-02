<!--
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2020-04-16 14:41:25
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2020-04-16 15:46:29
 -->
<template>
  <div class="home">
    <img alt="Vue logo" class="logo" src="../assets/logo.png">
    <goods></goods>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import goods from '@/components/goods.vue';

export default {
  name: 'Home',
  components: {
    goods
  },
};
</script>
<style scoped>
  .logo{
    position:absolute;top:15px; left:15px; width: 70px;
  }
</style>
