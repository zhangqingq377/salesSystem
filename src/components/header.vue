<template>
  <div class="header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1"><router-link to="/sales">销售记录</router-link></el-menu-item>
      <el-submenu index="2">
        <template slot="title">产品</template>
        <el-menu-item
          v-for="(product, index) in products"
          :key="product.id"
          :index="'2-'+index">
          <router-link :to="'/production?source='+product.value">{{product.name}}</router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="3"><router-link to="/stocks">进货记录</router-link></el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    props: {
      defaultActive: {
        type: 'String'
      }
    },
    components: {},
    created() {
    },
    data() {
      return {
        activeIndex: '1',
        products: [],
      }
    },
    computed: {},
    watch: {
      defaultActive(val) {
        this.activeIndex = val;
      }
    },
    mounted() {
      if(this.defaultActive) this.activeIndex = this.defaultActive;
      this.obtainSource();
    },
    methods: {
      obtainSource() {
        this.axios.get('/api/products').then(res => {
          this.products = res.data;
        })
      },
    }
  }
</script>
