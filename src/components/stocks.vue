<template>
  <div class="sales">
    <div class="search-query">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formInline.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="obtainStocksList">查询</el-button>
          <router-link to="/insert?type=stocks"><el-button type="primary">新增</el-button></router-link>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-result">
      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
        <table class="el-table__body" style="width: 100%;border-spacing: 0;">
          <tr class="el-table__row">
            <th rowspan="2" width="80">姓名</th>
            <th rowspan="2" width="140">电话号码</th>
            <th colspan="3" width="580">明细</th>
            <th rowspan="2" width="140">总金额</th>
            <th rowspan="2" width="200">日期</th>
            <th rowspan="2" width="150">操作</th>
          </tr>
          <tr class="el-table__row">
            <th>商品</th>
            <th width="80">数量</th>
            <th width="100">单价</th>
          </tr>

          <template v-for="stock in stocksList">
            <tr class="el-table__row">
              <td :rowspan="stock.records.length > 0 ? stock.records.length : 1" width="80">{{stock.name}}</td>
              <td :rowspan="stock.records.length ? stock.records.length : 1" width="140">{{stock.phone}}</td>
              <td>{{stock.records.length > 0 ? stock.records[0].productId.brandId.productId.name + ' : ' + stock.records[0].productId.brandId.name + ' - ' + stock.records[0].productId.name : ''}}</td>
              <td>{{stock.records.length > 0 ? stock.records[0].count : ''}}</td>
              <td>{{stock.records.length > 0 ? stock.records[0].price : ''}}</td>
              <td :rowspan="stock.records.length ? stock.records.length : 1" width="140">{{stock.total}}</td>
              <td :rowspan="stock.records.length ? stock.records.length : 1" width="140">{{stock.time}}</td>
              <td :rowspan="stock.records.length ? stock.records.length : 1">
                <el-button
                  size="mini"
                  @click="handleEdit(stock)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(stock)">删除</el-button>
              </td>
            </tr>
            <tr class="el-table__row" v-for="(record, index) in stock.records" v-if="index != 0">
              <td>{{record.productId.brandId.productId.name + ' : ' + record.productId.brandId.name + ' - ' + record.productId.name}}</td>
              <td>{{record.count}}</td>
              <td>{{record.price}}</td>
            </tr>
          </template>

        </table>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Sales',
  data () {
    return {
      stocksList: [],
      page: {
        size: 50,
        page: 1
      },
      formInline: {
        name: '', //姓名
        phone: '', //手机号码
      },
    }
  },
  mounted() {
    this.obtainStocksList();
  },
  methods: {
    obtainStocksList() {
      const _self = this;
      let data = {
        query: _self.formInline,
        page: _self.page
      };
      _self.axios.post('/api/stocks', {data: data}).then(res => {
        if(res.data.code === 0) {
          _self.stocksList = res.data.stocksList;
          _self.page = res.data.page;
        }else {
          _self.$message({
            type: 'error',
            message: '获取进货记录失败'
          });
        }

      });
    },
    handleEdit(stock){
      this.$router.push({path: '/update', query: {id: stock._id, type: 'stocks'}});
    },
    handleDelete(stock) {
      const _self = this;
      _self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.axios.post('/api/deleteStock', {data: {id: stock._id}}).then(res => {
          if(res.data.code === 0) {
            _self.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else {
            _self.$message({
              type: 'error',
              message: res.data.message
            });
          }
          _self.obtainStocksList();
        });

      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
}
</script>

<style lang="less">
  .sales {
    .search-query {
      margin-top: 22px;
      padding: 0 20px;
    }
    .search-result {
      padding: 0 20px;
      .el-table {
        .el-table__body {
          .el-table__row {
            th, td {
              text-indent: 10px;
            }
            th {
              color: #909399;
            }
          }

        }
      }
    }
  }
</style>
