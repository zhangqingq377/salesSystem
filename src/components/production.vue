<template>
  <div class="production">
    <h2></h2>
    <template>
      <el-table
        :data="details"
        border
        style="width: 100%">
        <el-table-column
          prop="brandId.name"
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="name"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存">
        </el-table-column>
        <el-table-column
          prop="cost"
          label="单价">
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    created() {
      const _self = this;
      _self.source = _self.$route.query.source;
    },
    data() {
      return {
        source: '',
        details: [],
      }
    },
    computed: {},
    watch: {
      '$route.query': function(val){
        if(val.hasOwnProperty('source')){
          this.source = val.source;
        }else {
          this.source = '';
        }
      },
      'source': function (val) {
        this.getProductionList(val);
      }
    },
    mounted() {
    },
    methods: {
      getProductionList(source) {
        const _self = this;
        if(!source) source = _self.source;
        _self.axios.post('/api/productDetails', {name: source}).then(res => {
          _self.details = res.data;
        })
      },
    }
  }
</script>

<style lang="less">
  .production {
    margin: 0 20px 20px;
  }
</style>
