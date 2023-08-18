<template>
  <div class="commendImg">
    <el-card>
      <div slot="header">
        <span>推荐</span>
        <el-button type="text" style="float: right;margin-right: 10px;">更多</el-button>
      </div>
      <div class="commendAvatar">

        <el-card v-for="item in links" :key="item" shadow="hover">
          <el-avatar :size="90" shape="circle" :src="item" fit="fill">
            <img :src="require('@/assets/images/defaultUserImg.png')">
          </el-avatar>
        </el-card>
      </div>
    </el-card>
  </div>

</template>

<script>
export default {
  name: 'CommendImg',
  data() {
    return {
      links:[
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042922165936346.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042922165936346.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042922165936346.jpeg',
        'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.commendImg{
  width: 30%;
  ::v-deep .el-card__header{
     div{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  ::v-deep .el-card__body{
    padding: 0;
  }
  .commendAvatar{
    display: flex;
    flex-wrap: wrap;
    .el-card{
      width: 33.3%;
      display: flex;
      justify-content: center;
      padding: 24px;
    }
  }
}
</style>
