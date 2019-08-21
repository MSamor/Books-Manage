<template>
  <div>
    <!--确认删除模态窗模态窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible3" width="30%">
      <span>确认删除此条记录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible3 = false;deletes()">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="bookLogData">
      <el-table-column prop="id" label="编号" width="140"></el-table-column>
      <el-table-column prop="userName" label="借阅人名" width="80"></el-table-column>
      <el-table-column prop="bookName" label="书名" width="200"></el-table-column>
      <el-table-column prop="author" label="作者" width="80"></el-table-column>
      <el-table-column prop="outTime" label="借出时间" width="180"></el-table-column>
      <el-table-column prop="returnTime" label="归还时间" width="180"></el-table-column>
      <el-table-column prop="outTotal" label="借出数量" width="80"></el-table-column>
      <el-table-column prop="returnNumber" label="归还数量" width="80"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">刪除记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="10"
      :current-page.sync="currentPage"
      layout="prev, pager, next,jumper"
      :total="totals"
      @current-change="current_change"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allBookLogData: "",
      currentPage: 0,
      tempData: "",
      bookLogData: [],
      totals: "" || 0,
      dialogFormVisible: false,
      dialogTableVisible2: false,
      dialogVisible3: false
    };
  },

  methods: {
    current_change(val) {
      this.bookLogData = this.allBookLogData.slice((val - 1) * 10, val * 10);
    },
    handleEdit: function(val1, val2) {
      this.dialogVisible3 = true;
      this.tempData = val2.id;
    },
    get: function() {
      var that = this;
      this.$http.get("/api/getLog").then(function(res) {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].bookName = "《" + res.data[i].bookName + "》";
        }
        that.allBookLogData = res.data;
        that.totals = that.allBookLogData.length;
        if (that.currentPage - 1 >= that.allBookLogData.length / 10) {
          that.current_change(that.currentPage - 1);
        } else {
          that.current_change(that.currentPage);
        }
      });
    },
    deletes: function() {
      var that = this;
      this.$http
        .delete(
          "/api/logDelete?id=" +
            that.tempData +
            "&userId=" +
            that.GLOBALDATA.userId +
            "&password=" +
            that.GLOBALDATA.password
        )
        .then(function(res) {
          that.get();
        });
    }
  },
  created: function() {
    this.get();
  }
};
</script>