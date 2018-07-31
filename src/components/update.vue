<template>
  <div class="salesInsert" style="width: 80%;margin: 0 auto">
    <h2>编辑</h2>
    <el-form ref="form" :model="form" label-width="80px" v-if="type==='sales'">
      <el-form-item label="姓名">
        <el-input v-model="form.name" :placeholder="defaultForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone" :placeholder="defaultForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" :placeholder="defaultForm.address"></el-input>
      </el-form-item>
      <el-form-item label="交易平台" prop="region">
        <el-select v-model="form.platform" :placeholder="defaultForm.platform">
          <el-option label="咸鱼" value="咸鱼"></el-option>
          <el-option label="线下" value="线下"></el-option>
          <el-option label="转转" value="转转"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微信">
        <el-input v-model="form.wechat" :placeholder="defaultForm.wechat"></el-input>
      </el-form-item>
      <el-form-item label="总金额">
        <el-input v-model="form.total" :placeholder="defaultForm.total"></el-input>
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
        <el-input v-model="form.name" :placeholder="defaultForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" :placeholder="defaultForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="总金额">
        <el-input v-model="form.total" :placeholder="defaultForm.total"></el-input>
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
    <el-form ref="form" :model="form" label-width="80px" v-if="type==='production'">
      <el-form-item label="品牌">
        <el-select v-model="productForm.brandId" :placeholder="defaultProductForm.brandId" @change="changeBrand">
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
        <el-input v-model="productForm.name" :placeholder="defaultProductForm.name"></el-input>
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="productForm.stock" :placeholder="defaultProductForm.stock"></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="productForm.cost" :placeholder="defaultProductForm.cost"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input v-model="productForm.order" :placeholder="defaultProductForm.order"></el-input>
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
      _self.getProductList();
      if(_self.type === 'sales') {
        _self.getSaleMessage();
      } else if(_self.type === 'stocks') {
        _self.getStockMessage();
      } else if(_self.type === 'production') {
        _self.getProductMessage();
        _self.getBrandList()
      }

    },
    data() {
      return {
        type: this.$route.query.type,
        productList: [],
        brandList: [],
        curRecord: {},
        form: {
          _id: '', //id值
          wechat: '', //微信
          name: '', //姓名
          phone: '', //手机号码
          address: '', //地址
          platform: '', //交易平台
          total: '',//总金额
          list: [],
        },
        defaultForm: {
          _id: '', //id值
          wechat: '', //微信
          name: '', //姓名
          phone: '', //手机号码
          address: '', //地址
          platform: '', //交易平台
          total: '',//总金额
          list: [],
        },
        productForm: {
          brandId: '',
          brand: '',
          name: '',
          stock: '',
          cost: ''
        },
        defaultProductForm: {
          _id: '',
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
      getSaleMessage() {
        const _self = this;
        _self.axios.post('/api/saleMessage', {data: {id: _self.$route.query.id}}).then(res => {
          if(res.data.code === 0) {
            _self.defaultForm = res.data.data;
            let list = [];
            for(let record of _self.defaultForm.list) {
              list.push({
                _id: record._id,
                product: record.productId.brandId.productId.name + ' : ' + record.productId.brandId.name + ' - ' + record.productId.name,
                productId: record.productId._id,
                count: record.count,
                price: record.price
              });
            }
            _self.defaultForm.list = JSON.parse(JSON.stringify(list));
            _self.form.list = list;
          }else {
            _self.$message({
              type: 'error',
              message: res.data.message
            })
          }
        });
      },
      getStockMessage() {
        const _self = this;
        _self.axios.post('/api/stockMessage', {data: {id: _self.$route.query.id}}).then(res => {
          if(res.data.code === 0) {
            _self.defaultForm = res.data.data;
            let list = [];
            for(let record of _self.defaultForm.list) {
              list.push({
                _id: record._id,
                product: record.productId.brandId.productId.name + ' : ' + record.productId.brandId.name + ' - ' + record.productId.name,
                productId: record.productId._id,
                count: record.count,
                price: record.price
              });
            }
            _self.defaultForm.list = JSON.parse(JSON.stringify(list));
            _self.form.list = list;
          }else {
            _self.$message({
              type: 'error',
              message: res.data.message
            })
          }
        });
      },
      getProductMessage() {
        const _self = this;
        _self.axios.post('/api/productMessage', {data: {id: _self.$route.query.id}}).then(res => {
          if(res.data.code === 0) {
            let result = res.data.data[0];
            result.brandId = result.brandId.name;
            _self.defaultProductForm = result;
          }
        });
      },

      changeBrand(value){
        const _self = this;
        for(let brand of _self.brandList) {
          if(brand._id === value) {
            _self.productForm.brand = brand.id;
          }
        }
      },
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
          count: '',
          price: ''
        })
      },
      saveSale() {
        const _self = this;
        let changequery = {
          _id: _self.defaultForm._id
        };
        for(let key in _self.form) {
          if(key === 'list') {
            let list = _self.form.list;
            changequery.list = [];
            for(let record of list) {
              if (record._id) {
                //和原数据做比对
                for(let old of _self.defaultForm.list) {
                  if(old._id === record._id) {
                    let obj = {_id: record._id};
                    let changeFlag = false
                    if(old.productId != record.productId) {
                      obj.productId = record.productId;
                      changeFlag = true;
                    }
                    if(old.count != record.count) {
                      obj.count = record.count;
                      changeFlag = true;
                    }
                    if(old.price != record.price) {
                      obj.price = record.price;
                      changeFlag = true;
                    }
                    if(changeFlag) changequery.list.push(obj);
                    break;
                  }
                }
              }else changequery.list.push(record);
            }
          } else if(_self.form[key]) changequery[key] = _self.form[key];
        }
        let url = ''
        if(_self.type === 'sales') url = '/api/saveSale';
        else if(_self.type === 'stocks') url = '/api/saveStocks';
        this.axios.post(url, {data: changequery}).then(res => {
          if(res.data.code === 0) {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.$router.push({path: '/' + _self.type});
          }else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        });
      },
      saveProduct() {
        const _self = this;
        let changequery = {
          _id: _self.defaultProductForm._id
        };
        for(let key in _self.productForm) {
          if(_self.productForm[key]) changequery[key] = _self.productForm[key];
        }

        this.axios.post('/api/saveProduct', {data: changequery}).then(res => {
          if(res.data.code === 0) {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.$router.push({path: '/' + _self.type});
          }else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        });
      },
    }
  }
</script>
