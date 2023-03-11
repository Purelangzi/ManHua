<template>
  <div class="dashboard-container">
    <el-row>
      <el-col><userDetail :userInfo="userInfo"></userDetail></el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><commend></commend></el-col>
    </el-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import userDetail from './userDetail/'
import commend from './commend'
export default {
  name: 'home',
  components:{userDetail,commend},
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    background-color: #fff;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
