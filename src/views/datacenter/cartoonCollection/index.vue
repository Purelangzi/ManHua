<template>
  <el-tabs v-model="activeName" class="cartoonCollect">
    <el-tab-pane label="采集漫画信息" name="first">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>商品链接<span style="color: #409eff;">(一行一个,获取漫画详情或章节信息和内容)</span></p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="ctLinkTextarea" :rows="6" resize="none"></el-input>
          </div>
          <div class="link footer">
            <p>范例：<span style="color: red;">漫客栈：https://www.mkzhan.com/216151/</span></p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollectCt" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button v-if="radioCatroonValue==1" type="primary" @click="exportInfo(1)" size="small">导出漫画信息</el-button>
            <el-button v-else type="primary" @click="exportInfo(2)" size="small">导出章节信息</el-button>
            <el-button type="danger " @click="clearList(1)" size="small">清理列表</el-button>
          </div>
          <div class="link">
            <el-button v-if="radioCatroonValue==1" type="danger" @click="addMoreNovelOrCartoon(1)" size="small">一键添加漫画</el-button>
          </div>
          <div class="link radio">
            <el-radio-group v-model="radioCatroonValue" style="margin-top: 15px;">
              <el-radio label="1">漫画详情</el-radio>
              <el-radio label="2">漫画章节</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="logDataCt" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioCatroonValue==1" :data="cartoon.cartoonCtDetail" v-loading="loadingDetail" @selection-change="selectChange"
          border height="calc(100vh - 450px )" style="width:calc(100vw - 100px )" ref="tableCt" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <template  v-for="col in ctDetailColumns">
            <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <div v-if="col.prop == 'cover_lateral'">
                  <el-image :src="row.cover_lateral" fit="fill" style="width: 56px;height: 56px;"></el-image>
                </div>
                <div v-if="col.prop == 'is_vip'">
                  <el-tag  :type="row.is_vip==1?'danger':'success'" effect="dark">{{ row.is_vip==1?'会员':'免费' }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
          </template>
        </el-table>
        <el-table v-else :data="cartoon.cartoonCtChapter" v-loading="loadingChapter" @selection-change="selectChange"
          border height="calc(100vh - 520px )" style="width:calc(100vw - 100px )" ref="tableCt" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pgCartoonParams.pageCt-1)*pgCartoonParams.pageSizeCt+($index+1) }}</span>
            </template>
          </el-table-column>
            <template  v-for="col in ctChapterColumns">
              <el-table-column v-if="col.isSlot"  :label="col.label" align="center" show-overflow-tooltip>
                <template v-slot="{row}">
                  <div v-if="col.prop == 'cover'">
                    <el-image :src="row.cover" fit="fill" style="width: 56px;height: 56px;"></el-image>
                  </div>
                  <div v-if="col.prop == 'is_vip'">
                    <el-tag  :type="row.is_vip==1?'danger':'success'" effect="dark">{{ row.is_vip==1?'收费':'免费' }}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
            </template>
        </el-table>
      </div>
      <el-pagination
        v-if="radioCatroonValue=='2'"
        style="text-align: right;padding: 20px;"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="pgCartoonParams.pageCt"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size="pgCartoonParams.pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="pgCartoonParams.totalNumCt" background>
      </el-pagination>
    </el-tab-pane>

    <el-tab-pane label="采集漫画/小说链接" name="second">
      <div class="collectionLink" style="justify-content: start;">
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollectLink" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button  type="primary" @click="exportLink()" size="small">导出链接</el-button>
            <el-button v-if="radioCtAndCpValue==2" type="warning" @click="addMoreNovelOrCartoon(2)" size="small">一键添加</el-button>
            <el-button v-if="radioCtAndCpValue==3" type="warning" @click="addMoreNovelOrCartoon(3)" size="small">一键添加</el-button>
            <el-button type="danger" @click="clearList(3)" size="small">清理列表</el-button>
          </div>

          <div class="link radio">
            <el-radio-group v-model="radioCtAndCpValue" style="margin-top: 15px;">
              <el-radio label="1">漫画链接</el-radio>
              <el-radio label="2">小说链接</el-radio>
              <el-radio label="3">视频链接</el-radio>
            </el-radio-group>
          </div>
          <div class="link page">
            <span class="label">开始页码：</span>
            <el-input v-model.trim="startPage" style="width: 80px;" clearable></el-input>
            <span class="label">总页码：</span>
            <el-input v-model.trim="endPage" style="width: 80px;" clearable :max="50"></el-input>
          </div>
          <div class="link category" v-if="radioCtAndCpValue==2">
            <span class="label">小说分类</span>
            <el-select v-model="categoryId" class="select" >
              <el-option v-for="item in catrogyData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            
          </div>
        </div>
        <div class="linLog">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="logDataCtAndCp" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioCtAndCpValue==1" :data="link.cartoonCtLink" v-loading="loadingCtLnk" @selection-change="selectChange"
          border height="calc(100vh - 480px )" style="width:calc(100vw - 100px )" size="small" ref="tableLink" class="exportTable">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" width="60" align="center">
            <template v-slot="{$index}">
              <span>{{ (pgCtLinkParams.pageLinkCt-1)*pgCtLinkParams.pageSizeLinkCt+($index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="漫画小说链接" align="center">
            <template v-slot="{row}">
              {{ row.url }}<i class="el-icon-copy-document copy"  @click="copy(row.url)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else-if="radioCtAndCpValue==2" :data="link.novelCtLink" v-loading="loadingCtLnk" @selection-change="selectChange"
          border height="calc(100vh - 510px )" style="width:calc(100vw - 100px )" size="small" ref="tableLink" class="exportTable">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" width="60" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pgCpLinkParams.pageLinkCp-1)*pgCpLinkParams.pageLinkCp+($index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="漫画小说链接" align="center">
            <template v-slot="{row}">
              {{ row.url }}<i class="el-icon-copy-document copy" @click="copyText(row.url)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else="radioCtAndCpValue==3" :data="link.videoCtLink" v-loading="loadingCtLnk" @selection-change="selectChange"
          border height="calc(100vh - 480px )" style="width:calc(100vw - 100px )" size="small" ref="tableLink" class="exportTable">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center"  width="60" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pgVeLinkParams.pageLinkVideo-1)*pgVeLinkParams.pageLinkVideo+($index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="漫画小说链接" align="center">
            <template v-slot="{row}">
              {{ row.url }}<i class="el-icon-copy-document" @click="copyText(row.url)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="radioCtAndCpValue=='1'"
        style="text-align: right;padding: 20px;"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="pgCtLinkParams.pageLinkCt"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size="pgCartoonParams.pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="pgCtLinkParams.totalNumLinkCt" background>
      </el-pagination>
      <el-pagination
        v-if="radioCtAndCpValue=='2'"
        style="text-align: right;padding: 20px;"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="pgCpLinkParams.pageLinkCp"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size="pgCartoonParams.pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="pgCpLinkParams.totalNumLinkCp" background>
      </el-pagination>
      <el-pagination
        v-if="radioCtAndCpValue=='3'"
        style="text-align: right;padding: 20px;"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="pgVeLinkParams.pageLinkVideo"
        :page-sizes="[10,20, 40, 80, 100]"
        :page-size="pgCartoonParams.pageSizeLinkVideo"
        layout="sizes, prev, pager, next, jumper, total"
        :total="pgCartoonParams.totalNumLinkVideo" background>
      </el-pagination>

    </el-tab-pane>
    <el-tab-pane label="采集小说信息" name="third">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>商品链接<span style="color: #409eff;">(一行一个,获取小说详情或小说信息)</span></p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="cpLinkTextarea" :rows="6" resize="none"></el-input>
          </div>
          <div class="link footer">
            <p>范例：<span style="color: red;">七猫小说网:https://www.9biquge.com/42/42857/</span></p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button v-if="isStartCollect" type="primary" @click="startCollectChapter" size="small">开始采集</el-button>
            <el-button v-else type="primary" plain @click="isStartCollect=true" size="small">取消采集</el-button>
            <el-button v-if="radioChpaterValue==1" type="primary" @click="exportInfo(3)" size="small">导出小说信息</el-button>
            <el-button v-else type="primary" @click="exportInfo(4)" size="small">导出章节信息</el-button>
            <el-button type="danger" @click="clearList(2)" size="small">清理列表</el-button>
          </div>
          <div class="link">
            <el-button v-if="radioChpaterValue==1" type="danger" @click="addMoreNovelOrCartoon(2)" size="small">一键添加小说</el-button>
          </div>
          <div class="link radio">
            <el-radio-group v-model="radioChpaterValue" style="margin-top: 15px;">
              <el-radio label="1">小说详情</el-radio>
              <el-radio label="2">小说章节</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input type="textarea" v-model="logDataCp" :rows="6" disabled resize="none"></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table v-if="radioChpaterValue==1" :data="novel.novelCtDetail" v-loading="loadingDetail" @selection-change="selectChange"
          border height="calc(100vh - 450px )" style="width:calc(100vw - 100px )" ref="tableCp" size="small">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <template  v-for="col in cpDetailColumns">
            <el-table-column v-if="col.isSlot" :label="col.label" align="center" show-overflow-tooltip>
              <template v-slot="{row}">
                <div v-if="col.prop == 'cover_lateral'">
                  <el-image :src="row.cover_lateral" fit="fill" style="width: 56px;height: 56px;"></el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="col.prop" :label="col.label" align="center" show-overflow-tooltip></el-table-column>
          </template>
        </el-table>
        <el-table v-else :data="novel.novelCtChapter" v-loading="loadingChapter" @selection-change="selectChange"
          border height="calc(100vh - 550px )" style="width:calc(100vw - 100px )" ref="tableCp" size="medium">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" :key="Math.random()">
            <template v-slot="{$index}">
              <span>{{ (pgNovelParams.pageCp-1)*pgNovelParams.pageSizeCp+($index+1) }}</span>
            </template>
          </el-table-column>
            <template  v-for="col in cpChapterColumns">
              <el-table-column  :prop="col.prop"  :label="col.label" align="center" show-overflow-tooltip>
              </el-table-column>
             
            </template>
        </el-table>
       
      </div>
       <el-pagination
          v-if="radioChpaterValue=='2'"
          style="text-align: right;padding: 20px;"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page.sync="pgNovelParams.pageCp"
          :page-sizes="[10,20, 40, 80, 100]"
          :page-size="pgNovelParams.pageSizeCp"
          layout="sizes, prev, pager, next, jumper, total"
          :total="pgNovelParams.totalNumCp" background>
        </el-pagination>
    </el-tab-pane>

  </el-tabs>

  
</template>

<script>
import {handleKey,copyText} from'@/utils'
import {exportXls,exportExcelDataCommon} from '@/utils/file'
export default {
  name: 'cartoonCollection',
  data () {
    return {
      loadingDetail:false,
      loadingChapter:false,
      loadingCtLnk:false,
      activeName:'first',
      ctLinkTextarea:'', // 采集链接-漫画
      cpLinkTextarea:'', // 采集链接-小说
      isStartCollect:true, // 是否开始采集
      radioCatroonValue:'1', // 1漫画详情 2漫画章节
      radioChpaterValue:'1', // 1小说详情 2小说章节
      radioCtAndCpValue:'1', // 1漫画 2小说 3视频
      logDataCt:'', // 日志信息-漫画
      logDataCp:'', // 日志信息-小说
      logDataCtAndCp:'', // 日志信息-漫画/小说
      cartoon:{
        cartoonCtDetail:[], // 采集的漫画详情列表
        cartoonCtChapter:[],// 展示采集的漫画章节列表
        cartoonCtChapterAll:[],// 采集的全部漫画章节列表
      },
      novel:{
        novelCtDetail:[], // 采集的小说详情列表
        novelCtChapter:[],// 展示采集的小说章节列表
        novelCtChapterAll:[],// 采集的全部小说章节列表
      },
      link:{
        cartoonCtLink:[], // 展示采集的漫画链接列表
        cartoonCtLinkAll:[], // 采集的全部漫画链接列表
        novelCtLink:[],// 展示采集的小说链接列表
        novelCtLinkAll:[],// 采集的全部小说链接列表
        videoCtLink:[],// 展示采集的视频链接列表
        videoCtLinkAll:[],// 采集的全部视频链接列表
      },
      
      // 漫画表头
      ctDetailColumns:[
        {isSlot:false,prop:'title',label:'漫画名称'},
        {isSlot:false,prop:'content',label:'漫画简介'},
        {isSlot:true,prop:'cover_lateral',label:'封面'},
        {isSlot:false,prop:'author_id',label:'作者id'},
        {isSlot:false,prop:'chapter_title',label:'最新章节'},
        {isSlot:false,prop:'price',label:'价格'},
        {isSlot:true,prop:'is_vip',label:'是否vip'},
      ],
      ctChapterColumns:[
        {isSlot:false,prop:'title',label:'章节名称'},
        {isSlot:true,prop:'cover',label:'封面'},
        {isSlot:false,prop:'title_alias',label:'章节别名'},
        {isSlot:false,prop:'price',label:'价格'},
        {isSlot:true,prop:'is_vip',label:'是否vip'},
      ],
      // 小说表头
      cpDetailColumns:[
        {isSlot:false,prop:'name',label:'小说名称'},
        {isSlot:true,prop:'cover_lateral',label:'封面'},
        {isSlot:false,prop:'intro',label:'简介'},
        {isSlot:false,prop:'author',label:'作者'},
      ],
      cpChapterColumns:[
        {isSlot:false,prop:'title',label:'章节名称'},
        {isSlot:false,prop:'title_alias',label:'章节别名'},
      ],
      startPage:'1',
      endPage:'5',
      categoryId:'xuanhuan',
      catrogyData:[
        {
          id: 'xuanhuan',
          name: '玄幻'
        },
        {
          id: 'xiuzhen',
          name: '修真'
        },
        {
          id: 'dushi',
          name: '都市'
        },
        {
          id: 'chuanyue',
          name: '历史'
        },
        {
          id: 'wangyou',
          name: '网游'
        },
        {
          id: 'kehuan',
          name: '科幻'
        },
        {
          id: 'qita',
          name: '其他'
        },
      ],
      selectChapterOption:[],// 已选择的章节列表多选框数据
      // 漫画章节分页器
      pgCartoonParams:{
        pageCt:1, // 当前页
        pageSizeCt:10, // 每页显示的条数
        totalNumCt:0, // 总条数
      },
      
      // 小说章节分页器
      pgNovelParams:{
        pageCp:1, 
        pageSizeCp:10, 
        totalNumCp:0,
      },
      // 漫画链接分页器
      pgCtLinkParams:{
        pageLinkCt:1, 
        pageSizeLinkCt:10, 
        totalNumLinkCt:0, 
      },
      //小说链接分页器
      pgCpLinkParams:{
        pageLinkCp:1, 
        pageSizeLinkCp:10, 
        totalNumLinkCp:0, 
      },
      //视频链接分页器
      pgVeLinkParams:{
        pageLinkVideo:1, 
        pageSizeLinkVideo:10, 
        totalNumLinkVideo:0, 
      }
    }
  },
  mounted() {
    
  },
  methods: {
    // 开始采集漫画信息
    async startCollectCt(){
      
      this.logDataCt = ''
      if (!this.ctLinkTextarea) {
        return this.$message.warning('漫画链接不能为空！')
      }
      this.radioCatroonValue == '1'?this.loadingDetail = true:this.loadingChapter = true
      this.logDataCt = '采集中...\n' + this.logDataCt
      
      
      this.isStartCollect = false
      // 数据处理,Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
      const linkArr = Array.from(new Set(handleKey(this.ctLinkTextarea)))
      const linkArrLength = linkArr.length
      for (let i = 0; i < linkArrLength; i++) {
        const item = linkArr[i];
        //准备采集漫画详情的请求参数
        let comicId = ''
        let chapterId = ''
        let platformId = 1
        // 检查链接格式
        let execPlatform = /(mkzhan.com)/g // 平台正则规则
        let platform = item.match(execPlatform) // ["mkzhan.com"]
        if (!platform) {
          this.logDataCt = `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` + this.logDataCt
        }
        if(this.isStartCollect){
          this.logDataCt = `正在取消采集中，请稍等....\n` + this.logDataCt 
          break
        }
        if(platform && platform[0]){
          if(platform[0]=='mkzhan.com'){
            // item https://www.mkzhan.com/212350/ 
            // ["com/212350/", "212350"]
            comicId = item.match(/com\/(.+)\//)[1]
            platformId = 1
          }else{
            this.logDataCt = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` + this.logDataCt
            continue
          }
        }
        if (comicId.length < 2) {
          this.logDataCt = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` +  this.logDataCt
          continue
        }
        const params = {
          comicId,//漫画Id
          chapterId, 
          method: 'GET',
          platform: platformId,
          // detail: 1 // 1漫画详情 2漫画章节
        }
        // 采集的是漫画详情
        if(this.radioCatroonValue == '1') {
          params.detail = 1
          const res = await this.$API.common.queryDetailById(params)
          if(res.code != 200) {
            this.logDataCt =`${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCt
          } else{
            // 添加所属漫画链接，方便一键添加漫画中添加请求采集的参数:平台id和漫画id
            res.data.url = item
            this.cartoon.cartoonCtDetail.push(res.data)
            this.logDataCt = `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + this.logDataCt
          }
          
        }else{
          // 采集的是漫画章节
          params.detail = 2
          const res = await this.$API.common.queryDetailById(params)
          if(res.code != 200) {
            this.logDataCt =`${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCt
          } else{
            for (let i = 0; i < res.data.length; i++) {
              const index = res.data[i];
              this.cartoon.cartoonCtChapterAll.push(index)
            }
            this.logDataCt = `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + this.logDataCt
          }
        }
      }
      this.radioCatroonValue == '1'?this.loadingDetail = false:this.loadingChapter = false
      this.pgCartoonParams.totalNumCt = this.cartoon.cartoonCtChapterAll.length
      // 切割成要展示的章节数据
      let {pageCt,pageSizeCt } = this.pgCartoonParams
      this.cartoon.cartoonCtChapter = this.sliceArray(this.cartoon.cartoonCtChapterAll,pageCt,pageSizeCt)
      this.logDataCt = `采集完成\n` + this.logDataCt
      this.isStartCollect = true

    },

    // 开始采集小说信息
    async startCollectChapter(){``
      this.logDataCp = ''
      if (!this.cpLinkTextarea) {
        return this.$message.warning('小说链接不能为空！')
      }
      this.radioChpaterValue == '1'?this.loadingDetail = true:this.loadingChapter = true
      this.logDataCp = '采集中...\n' + this.logDataCp
      this.isStartCollect = false
      // 数据处理，Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
      const linkArr = Array.from(new Set(handleKey(this.cpLinkTextarea)))
      const linkArrLength = linkArr.length
      for (let i = 0; i < linkArrLength; i++) {
        const item = linkArr[i];
        // 准备采集小说详情的请求参数
        let comicId = ''
        let pageId = 1
        // 检查链接格式
        let execPlatform = /(9biquge.com)/g // 平台正则规则
        let platform = item.match(execPlatform) // ["9biquge.com"]
        if (!platform) {
          this.logDataCp = `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` + this.logDataCp
        }
        if(this.isStartCollect){
          this.logDataCp = `正在取消采集中，请稍等....\n` + this.logDataCp 
          break
        }
        if(platform && platform[0]){
          if(platform[0]=='9biquge.com'){
            // item https://www.9biquge.com/44/44347/
            // ids ["com/44/44347", "44/44347"]
            let ids = item.match(/com\/(.+)\//)[1].split('/')
            pageId = ids[0]
            comicId = ids[1]
          }else{
            this.logDataCp = `${i + 1}/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` + this.logDataCp
            continue
          }
        }
        if (comicId.length == 0) {
          this.logDataCp = `${i + 1}/${linkArrLength}未从链接中获取到小说id，请检查链接是否正确！\n` + this.logDataCp
          continue
        }

        const params = {
          comicId,
          pageId,
          type: 0
        }
        // 采集的是小说详情
        if(this.radioChpaterValue == '1') {
          const res = await this.$API.common.queryNovelDetail(params)
          if(res.code != 200) {
            this.logDataCp =`${i + 1}/${linkArrLength},小说${comicId}采集失败,}\n` + this.logDataCp
          } else{
            // 添加所属小说链接，方便一键添加小说中添加请求采集的参数:平台id和小说id
            res.data.url = item
            this.novel.novelCtDetail.push(res.data)
            this.logDataCp = `${i + 1}/${linkArrLength}小说${comicId}采集成功\n` + this.logDataCp
          }
        }else{
          // 采集的是小说章节
          try {
            params.type = 1
            const res = await this.$API.common.queryNovelDetail(params)
            if(res.code != 200) {
              this.logDataCp =`${i + 1}/${linkArrLength},小说${comicId}采集失败,【${res.code}】IP限制，请稍后重新采集\n` + this.logDataCp
            } else{
              this.novel.novelCtChapterAll = this.novel.novelCtChapterAll.concat(res.data)
              this.logDataCp = `${i + 1}/${linkArrLength}小说${comicId}采集成功\n` + this.logDataCp
            }
          } catch (error) {
            this.logDataCp = `${i + 1}/${linkArrLength}采集失败\n` + this.logDataCp
          }
        }
      }
      this.radioChpaterValue == '1'?this.loadingDetail = false:this.loadingChapter = false
      this.pgNovelParams.totalNumCp = this.novel.novelCtChapterAll.length
      // 切割成要展示的章节数据
      const {pageCp,pageSizeCp} = this.pgNovelParams
      this.novel.novelCtChapter = this.sliceArray(this.novel.novelCtChapterAll,pageCp,pageSizeCp)
      this.logDataCp = `采集完成\n` + this.logDataCp
      this.isStartCollect = true
    },

    // 开始采集漫画/小说链接
    async startCollectLink(){
      this.loadingCtLnk = true
      this.logDataCtAndCp = ''
      this.logDataCtAndCp = '采集中...\n' + this.logDataCtAndCp
      this.isStartCollect = false
      if(!this.endPage){
        this.endPage = '1'
      }else{
        this.endPage = Number(this.endPage) >50 ?'50':this.endPage
      }
      if(!this.startPage){
        this.startPage = '1'
      }else if(Number(this.startPage)>Number(this.endPage)){
        this.startPage = this.endPage
      }
      let num = parseInt(this.startPage)
      let page = parseInt(this.endPage)
      
      
      // 采集的是漫画链接
      if(this.radioCtAndCpValue=='1'){
        for (let i = num; i <= page; i++) {
          if(this.isStartCollect){
            this.logDataCtAndCp = `正在取消采集中，请稍等....\n` + this.logDataCtAndCp 
            break
          }
          const parasm={
            platform:1,
            page:i
          }
          const res = await this.$API.common.getCartoonLink(parasm)
          if(res.code !== 200){
            this.logDataCtAndCp = `第${i}页采集失败\n` + this.logDataCtAndCp
          }else{
            this.logDataCtAndCp = `正在采集第${i}页，共采集到${res.data.length}条数据\n` + this.logDataCtAndCp
            res.data.forEach(el=>this.link.cartoonCtLinkAll.push(el))
          }
          
        }
        this.pgCtLinkParams.totalNumLinkCt = this.link.cartoonCtLinkAll.length
        const {pageLinkCt,pageSizeLinkCt} = this.pgCtLinkParams
        this.link.cartoonCtLink = this.sliceArray(this.link.cartoonCtLinkAll,pageLinkCt,pageSizeLinkCt) 
        
        
      }else if(this.radioCtAndCpValue=='2'){
        // 采集的是小说链接
        for (let i = num; i <= page; i++) {
          if(this.isStartCollect){
            this.logDataCtAndCp = `正在取消采集中，请稍等....\n` + this.logDataCtAndCp 
            break
          }
          const parasm={
            category_id:this.categoryId,
            page:i
          }
          const res = await this.$API.common.getNovelLink(parasm)
          if(res.code !== 200){
            this.logDataCtAndCp = `第${i}页采集失败\n` + this.logDataCtAndCp
          }else{
            this.logDataCtAndCp = `正在采集第${i}页，共采集到${res.data.length}条数据\n` + this.logDataCtAndCp
            res.data.forEach(el=>this.link.novelCtLinkAll.push(el))
          }
        }
        this.pgCpLinkParams.totalNumLinkCp = this.link.novelCtLinkAll.length
        const {pageLinkCp,pageSizeLinkCp} = this.pgCpLinkParams
        this.link.novelCtLink = this.sliceArray(this.link.novelCtLinkAll,pageLinkCp,pageSizeLinkCp) 
      }else{
        // 采集的是视频链接
        for (let i = num; i <= page; i++) {
          if(this.isStartCollect){
            this.logDataCtAndCp = `正在取消采集中，请稍等....\n` + this.logDataCtAndCp 
            break
          }
          const parasm={
            page:i
          }
          const res = await this.$API.common.getVideoLink(parasm)
          if(res.code !== 200){
            this.logDataCtAndCp = `第${i}页采集失败\n` + this.logDataCtAndCp
          }else{
            this.logDataCtAndCp = `正在采集第${i}页，共采集到${res.data.length}条数据\n` + this.logDataCtAndCp
            res.data.forEach(el=>this.link.videoCtLinkAll.push(el))
          }
        }
        this.pgVeLinkParams.totalNumLinkVideo = this.link.videoCtLinkAll.length
        const {pageLinkVideo,pageSizeLinkVideo} = this.pgVeLinkParams
        this.link.videoCtLink = this.sliceArray(this.link.videoCtLinkAll,pageLinkVideo,pageSizeLinkVideo) 
      }
      this.loadingCtLnk = false
      this.logDataCtAndCp = '采集完成\n' + this.logDataCtAndCp
      this.isStartCollect = true
    },
    // 导出excel漫画1,漫画章节2,小说3,小说章节4
    exportInfo(type){
      let result = []
      let filename = ''
      let head = {}
      switch (type) {
        case 1:
        filename = '漫画列表'
        head = {
          title: '漫画名称',
          cover: '封面',
          content: '漫画简介',
          author_id: '作者',
          price: '价格',
          is_vip: '是否vip',
          url: '采集链接',
          comic_id: '上家漫画ID',
          cover_lateral: '漫画详情封面'
        }
        // 选择的章节列表
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.cartoon.cartoonCtDetail
        break;
        case 2:
        filename = '章节列表'
        head = {
          title: '章节名称',
          cover: '封面',
          title_alias: '章节别名',
          price: '价格',
          is_vip: '是否vip',
          url: '采集链接',
          platform_chapter: '上家ID',
          comicId: '上家漫画ID'
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.cartoon.cartoonCtChapter
        break
        case 3:
          filename = '小说列表'
          head = {
            name: '小说名称',
            cover_lateral: '封面',
            intro: '简介',
            author: '作者',
            url: '采集链接',
            platform_comic: '上家漫画ID',
            pageId: '上家页面id'
          }
          result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.novel.novelCtDetail
          break
        case 4:
        filename = '小说章节列表'
        head = {
          title: '小说名称',
          title_alias: '章节别名',
          platform_chapter: '上家章节ID',
          platform_comic: '上家漫画ID'
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.novel.novelCtChapter
        break
      }
      //定义一个数组，用来保存最后需要发请求的数据,最后结果是个数组对象[{},{}]
      const list = result.map(item=>{
        const obj = {} 
        for(const k in item){
          // head的键值和res的对象属性相同，head['漫画名称']存在？
          if(head[k]){
            // 相当于obj.name = item.name，而item.name='xxx',添加属性并赋值
            obj[head[k]] = item[k]
          }
        }
        return obj
      })

      exportXls(filename, list)
    },
    // 导出采集好的链接（漫画，小说，视频）
    exportLink(){
      exportExcelDataCommon('漫画_小说_视频链接')
    },
    // 一键添加漫画小说视频 type 1漫画 2小说 3视频
    async addMoreNovelOrCartoon(type){
      let result = []
      
      // 一键添加漫画(不用检查链接格式)
      if(type == 1){
        if(!this.cartoon.cartoonCtDetail.length){
          return this.$message.warning('请采集漫画链接')
        }
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.cartoon.cartoonCtDetail
        this.logDataCt = '开始一键添加漫画...\n' + this.logDataCt
        const linkArrLength = result.length
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          // // 准备采集漫画详情的请求参数
          const params = {
            // item https://www.mkzhan.com/212350/ 
            // ["com/212350/", "212350"]
            comicId:item['url'].match(/com\/(.+)\//)[1],//漫画Id
            chapterId:'', 
            method: 'GET',
            platform: 1,
            detail: 1 // 1漫画详情 2漫画章节
          }
          try {
            const res = await this.$API.common.queryDetailById(params)
            if(res.code != 200) {
              this.logDataCt =`${i + 1}/${linkArrLength},漫画${params.comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCt
            } else{
              const {title,content,cover,price,is_vip,status,cover_lateral,comic_id,author_id} = res.data
              // 准备添加漫画的请求参数
              const cartoon ={
                name:title,
                cartoon_introduction:content,
                img_url:cover,
                cover_lateral,
                price,
                charge:is_vip,
                status,
                platform_comic:comic_id,
                category_id:1,
                author:author_id,
              }
              this.logDataCt = `${i + 1}/${linkArrLength}漫画${params.comicId}添加成功\n` + this.logDataCt
              this.logDataCt = `开始添加${cartoon.name}\n` + this.logDataCt
              const res1 = await this.$API.cartoon.addList(cartoon)
              if(res1.code == 200){
                this.logDataCt = `${cartoon.name}添加成功\n` + this.logDataCt
              }else{
                this.logDataCt = `${cartoon.name}添加失败,${res1.msg}\n` + this.logDataCt
              }
            }
          } catch (error) {
            this.logDataCt = `${i + 1}/${linkArrLength}，漫画${params.comicId}采集失败\n` + this.logDataCt
          }
        }
        this.logDataCt  = `一键添加漫画完成\n` +this.logDataCt 

      }else if(type == 2){
        // 一键添加小说(不用检查链接格式)
        if(this.radioChpaterValue=='1'){
          if(!this.novel.novelCtDetail.length){
            return this.$message.warning('请采集小说链接')
          }
        }
        if(this.radioCtAndCpValue=='2'){
          if(!this.link.novelCtLink.length){
            return this.$message.warning('请采集小说链接')
          }
        }
        
        result = this.selectChapterOption.length > 0 ? this.selectChapterOption : this.novel.novelCtDetail
        this.logDataCp = '开始一键添加小说...\n' + this.logDataCp
        const linkArrLength = result.length
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          // item https://www.9biquge.com/44/44347/
          // ids ["com/44/44347", "44/44347"]
          let ids = item['url'].match(/com\/(.+)\//)[1].split('/')
          // 准备采集小说详情的请求参数
          const params = {
            comicId:ids[1],
            pageId:ids[0]
          }
          try {
            const res = await this.$API.common.queryNovelDetail(params)
            if(res.code != 200) {
              this.logDataCp =`${i + 1}/${linkArrLength},小说${params.comicId}采集失败,【${res.code}】${res.msg || ''}\n` + this.logDataCp
            } else{
              const novel = res.data
              this.logDataCp = `${i + 1}/${linkArrLength}小说${params.comicId}添加成功\n` + this.logDataCp
              this.logDataCp = `开始添加${novel.name}\n` + this.logDataCp
              novel['category_id'] = 1
              const res1 = await this.$API.novel.addList(novel)
              if(res1.code == 200){
                this.logDataCp = `${novel.name}添加成功\n` + this.logDataCp
              }else{
                this.logDataCp = `${novel.name}添加失败,${res1.msg}\n` + this.logDataCp
              }
            }
          } catch (error) {
            this.logDataCp = `${i + 1}/${linkArrLength}，小说${params.comicId}采集失败\n` + this.logDataCp
          }
        }
        this.logDataCp  = `一键添加小说完成\n` +this.logDataCp 
      }
      
    },
    // 清理列表 1漫画 2小说 3漫画/小说
    clearList(type){
      if(type == 1){
        if(this.radioCatroonValue == '1'){
          this.cartoon.cartoonCtDetail = []
        }else{
          this.cartoon.cartoonCtChapterAll = []
          this.cartoon.cartoonCtChapter = []
          Object.assign(this.$data.pgCatroonParams,this.$options.data().pgCatroonParams)
        }
      }else if(type == 2){
        if(this.radioChpaterValue == '1'){
          this.novel.novelCtDetail = []
        }else{
          this.novel.novelCtChapterAll = []
          this.novel.novelCtChapter = []
          Object.assign(this.$data.pgNovelParams,this.$options.data().pgNovelParams)
        }
      }else{
        switch (this.radioCtAndCpValue) {
          case '1':
            this.link.cartoonCtLink = []
            this.link.cartoonCtLinkAll = []
            Object.assign(this.$data.pgCtLinkParams,this.$options.data().pgCtLinkParams)

            break;
          case '2':
            this.link.novelCtLinkAll = []
            this.link.novelCtLink = []
            Object.assign(this.$data.pgCpLinkParams,this.$options.data().pgCpLinkParams)
          case '3':
            this.link.videoCtLinkAll = []
            this.link.videoCtLink = []
            Object.assign(this.$data.pgVeLinkParams,this.$options.data().pgVeLinkParams)
        }
        
      }
     
      
    },
    // 多选框改变时，选择的章节列表
    selectChange(selection){
      this.selectChapterOption = selection
    },

    // 每页显示的条数改变时
    sizeChange(pageSize){
      // 漫画章节
      if(this.radioCatroonValue == '2'){
        this.pgCartoonParams.pageCt = 1
        this.pgCartoonParams.pageSizeCt = pageSize
        if(this.cartoon.cartoonCtChapterAll.length){
          const {pageCt,pageSizeCt} = this.pgCartoonParams
          this.cartoon.cartoonCtChapter =this.sliceArray(this.cartoon.cartoonCtChapterAll,pageCt,pageSizeCt)
        }
      }else if(this.radioChpaterValue = '2'){
        // 小说章节
        this.pgNovelParams.pageCp = 1
        this.pgNovelParams.pageSizeCp = pageSize
        if(this.novel.novelCtChapterAll.length){
          const {pageCp,pageSizeCp} = this.pgNovelParams
          this.novel.novelCtChapter =this.sliceArray(this.novel.novelCtChapterAll,pageCp,pageSizeCp)
        }
      }else{
        // 漫画/小说链接 1漫画 2小说 3视频
        switch (this.radioCtAndCpValue) {
          case '1':
            this.pgCtLinkParams.pageLinkCt = 1
            this.pgCtLinkParams.pageSizeLinkCt = pageSize
            
            if(this.link.cartoonCtLinkAll.length){
              const {pageLinkCt,pageSizeLinkCt} = this.pgCtLinkParams
              this.link.cartoonCtLink =this.sliceArray(this.link.cartoonCtLinkAll,pageLinkCt,pageSizeLinkCt)
            }
            break;
          case '2':
            this.pgCpLinkParams.pageLinkCp = 1
            this.pgCpLinkParams.pageSizeLinkCp = pageSize
            if(this.link.novelCtLinkAll.length){
              const {pageLinkCp,pageSizeLinkCp} = this.pgCpLinkParams
              this.link.novelCtLink =this.sliceArray(this.link.novelCtLinkAll,pageLinkCp,pageSizeLinkCp)
            }
            break;
          case '3':
            this.pgVeLinkParams.pageLinkVideo = 1
            this.pgVeLinkParams.pageSizeLinkVideo = pageSize
            if(this.link.videoCtLinkAll.length){
              const {pageLinkVideo,pageSizeLinkVideo} = this.pgVeLinkParams
              this.link.videoCtLink =this.sliceArray(this.link.videoCtLinkAll,pageLinkVideo,pageSizeLinkVideo)
            }
            break;
        }
      }
    },
    // 当前页改变时
    currentChange(page){
      // 漫画章节
      if(this.radioCatroonValue == '2'){
        this.pgCartoonParams.pageCt = page
        if(this.cartoon.cartoonCtChapterAll.length){
          const {pageCt,pageSizeCt} = this.pgCartoonParams
          this.cartoon.cartoonCtChapter =this.sliceArray(this.cartoon.cartoonCtChapterAll,pageCt,pageSizeCt)
        }
      }else if(this.radioChpaterValue == '2'){
        // 小说章节
        this.pgNovelParams.pageCp = page
        if(this.novel.novelCtChapterAll.length){
          const {pageCp,pageSizeCp} = this.pgNovelParams
          this.novel.novelCtChapter =this.sliceArray(this.novel.novelCtChapterAll,pageCp,pageSizeCp)
        }
      }else{
        // 漫画/小说链接 1漫画 2小说 3视频
        switch (this.radioCtAndCpValue) {
          case '1':
            this.pgCtLinkParams.pageLinkCt = page
            if(this.link.cartoonCtLinkAll.length){
              const {pageLinkCt,pageSizeLinkCt} = this.pgCtLinkParams
              this.link.cartoonCtLink =this.sliceArray(this.link.cartoonCtLinkAll,pageLinkCt,pageSizeLinkCt)
            }
            break;
          case '2':
            this.pgCpLinkParams.pageLinkCp = page
            if(this.link.novelCtLinkAll.length){
              const {pageLinkCp,pageSizeLinkCp} = this.pgCpLinkParams
              this.link.novelCtLink =this.sliceArray(this.link.novelCtLinkAll,pageLinkCp,pageSizeLinkCp)
            }
            break;
          case '3':
            this.pgVeLinkParams.pageLinkVideo = page
            if(this.link.videoCtLinkAll.length){
              const {pageLinkVideo,pageSizeLinkVideo} = this.pgVeLinkParams
              this.link.videoCtLink =this.sliceArray(this.link.videoCtLinkAll,pageLinkVideo,pageSizeLinkVideo)
            }
            break;
        }
      }
    },

    sliceArray(data,page,pageSize){
      return data.slice((page-1) * pageSize, page * pageSize)
    },

    copy(url){
      copyText(url)
    }

    
  },
  watch:{
    'activeName':{
      handler(oldVal,newVal){
        this.selectChapterOption = []
        if(newVal == 'first'){
          this.$refs.tableCp.clearSelection()
          this.$refs.tableLink.clearSelection()
        }else if(newVal == 'second'){
          this.$refs.tableCt.clearSelection()
          this.$refs.tableLink.clearSelection()
        }else{
          this.$refs.tableCp.clearSelection()
          this.$refs.tableCt.clearSelection()
        }
      }
    },
    'radioCatroonValue':{
      handler(){
        this.selectChapterOption = []
      }
    },
    'radioChpaterValue':{
      handler(){
        this.selectChapterOption = []
      }
    },
    'radioCtAndCpValue':{
      handler(){
        this.selectChapterOption = []
      }
    }


  }
}
</script>

<style lang='scss' scoped>
.cartoonCollect{
  padding: 20px;
  font-size: 14px;
  .collectionLink{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 0 15px;
    background-color:#fff;
    border: 1px solid #ebeef5;
    .linkLeft{
      flex: 1 1 auto;
      width: 700px;
    }
    .linkMain{
      width: 360px;
      padding: 60px 10px 0 25px;
    }
    .linRight{
      width: 400px;
      flex: 1 1 auto;
    }
    .linLog{
      margin-left: 50px;
      width: 400px;
    }
    .link{
      display: flex;
      align-items: center;
      margin: 0 10px 10px 0;
      ::v-deep .el-input__inner{
        height: 30px;
      }
      &.page{
        .label{
          margin-left: 10px;
        }
        
      }
      &.category{
        .label{
          margin-left: 10px;
        }
        .select{
          margin-left: 10px;
          line-height:38px;
        }
        ::v-deep .el-input__inner{
          width: 160px;
        }
      }
    }
  }
  .collectionTable{
    margin-top: 20px;
  }
  .copy {
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
