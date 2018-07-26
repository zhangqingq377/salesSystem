<template>
  <div class="sales">
    <div class="search-query">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="formInline.phone" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="formInline.address" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="交易平台">
          <el-select v-model="formInline.platform" placeholder="请选择交易平台">
            <el-option label="咸鱼" value="咸鱼"></el-option>
            <el-option label="线下" value="线下"></el-option>
            <el-option label="转转" value="转转"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="formInline.wechat" placeholder="微信"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="obtainSaleList">查询</el-button>
          <el-button type="primary"><router-link to="/insert?type=sales">新增</router-link></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-result">
      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
        <table class="el-table__body" style="width: 100%;border-spacing: 0;">
          <tr class="el-table__row">
            <th rowspan="2" width="80">姓名</th>
            <th rowspan="2" width="140">电话号码</th>
            <th rowspan="2">地址</th>
            <th rowspan="2" width="80">交易平台</th>
            <th rowspan="2" width="140">微信</th>
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

          <template v-for="sale in salesList">
            <tr class="el-table__row">
              <td :rowspan="sale.records.length > 0 ? sale.records.length : 1" width="80">{{sale.name}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1" width="140">{{sale.phone}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1">{{sale.address}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1" width="80">{{sale.platform}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1" width="140">{{sale.wechat}}</td>
              <td>{{sale.records.length > 0 ? sale.records[0].productId.brandId.productId.name + ' : ' + sale.records[0].productId.brandId.name + ' - ' + sale.records[0].productId.name : ''}}</td>
              <td>{{sale.records.length > 0 ? sale.records[0].count : ''}}</td>
              <td>{{sale.records.length > 0 ? sale.records[0].price : ''}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1" width="140">{{sale.total}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1" width="140">{{sale.time}}</td>
              <td :rowspan="sale.records.length ? sale.records.length : 1">
                <el-button
                  size="mini"
                  @click="handleEdit(sale)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(sale)">删除</el-button>
              </td>
            </tr>
            <tr class="el-table__row" v-for="(record, index) in sale.records" v-if="index != 0">
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
      salesList: [],
      page: {
        size: 50,
        page: 1
      },
      formInline: {
        wechat: '', //微信
        name: '', //姓名
        phone: '', //手机号码
        address: '', //地址
        platform: '', //交易平台
      },
    }
  },
  mounted() {
    this.obtainSaleList();
  },
  methods: {
    obtainSaleList() {
      const _self = this;
      let data = {
        query: _self.formInline,
        page: _self.page
      }
      _self.axios.post('/api/sales', {data: data}).then(res => {
        if(res.data.code === 0) {
          _self.salesList = res.data.salesList;
          _self.page = res.data.page;
        }else {
          _self.$message({
            type: 'error',
            message: '获取销售记录失败'
          });
        }

      });
    },
    handleEdit(sale){
      this.$router.push({path: '/update', query: {id: sale._id, type: 'sales'}});
    },
    handleDelete(sale) {
      const _self = this;
      _self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.axios.post('/api/deleteSale', {data: {id: sale._id}}).then(res => {
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
          _self.obtainSaleList();
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
