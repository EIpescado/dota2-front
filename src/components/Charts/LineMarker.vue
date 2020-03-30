<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    bardata: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      chart: null,
      title: '',
      legend_data: [],
      xAxis_data: [],
      xAxis_name: '',
      yAxis_name: '',
      yMin: null,
      yMax: null,
      series: []
    }
  },
  watch: {
    bardata(val) {
      this.title = val.title
      this.legend_data = val.legend_data
      this.xAxis_data = val.xAxis_data
      this.xAxis_name = val.xAxis_name
      this.yAxis_name = val.yAxis_name
      this.series = val.series
      this.yMin = val.yMin
      this.yMin = val.yMin
      this.initChart()
    }
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
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: this.title,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.legend_data,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          name: this.xAxis_name,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              return value.substring(0, 11)
            }
          },
          data: this.xAxis_data
        }],
        yAxis: [{
          type: 'value',
          name: this.yAxis_name,
          min: this.yMin,
          max: this.yMax,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
            // formatter: function(value, index) {
            //   return value.toFixed(4)
            // }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: this.series
      })
    }
  }
}
</script>
