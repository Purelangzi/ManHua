<template>
  <div class="commend">
     <commendCartoon :cartoonData="cartoonData" @getMore="getMore"/>
     <commendImg :link="link"/>
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
        link:[
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/8f5ceed4-0efb-46b8-9229-df80fffc85af.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/49325aea-ad84-4285-9c35-daafd44178cd.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/31093619-6206-4bc9-b4c6-fd3ac3ba85e1.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/9ef0b915-b978-4128-a9aa-0cec6bab8c2f.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/47e10151-4188-46d6-a41d-77205fa4c579.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/b0c70283-01d1-47fe-b395-cde775f1b7da.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/88c2f16d-cdff-44f5-ad54-cfa5820b1df3.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/cc869f65-5ef1-4c04-9feb-0c80d1d85d9f.jpg',
        'https://mp-3e2d62ab-fc55-4b79-a8d7-5adf2667014f.cdn.bspapp.com/cloudstorage/06db246f-7602-4454-9d0e-4f660e13f4d8.jpg'
        ]
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
