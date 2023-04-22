<template>
  <div class="commend">
     <commendCartoon :cartoonData="cartoonData" ref="commendCartoon" @getMore="getMore"/>
     <commendImg/>
  </div>
</template>

<script>
import commendCartoon from './commendCartoon/'
import commendImg from './commendImg'
export default {
  name: 'commend',
  components:{commendCartoon,commendImg},
  data () {
    return {
        page:'',
        pageSize:9,
        cartoonData:[],
    }
  },
  created() {
    this.getCommendData()
  },
  methods: {
    async getCommendData(){
      this.page = Math.floor(Math.random()*69)+1
      const {page,pageSize} = this
      const {data} = await this.$API.home.getCartoonList({page,pageSize})
      data.data.forEach(el=>{
        // 2022-10-26T17:23:34.000Z
        let strC = el.create_time?.replace('T',' ')
        let strU = el.update_time?.replace('T',' ')
        el.create_time = strC?.replace('.000Z','')
        el.update_time =strU?.replace('.000Z','')
      })
      this.cartoonData = data.data
      this.$refs.commendCartoon.loading=false
    },
    getMore(){
      this.getCommendData()
    }
  },
}
</script>

<style lang='scss' scoped>
.commend{
    display: flex;
    margin-top: 10px;
    ::v-deep .el-card__header{
      padding: 10px 20px;
    }
}
</style>
