<template>
  <div class="userDetail">
    <div class="userImg">
        <img :src="userInfo&&userInfo.avatar?userInfo.avatar:defaultUserimg">
    </div>
     <div class="userInfo">
        <h3>欢迎{{ userInfo&&userInfo.username }},请开始你的工作吧！</h3>
     </div>
  </div>
</template>

<script>
import defaultUserimg from '@/assets/images/defaultUserImg.png'
export default {
  props:{
    userInfo:{
        type:Object,
        require:true
    }
  },
  name: 'userDetail',
  data () {
    return {
        defaultUserimg
    }
  },
  
  mounted() {
    
  },
  methods: {
    
  },
}
</script>

<style lang='scss' scoped>
.userDetail{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0d4d4;
    .userImg{
        img{
            width: 90px;
            height: 90px;
            border-radius: 50%;
        }
    }
    .userInfo{
        font: 16px;
        color: darkgrey;
        margin-left: 10px;
    }
}

</style>
