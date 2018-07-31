<template>
  <div class="production">
    <h2></h2>
    <div class="search-query">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="产品">
          <el-select v-model="formInline.product" placeholder="请选择产品" @change="getProductionList">
            <el-option
              v-for="p in productList"
              :label="p.name"
              :value="p.value"
              :key="p._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="formInline.brandId" placeholder="请选择品牌">
            <el-option
              v-for="brand in brandList"
              :label="brand.name"
              :value="brand._id"
              :key="brand._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="formInline.name" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getProductionList">查询</el-button>
          <router-link to="/insert?type=production"><el-button type="primary">新增</el-button></router-link>
        </el-form-item>
      </el-form>
    </div>
    <template>
      <el-table
        :data="details"
        border
        :summary-method="getSummaries"
        show-summary
        height="100%"
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
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
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
      this.formInline.product = _self.$route.query.source;
      _self.getBrandList();
      _self.getProductList();
      _self.getProductionList();
    },
    data() {
      return {
        formInline: {
          product: '',
          brandId: '',
          name: ''
        },
        productList: [],
        brandList: [],
        details: [],
      }
    },
    computed: {},
    watch: {
      '$route.query': function(val){
        if(val.hasOwnProperty('source')){
          this.formInline.product = val.source;
          this.getProductionList();
        }
      },
    },
    mounted() {
    },
    methods: {
      getProductionList() {
        const _self = this;
        _self.axios.post('/api/productDetails', _self.formInline).then(res => {
          if(res.data) _self.details = res.data;
          else _self.details = [];
        })
      },
      getProductList() {
        this.axios.get('/api/products').then(res => {
          this.productList = res.data;
        });
      },
      getBrandList() {
        this.axios.get('/api/brandDetails').then(res => {
          this.brandList = res.data;
        });
      },
      handleEdit(item) {
        this.$router.push({path: '/update', query: {id: item._id, type: 'production'}});
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if(column.property === 'stock') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 件';
            } else if(column.property === 'cost') {
              let total = 0;
              for(let item of data) {
                total += (item.stock || 0) * (item.cost || 0)
              }
              sums[index] = total + ' 元';
            } else {
              sums[index] = '';
            }

          } else {
            sums[index] = '';
          }
        });

        return sums;
      }
    }
  }
</script>

<style lang="less">
  .production {
    margin: 0 20px 20px;
    height: calc(~"100% - 161px");
  }
</style>
