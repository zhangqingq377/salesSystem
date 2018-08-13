<template>
  <div class="salesInsert" style="width: 80%;margin: 0 auto">
    <h2>新增</h2>
    <el-form ref="form" :model="form" label-width="80px" v-if="type==='sales'">
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="交易平台" prop="region">
        <el-select v-model="form.platform" placeholder="请选择交易平台">
          <el-option label="咸鱼" value="咸鱼"></el-option>
          <el-option label="线下" value="线下"></el-option>
          <el-option label="转转" value="转转"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微信">
        <el-input v-model="form.wechat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addProduct">添加明细</el-button>
      </el-form-item>

      <template v-for="record in form.list">
        <el-form-item>
          <el-form :inline="true" :model="record" class="">
            <el-form-item label="商品">
              <el-autocomplete
                v-model="record.product"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @focus="autoCompletefocus(record)"
                @select="handleSelect"
                style="width: 300px"
              >
                <template slot-scope="{ item }">
                  {{ item.brandId.productId.name }} : {{ item.brandId.name }} - {{ item.name }}
                </template>
              </el-autocomplete>
              <!--<el-select v-model="record.productId" placeholder="商品">
                <el-option v-for="p in productList"
                           :label="p.brandId.productId.name + ':' + p.brandId.name +'-'+ p.name"
                           :value="p._id"></el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="record.count" placeholder="数量"></el-input>
            </el-form-item>
            <el-form-item label="售价">
              <el-input v-model="record.price" placeholder="售价"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
      </template>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="saveSale">保存</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="80px" v-if="type==='stocks'">
      <el-form-item label="联系人">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addProduct">添加明细</el-button>
      </el-form-item>

      <template v-for="record in form.list">
        <el-form-item>
          <el-form :inline="true" :model="record" class="">
            <el-form-item label="商品">
              <el-autocomplete
                v-model="record.product"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @focus="autoCompletefocus(record)"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  {{ item.brandId.productId.name }} : {{ item.brandId.name }} - {{ item.name }}
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="record.count" placeholder="数量"></el-input>
            </el-form-item>
            <el-form-item label="单价">
              <el-input v-model="record.price" placeholder="单价"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
      </template>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="saveSale">保存</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="productForm" label-width="80px" v-if="type==='production'">
      <el-form-item label="品牌">
        <el-select v-model="productForm.brandId" placeholder="请选择品牌" @change="changeBrand">
          <el-option
            v-for="brand in brandList"
            :label="brand.name"
            :value="brand._id"
            :key="brand._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="productForm.name"></el-input>
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="productForm.stock"></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="productForm.cost"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input v-model="productForm.order"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    created() {
      const _self = this;
      if(_self.type === 'production') {
        _self.getBrandList();
      }else {
        _self.getProductList();
      }
    },
    data() {
      return {
        type: this.$route.query.type,
        productList: [],
        brandList: [],
        curRecord: {},
        form: {
          wechat: '', //微信
          name: '', //姓名
          phone: '', //手机号码
          address: '', //地址
          platform: '', //交易平台
          list: [],
        },
        productForm: {
          brandId: '',
          brand: '',
          name: '',
          stock: '',
          cost: ''
        }
      }
    },
    computed: {},
    watch: {
    },
    mounted() {
    },
    methods: {
      getProductList() {
        this.axios.post('/api/productDetails', {}).then(res => {
          this.productList = res.data;
        })
      },
      getBrandList() {
        this.axios.get('/api/brandDetails').then(res => {
          this.brandList = res.data;
        });
      },
      changeBrand(value) {
        const _self = this;
        for(let brand of _self.brandList) {
          if(brand._id === value) {
            _self.productForm.brand = brand.id;
          }
        }
      },
      querySearch(queryString, cb) {
        let productList = this.productList;
        let results = queryString ? productList.filter(this.createFilter(queryString)) : productList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (product) => {
          return ((product.brandId.productId.name + product.brandId.name + product.name).indexOf(queryString.toLowerCase()) >= 0);
        }
      },
      handleSelect(item) {
        this.curRecord.product = item.brandId.productId.name + ' : ' + item.brandId.name  + ' - ' + item.name;
        this.curRecord.productId = item._id;
      },
      autoCompletefocus(record){
        this.curRecord = record;
      },
      addProduct() {
        this.form.list.unshift({
          product: '',
          productId: '',
          count: '1',
          price: ''
        })
      },
      saveSale() {
        if(this.type === 'sales') {
          this.axios.post('/api/saveSale', {data: this.form}).then(res => {
            if(res.data.code === 0) {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.$router.push({path: '/sales'});
            }
          });
        } else {
          this.axios.post('/api/saveStocks', {data: this.form}).then(res => {
            if(res.data.code === 0) {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.$router.push({path: '/stocks'});
            }
          });
        }

      },
      saveProduct() {
        this.axios.post('/api/saveProduct', {data: this.productForm}).then(res => {
          if(res.data.code === 0) {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.$router.push({path: '/production'});
          }
        });
      }
    }
  }
</script>
