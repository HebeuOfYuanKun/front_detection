<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: null
    }
  },
  created(){
    this.$socket.registerCallBack('getLineEchartsData', this.getLineEchartsData)
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    getLineEchartsData(data){
      this.data=data
      console.log(data)
      this.updateChart()
    },
    updateChart() {
      const dataOption = {
        xAxis: {
          data: this.data.CurrentWeek
        },
        
        series: [{
          name: '一级预警', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          type: 'line',
          data: this.data.grade1,
      
        },
        {
          name: '二级预警',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FFFF00',
              lineStyle: {
                color: '#FFFF00',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.data.grade2,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '三级预警',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.data.grade3,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      
          
        
      }
      this.chart.setOption(dataOption)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
        text: '近一周预警事件数量',
      
          },
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['一级预警', '二级预警', '三级预警']
        },
        series: [{
          name: '一级预警', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '二级预警',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FFFF00',
              lineStyle: {
                color: '#FFFF00',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '三级预警',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
      ]
      })
    }
  }
}
</script>
