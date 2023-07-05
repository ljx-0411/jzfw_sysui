<template>
  <div class="dashboard-container">
    <div class="count">
      <div class="customer">
        <div class="title">
          访问量
        </div>
        <div class="content">
          <div class="content_1">
            <span>25,848</span>
            <div class="msg">日同比 12.5% 周同比 5% </div>
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">总访问量</div>
            <div class="flex_item2">280万</div>
          </div>
        </div>
      </div>

      <div class="customer">
        <div class="title">
          销售额
        </div>
        <div class="content">
          <div class="content_1">
            <span>¥12,000</span>
            <div class="msg"><el-progress style="margin-top:8px" :text-inside="false" :stroke-width="12" :percentage="70" /></div>
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">总销售额</div>
            <div class="flex_item2">80万</div>
          </div>
        </div>
      </div>

      <div class="customer">
        <div class="title">
          订单量
        </div>
        <div class="content">
          <div class="content_1">
            <span>25,848</span>
            <div id="container" />
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">转化率</div>
            <div class="flex_item2">60%</div>
          </div>
        </div>
      </div>

      <div class="customer">
        <div class="title">
          用户
        </div>
        <div class="content">
          <div class="content_1">
            <span>128位</span>
            <div class="msg">日同比 12.5% 周同比 5% </div>
            <div class="line" />
          </div>
          <div class="flex">
            <div class="flex_item1">总用户</div>
            <div class="flex_item2">10800人</div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav_bar">
      <div v-for="item in list" :key="item" class="item">
        <div><img width="32px" height="32px" :src="item.src" alt=""></div>
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="chart">
      <div class="title1">订单量</div>
      <div class="line1" />
      <div class="chart_item">
        <div class="chart_item1">
          <h4>订单趋势</h4>
          <div id="chart_dom1" style="height:220px" />
        </div>
        <div class="chart_item2">
          <h4>订单量排行</h4>
          <div v-for="item in order" :key="item.id" class="chart_dom2">
            <div class="phang">
              <span class="phang_item1">{{ item.id }}</span>
              <span class="phang_item2">{{ item.name }}</span>
              <span class="phang_item3">{{ item.num }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="commen">
      <div class="commen_item1">
        <div class="commen_item_title">平均评价</div>
        <div class="commen_item_line">
          <div style="padding:18px">
            <h2 class="pingfen">4.5</h2>
            <el-rate
              v-model="value"
              style="display:inline;color:38px"
              disabled
              text-color="#ff9900"
            />
            <el-progress style="margin-bottom:10px;margin-top:20px" :percentage="percentage" :color="customColor" />
            <el-progress style="margin-bottom:10px" :percentage="percentage1" :color="customColors" />
            <el-progress style="margin-bottom:10px" :percentage="percentage2" :color="customColors" />
            <el-progress style="margin-bottom:10px" :percentage="percentage3" :color="customColors" />
            <el-progress style="margin-bottom:10px" :percentage="percentage4" :color="customColors" />
          </div>
        </div>
      </div>
      <div class="commen_item2">
        <div class="commen_item_title">用户</div>
        <div class="commen_item_line" />
        <div id="" />
      </div>
      <div class="commen_item3">
        <div class="commen_item_title">本月目标</div>
        <div class="commen_item_line">
          <div style="width:126px;margin:0 auto;text-aglin:center;padding-top:3em">
            <el-progress type="dashboard" :percentage="percentage" color="#1989fa" />
            <p style="width:300px;font-size:14px;color:#515a6e;margin-top:6px">恭喜！本月目标已达标</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Area } from '@antv/g2plot'
import { Column } from '@antv/g2plot'
import { Pie } from '@antv/g2plot'
import yonghu from '../../../public/img/用户.png'
import fenxi from '../../../public/img/分析.png'
import biaoqian from '../../../public/img/标签.png'
import xiaoxi from '../../../public/img/消息.png'
import piaoju from '../../../public/img/票据.png'
import dingdan from '../../../public/img/订单.png'
import chanpin from '../../../public/img/购物车.png'
import peizhi from '../../../public/img/配置.png'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      percentage: 90,
      percentage1: 60,
      percentage2: 30,
      percentage3: 10,
      percentage4: 0,
      customColor: '#409eff',
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      value: 4.5,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      list: [
        { name: '用户', src: yonghu },
        { name: '分析', src: fenxi },
        { name: '标签', src: biaoqian },
        { name: '消息', src: xiaoxi },
        { name: '票据', src: piaoju },
        { name: '订单', src: dingdan },
        { name: '产品', src: chanpin },
        { name: '配置', src: peizhi }
      ],
      order: [
        { id: 1, name: '家居洗护', num: 367 },
        { id: 2, name: '衣物洗涤', num: 456 },
        { id: 3, name: '看护婴幼儿', num: 124 },
        { id: 4, name: '房屋开荒', num: 467 },
        { id: 5, name: '家庭教育', num: 788 },
        { id: 6, name: '家庭便餐', num: 987 },
        { id: 7, name: '打蜡', num: 12 }
      ],
      data: [
        {
          'timePeriod': '2006 Q3',
          'value': 1
        },
        {
          'timePeriod': '2006 Q4',
          'value': 1.08
        },
        {
          'timePeriod': '2007 Q1',
          'value': 1.17
        },
        {
          'timePeriod': '2007 Q2',
          'value': 1.26
        },
        {
          'timePeriod': '2007 Q3',
          'value': 1.34
        },
        {
          'timePeriod': '2007 Q4',
          'value': 1.41
        },
        {
          'timePeriod': '2008 Q1',
          'value': 1.52
        },
        {
          'timePeriod': '2008 Q2',
          'value': 1.67
        },
        {
          'timePeriod': '2008 Q3',
          'value': 1.84
        },
        {
          'timePeriod': '2008 Q4',
          'value': 2.07
        },
        {
          'timePeriod': '2009 Q1',
          'value': 2.39
        },
        {
          'timePeriod': '2009 Q2',
          'value': 2.71
        },
        {
          'timePeriod': '2009 Q3',
          'value': 3.03
        },
        {
          'timePeriod': '2009 Q4',
          'value': 3.33
        },
        {
          'timePeriod': '2010 Q1',
          'value': 3.5
        },
        {
          'timePeriod': '2010 Q2',
          'value': 3.37
        },
        {
          'timePeriod': '2010 Q3',
          'value': 3.15
        },
        {
          'timePeriod': '2010 Q4',
          'value': 3.01
        },
        {
          'timePeriod': '2011 Q1',
          'value': 2.8
        },
        {
          'timePeriod': '2011 Q2',
          'value': 2.8
        },
        {
          'timePeriod': '2011 Q3',
          'value': 2.84
        },
        {
          'timePeriod': '2011 Q4',
          'value': 2.75
        },
        {
          'timePeriod': '2012 Q1',
          'value': 2.64
        },
        {
          'timePeriod': '2012 Q2',
          'value': 2.55
        },
        {
          'timePeriod': '2012 Q3',
          'value': 2.46
        },
        {
          'timePeriod': '2012 Q4',
          'value': 2.45
        },
        {
          'timePeriod': '2013 Q1',
          'value': 2.57
        },
        {
          'timePeriod': '2013 Q2',
          'value': 2.68
        },
        {
          'timePeriod': '2013 Q3',
          'value': 2.8
        },
        {
          'timePeriod': '2013 Q4',
          'value': 2.89
        },
        {
          'timePeriod': '2014 Q1',
          'value': 2.85
        },
        {
          'timePeriod': '2014 Q2',
          'value': 2.73
        },
        {
          'timePeriod': '2014 Q3',
          'value': 2.54
        },
        {
          'timePeriod': '2014 Q4',
          'value': 2.32
        },
        {
          'timePeriod': '2015 Q1',
          'value': 2.25
        },
        {
          'timePeriod': '2015 Q2',
          'value': 2.33
        },
        {
          'timePeriod': '2015 Q3',
          'value': 2.53
        },
        {
          'timePeriod': '2015 Q4',
          'value': 2.74
        },
        {
          'timePeriod': '2016 Q1',
          'value': 2.76
        },
        {
          'timePeriod': '2016 Q2',
          'value': 2.61
        },
        {
          'timePeriod': '2016 Q3',
          'value': 2.35
        },
        {
          'timePeriod': '2016 Q4',
          'value': 2.11
        },
        {
          'timePeriod': '2017 Q1',
          'value': 2.08
        },
        {
          'timePeriod': '2017 Q2',
          'value': 2.2
        },
        {
          'timePeriod': '2017 Q3',
          'value': 2.38
        },
        {
          'timePeriod': '2017 Q4',
          'value': 2.59
        },
        {
          'timePeriod': '2018 Q1',
          'value': 2.63
        },
        {
          'timePeriod': '2018 Q2',
          'value': 2.67
        },
        {
          'timePeriod': '2018 Q3',
          'value': 2.64
        },
        {
          'timePeriod': '2018 Q4',
          'value': 2.5
        },
        {
          'timePeriod': '2019 Q1',
          'value': 2.31
        },
        {
          'timePeriod': '2019 Q2',
          'value': 2.04
        },
        {
          'timePeriod': '2019 Q3',
          'value': 1.83
        },
        {
          'timePeriod': '2019 Q4',
          'value': 1.71
        },
        {
          'timePeriod': '2020 Q1',
          'value': 1.65
        },
        {
          'timePeriod': '2020 Q2',
          'value': 1.59
        },
        {
          'timePeriod': '2020 Q3',
          'value': 1.58
        }
      ]
    }
  },
  created() {
    setTimeout(() => {
      this.load()
      this.loadChart()
      this.loadCommen()
    }, 500)
  },
  methods: {
    load() {
      const area = new Area('container', {
        data: this.data,
        xField: 'timePeriod',
        yField: 'value',
        // xAxis: {
        //   range: [0, 1],
        // },
        xAxis: false,
        yAxis: false,
        color: '#00CC66'
      })
      area.render()
    },
    loadChart() {
      const data = [
        {
          type: '1月',
          sales: 38
        },
        {
          type: '2月',
          sales: 52
        },
        {
          type: '3月',
          sales: 61
        },
        {
          type: '4月',
          sales: 145
        },
        {
          type: '5月',
          sales: 48
        },
        {
          type: '6月',
          sales: 38
        },
        {
          type: '7月',
          sales: 38
        },
        {
          type: '8月',
          sales: 38
        }
      ]

      const columnPlot = new Column('chart_dom1', {
        data,
        xField: 'type',
        yField: 'sales',
        color: 'l(270) 0:#1495EB 1:#75D1FF',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle', // 'top', 'bottom', 'middle',
          // 配置样式
          style: {
            fill: '#FFFFFF',
            opacity: 0.6
          }
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false
          },
          line: {
            color: '#333'
          }
        },
        meta: {
          type: {
            alias: '类别'
          },
          sales: {
            alias: '销售额'
          }
        }
      })

      columnPlot.render()
    },
    loadCommen() {
      const data = [
        { type: '顾客', value: 27 },
        { type: '员工', value: 25 },
        { type: '管理员', value: 18 }
      ]

      const piePlot = new Pie('commen_item2_dom', {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 14
          }
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            },
            formatter: () => 'AntV\nG2Plot'
          }
        }
      })

      piePlot.render()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
    background-color: #F5F7F9;

}
.dashboard {
  &-container {
    padding: .5em;
    margin: -.5em;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.count {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.customer {
  flex: 1;
  width: 20%;
  background-color: #fff;
  height: 200px;
  border-radius: 4px;
  margin-right: 10px;
}
.title {
  padding: 14px 16px;
  height: 51px;
  border-bottom: 1px solid #E8EAEC;
}
.content {
  padding: 12px;
  height: 149px;
}

.content_1 span {
  font-size: 30px;
  color: #515a6e;
}
.msg {
  width: 100%;
  height: 42px;
  padding-top: 8px;
  font-size: 14px;
  color: #515a6e;
  box-sizing: border-box;
  line-height: 30px;
}
.line {
  margin: 8px 0px;
  height: 1px;
  background-color: #E8EAEC;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 30px;
}
.flex_item1,.flex_item2 {
  color: #515a6e;
  font-size: 14px;
}
#container {
  height: 42px;
}
.nav_bar {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.nav_bar .item {
  width: 100px;
  height: 93px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
}
.nav_bar .item:hover {
  box-shadow: #ccc 0px 0px 12px;
  cursor: pointer;
}
.nav_bar .item div {
  text-align: center;
  font-size: 14px;
  color: #515a6e;
}
.nav_bar .item div:last-child {
  margin-top: 10px;
}
.chart {
  height: 366px;
  background-color: #fff;
  margin-top: 20px;
  border-radius: 4px;
}
.title1 {
  height: 48px;
  padding: 0 20px;
  line-height: 48px;
  color: #515a6e;
  font-size: 14px;
}
.line1 {
  height: 1px;
  background-color: #E8EAEC;
}
.chart_item {
  display: flex;
}
.chart_item1 {
  flex: 1.7;
  height: 317px;
  padding: 0 20px;
}
.chart_item2 {
  flex: 1;
  height: 317px;
  padding: 0 20px;
}
.chart_dom2 .phang {
  height: 28px;
  margin-bottom: 8px;
}
.phang_item1 {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #E6F6FF;
  line-height: 22px;
  text-align: center;
  color: #1791FF;
}
.phang_item2 {
  margin-left: 6px;
  font-size: 13px;
  color: #515a6e;
}
.phang_item3 {
  float: right;
  font-size: 13px;
  color: #515a6e;
  line-height: 2;
}
.commen {
  display: flex;
  justify-content: space-around;
  margin-top: 2em;
}
.commen_item1 {
  flex: 2;
  height: 300px;
  margin-right: 1em;
  border-radius: 4px;
  background-color: #fff;
}
.commen_item2 {
  flex: 1;
  height: 300px;
  margin-right: 1em;
  border-radius: 4px;
  background-color: #fff;
}
.commen_item3 {
  flex: 1;
  height: 300px;
  margin-right: 1em;
  border-radius: 4px;
  background-color: #fff;
}
.commen_item_title {
  padding: 0 18px;
  height: 48px;
  line-height: 48px;
  color: #515a6e;
  font-size: 14px;
}
.commen_item_line {
  height: 1px;
  background-color: #E8EAEC;
}
.pingfen {
  display: inline;
  font-size: 48px;
  color: #515a6e;
  font-weight: 400;
  margin-right: 18px;
}
.commen_item2_dom {
  height: 200px;
}
</style>
