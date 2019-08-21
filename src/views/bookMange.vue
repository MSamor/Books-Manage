<template>
  <div>
    <el-button @click="dialogFormVisible = true" type="primary" icon="el-icon-circle-plus">添加借阅记录</el-button>
    <el-button @click="reLoding" type="primary" icon>刷新</el-button>
    <!--编辑加模态窗 -->
    <el-dialog title="编辑" :visible.sync="dialogTableVisible2">
      <el-form>
        <el-form-item label="归还数量">
          <el-input
            v-model="item"
            autocomplete="off"
            type="number"
            oninput="if(value.length>3)value=value.slice(0,3)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="addReturnLog()">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加借阅记录 -->
    <el-dialog title="借阅信息" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="tempBookManageData.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书名" :label-width="formLabelWidth">
          <el-input v-model="tempBookManageData.bookName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth">
          <el-input v-model="tempBookManageData.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input
            v-model="tempBookManageData.number"
            autocomplete="off"
            type="number"
            oninput="if(value.length>3)value=value.slice(0,3)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMangeLog()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="bookManageData">
      <el-table-column prop="id" label="编号" width="140"></el-table-column>
      <el-table-column prop="userName" label="借阅人名" width="80"></el-table-column>
      <el-table-column prop="bookName" label="书名" width="180"></el-table-column>
      <el-table-column prop="author" label="作者" width="150"></el-table-column>
      <el-table-column prop="outTime" label="借出时间" width="180"></el-table-column>
      <el-table-column prop="returnTime" label="归还时间" width="180"></el-table-column>
      <el-table-column prop="outTotal" label="借出数量" width="80"></el-table-column>
      <el-table-column prop="returnNumber" label="归还数量" width="80"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">添加归还记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="10"
      :current-page.sync="currentPage"
      layout="prev, pager, next ,jumper"
      :total="totals"
      @current-change="current_change"
    ></el-pagination>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      tempBookManageData: {
        userName: "",
        bookName: "",
        author: "",
        number: ""
      },
      bookManageData: [],
      outItem: "", //总数
      item: "", //本
      returnNumbers: "",
      formLabelWidth: "50px",
      allTableData: [],
      tempData: "",
      totals: "" || 0,
      currentPage: 0,
      dialogFormVisible: false,
      dialogTableVisible2: false,
      dialogVisible3: false
    };
  },

  methods: {
    reLoding: function() {
      this.get();
      this.$message({
        message: "已刷新",
        type: "success"
      });
    },
    current_change: function(val) {
      this.bookManageData = this.allTableData.slice((val - 1) * 10, val * 10);
    },
    handleEdit: function(val, val2) {
      this.dialogTableVisible2 = true;
      this.tempData = val2.id;
      this.outItem = val2.outTotal;
      this.item = "";
      this.returnNumbers = val2.returnNumber;
      console.log(this.returnNumbers);
    },
    handleDelete: function() {
      this.dialogVisible3 = true;
    },
    addReturnLog: function() {
      var that = this;
      if (
        this.outItem < this.item * 1 + this.returnNumbers ||
        this.item == ""
      ) {
        this.$message.error("归还数量不能为空或小于借阅总数");
      } else {
        this.dialogTableVisible2 = false;
        this.$http
          .post(
            "/api/updateManage?id=" +
              that.tempData +
              "&item=" +
              (that.item * 1 + that.returnNumbers) +
              "&userId=" +
              that.GLOBALDATA.userId +
              "&password=" +
              that.GLOBALDATA.password
          )
          .then(function(res) {
            if (res.data == "ok") {
              that.get();
              that.item = "";
              this.$message({
                message: "修改成功",
                type: "success"
              });
            }
          });
      }
    },

    addMangeLog: function() {
      var that = this;
      if (
        this.tempBookManageData.userName == "" ||
        this.tempBookManageData.bookName == "" ||
        this.tempBookManageData.author == "" ||
        this.tempBookManageData.number == "" ||
        this.tempBookManageData == ""
      ) {
        this.$message({
          message: "输入框不能为空！",
          type: "warning"
        });
      } else {
        this.$http
          .post(
            "/api/addManage",
            qs.stringify({
              userName: that.tempBookManageData.userName,
              bookName: that.tempBookManageData.bookName,
              author: that.tempBookManageData.author,
              number: that.tempBookManageData.number,
              userId: that.GLOBALDATA.userId,
              password: that.GLOBALDATA.password
            })
          )
          .then(function(res) {
            console.log(res);
            if (res.data == "ok") {
              that.clear();
              that.get();
              that.dialogFormVisible = false;
              that.$message({
                message: "信息添加成功",
                type: "success"
              });
            }
          });
      }
    },
    clear: function() {
      (this.tempBookManageData.userName = ""),
        (this.tempBookManageData.bookName = ""),
        (this.tempBookManageData.author = ""),
        (this.tempBookManageData.number = "");
    },
    get: function() {
      var that = this;
      this.$http.get("/api/getUserLog").then(function(res) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].bookName = "《" + res.data[i].bookName + "》";
        }
        that.allTableData = res.data;
        that.totals = that.allTableData.length;
        if (that.currentPage - 1 >= that.allTableData.length / 10) {
          that.current_change(that.currentPage - 1);
        } else {
          that.current_change(that.currentPage);
        }
      });
    }
  },
  created: function() {
    this.get();
  }
};
</script>