<template>
  <div>
    <!-- 添加模态窗 -->
    <el-button
      @click="dialogTableVisible = true;clear()"
      type="primary"
      icon="el-icon-circle-plus"
    >添加</el-button>
    <el-button @click="reLoding" type="primary" icon>刷新</el-button>

    <el-input
      placeholder="请输入书名进行搜索..."
      v-model="input3"
      class="input-with-select"
      style="width:500px; margin-left:100px;"
    >
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-dialog title="添加" :visible.sync="dialogTableVisible">
      <el-form :model="tempData">
        <el-form-item label="书籍名称" :label-width="formLabelWidth">
          <el-input v-model="tempData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书籍条码" :label-width="formLabelWidth">
          <el-input v-model="tempData.barCode" autocomplete="off" type="number" oninput="if(value.length>15)value=value.slice(0,15)"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth">
          <el-input v-model="tempData.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社" :label-width="formLabelWidth">
          <el-input v-model="tempData.publishingHouse" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input
            v-model="tempData.number"
            autocomplete="off"
            type="number"
            oninput="if(value.length>3)value=value.slice(0,3)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑加模态窗 -->
    <el-dialog title="编辑" :visible.sync="dialogTableVisible2">
      <el-form :model="tempData">
        <el-form-item label="书籍名称" :label-width="formLabelWidth">
          <el-input v-model="tempData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth">
          <el-input v-model="tempData.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="条码" :label-width="formLabelWidth">
          <el-input v-model="tempData.barCode" autocomplete="off" type="number" oninput="if(value.length>15)value=value.slice(0,15)"></el-input>
        </el-form-item>
        <el-form-item label="出版社" :label-width="formLabelWidth">
          <el-input v-model="tempData.publishingHouse" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input
            v-model="tempData.number"
            autocomplete="off"
            oninput="if(value.length>3)value=value.slice(0,3)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible2 = false;clear()">取 消</el-button>
        <el-button type="primary" @click="update1()">确 定</el-button>
      </div>
    </el-dialog>
    <!--确认删除模态窗模态窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible3" width="30%">
      <span>确认删除这条信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="delete1()">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="tableData">
      <el-table-column prop="id" label="编号" width="140"></el-table-column>
      <el-table-column prop="name" label="书名" width="180"></el-table-column>
      <el-table-column prop="author" label="作者" width="80"></el-table-column>
      <el-table-column prop="barCode" label="条码" width="150"></el-table-column>
      <el-table-column prop="publishingHouse" label="出版社" width="180"></el-table-column>
      <el-table-column prop="number" label="数量" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="10"
      :current-page.sync="currentPage"
      layout="prev, pager, next,jumper"
      :total="totals"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      tempData: {
        id: "",
        name: "",
        author: "",
        barCode: "",
        publishingHouse: "",
        number: ""
      },
      currentPage: 1,
      input3: "",
      tempId: "",
      tableData: [],
      allTableData: [],
      totals: "" || 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogTableVisible2: false,
      dialogVisible3: false
    };
  },

  methods: {
    handleCurrentChange(val) {
      this.tableData = this.allTableData.slice((val - 1) * 10, val * 10);
    },
    search: function() {
      var that = this;
      this.$http.get("/api/search?name=" + this.input3).then(function(res) {
        that.tableData = res.data.results;
        that.totals = that.tableData.length;
      });
    },
    reLoding: function() {
      this.get();
      this.$message({
        message: "已刷新",
        type: "success"
      });
    },
    handleEdit: function(val1, val2) {
      this.dialogTableVisible2 = true;
      this.tempData = JSON.parse(JSON.stringify(val2));
      this.tempData.name = this.tempData.name.substring(1,this.tempData.name.length-1);
      this.tempId = val2.id;
    },
    update1: function() {
      if (
        this.tempData.name == "" ||
        this.tempData.author == "" ||
        this.tempData.barCode == "" ||
        this.tempData.publishingHouse == "" ||
        (this.tempData.number == "" || this.tempData.number <= 0)
      ) {
        this.$message({
          message: "输入框不能为空！不能为非法数字",
          type: "warning"
        });
      } else {
        var that = this;
        this.$http
          .post(
            "/api/update",
            qs.stringify({
              id: that.tempData.id,
              name: that.tempData.name,
              author: that.tempData.author,
              barCode: that.tempData.barCode,
              publishingHouse: that.tempData.publishingHouse,
              number: that.tempData.number,
              userId:that.GLOBALDATA.userId,
              password:that.GLOBALDATA.password
            })
          )
          .then(function(res) {
            if(res.data == 'ok'){
              that.clear();
              that.get();
              that.dialogTableVisible2 = false;
              that.$message({
                message: "修改信息成功",
                type: "success"
            });
            }
          });
      }
    },
    handleDelete: function(val1, val2) {
      this.dialogVisible3 = true;
      this.tempId = val2.id;
    },
    delete1: function() {
      var that = this;
      this.$http.delete("api/delete?id=" + this.tempId + '&userId='+this.GLOBALDATA.userId + '&password='+this.GLOBALDATA.password)
      .then(function(res) {
        if(res.data == 'ok'){
          that.get();
          that.dialogVisible3 = false;
          that.$message({
          message: "删除成功",
          type: "success"
        });
        }
      });
    },
    get: function() {
      var that = this;
      this.$http.get("/api/getBooks").then(function(res) {
        that.allTableData = res.data.results;
        for (var i = 0; i < res.data.results.length; i++) {
          res.data.results[i].name = "《" + res.data.results[i].name + "》";
        }
        that.totals = that.allTableData.length;
        if (that.currentPage - 1 >= that.allTableData.length / 10) {
          that.handleCurrentChange(that.currentPage - 1);
        } else {
          that.handleCurrentChange(that.currentPage);
        }
      });
    },

    add: function() {
      var that = this;
      if (
        that.tempData.name == "" ||
        that.tempData.author == "" ||
        that.tempData.barCode == "" ||
        that.tempData.publishingHouse == "" ||
        that.tempData.number == ""
      ) {
        this.$message({
          message: "输入框不能为空！",
          type: "warning"
        });
      } else {
        this.$http
          .post(
            "/api/addBook",
            qs.stringify({
              name: that.tempData.name,
              author: that.tempData.author,
              barCode: that.tempData.barCode,
              publishingHouse: that.tempData.publishingHouse,
              number: that.tempData.number,
              userId:that.GLOBALDATA.userId,
              password:that.GLOBALDATA.password
            })
          )
          .then(function(res) {
            console.log(res);
            console.log(that.GLOBALDATA.password)
            if(res.data == 'ok'){
              that.dialogTableVisible = false;
              that.clear();
              that.get();
              that.$message({
                message: "添加成功",
                type: "success"
              });
            }
          });
      }
    },

    clear: function() {
      (this.tempData.name = ""),
        (this.tempData.author = ""),
        (this.tempData.barCode = ""),
        (this.tempData.publishingHouse = ""),
        (this.tempData.number = "");
    }
  },

  created: function() {
    console.log(this.GLOBALDATA.userId)
    this.get();
  }
};
</script>