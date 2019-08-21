<template>
  <div class="big">
    <div class="auto">
      <div class="filter"></div>
      <div class="title">图书管理系统登陆</div>
      <form>
        <input class="inp-text" type="text" v-model="user" placeholder="账号" />
        <br />
        <input class="inp-password" type="password" v-model="password" placeholder="密码" />
        <br />
        <input class="inp-btn" type="button" @click="login()" value="登陆" />
      </form>
    </div>
    <div class="footer">Copyright @  2019 貌似 图书管理系统2.0</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: "",
      password: ""
    };
  },
  methods: {
    login() {
      this.GLOBALDATA.userId = this.user;
      this.GLOBALDATA.password = this.password;
      this.$http
        .get("/api/users?userId=" + this.user + "&password=" + this.password)
        .then(res => {
          if (res.data == "true") {
            this.$router.push({
              path: "/book/bookSearch"
            });
          } else {
                this.$alert('账号或密码错误！', '提示' )
          }
        });
    }
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.big {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(../assets/bg.jpg);
  background-size: 100% 100%;
}
.big {
  display: flex;
  justify-content: center;
  align-items: center;
}
.auto {
  text-align: center;
  width: 350px;
  height: 300px;
  position: relative;
  z-index: 1;
}
.filter {
  background-color: rgba(88, 192, 218, 0.7);
  border-radius: 10px;
  filter: blur(2px);
  position: absolute;
  width: 350px;
  height: 300px;
  z-index: -1;
}
.inp-text {
  height: 35px;
  margin-bottom: 30px;
  width: 300px;
  font-size: 20px;
  border: none;
  outline: none;
  opacity: 0.5;
  padding-left: 10px;
  border-bottom: 2px solid rgb(235, 255, 58);
}
.inp-password {
  height: 35px;
  width: 300px;
  margin-bottom: 30px;
  font-size: 20px;
  border: none;
  outline: none;
  opacity: 0.5;
  padding-left: 10px;
  border-bottom: 2px solid rgb(251, 255, 35);
}
.inp-btn {
  width: 80px;
  height: 40px;
  background-color: rgb(228, 228, 228);
  border-radius: 5px;
  border: none;
  transition: all .5s;
}
.inp-btn:hover {
  background-color: rgb(176, 255, 176);
}
.title {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: left;
  margin-left: 20px;
  color: white;
  font-size: 25px;
}
.footer {
  position: absolute;
  color: rgb(255, 255, 255);
  bottom: 20px;
  widows: 100%;
  line-height: 50px;
  font-size: 18px;
}
</style>