<template>
  <div class="weight-chart-container">
    <apexchart type="line" height="300" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { default as ApexCharts } from 'vue3-apexcharts'

// Register the component locally
const apexchart = ApexCharts

interface WeightDataPoint {
  date: string
  weight: number
}

interface WeightChartProps {
  data: WeightDataPoint[]
  goalWeight?: number
  currentWeight?: number
}

const props = defineProps<WeightChartProps>()

const chartData = computed(() => {
  if (props.data?.length) {
    return props.data
  }
  // Fallback mock data
  return [
    { date: '2025-08-17', weight: 75.5 },
    { date: '2025-08-18', weight: 75.2 },
    { date: '2025-08-19', weight: 75.0 },
    { date: '2025-08-20', weight: 74.8 },
    { date: '2025-08-21', weight: 74.6 },
    { date: '2025-08-22', weight: 74.4 },
    { date: '2025-08-23', weight: 74.2 }
  ]
})

const chartSeries = computed(() => {
  const series = [
    {
      name: 'Gewicht',
      data: chartData.value.map(item => ({
        x: new Date(item.date).getTime(),
        y: item.weight
      }))
    }
  ]

  /*if (props.goalWeight) {
    series.push({
      name: 'Zielgewicht',
      data: chartData.value.map(item => ({
        x: new Date(item.date).getTime(),
        y: props.goalWeight!
      }))
    })
  }*/

  return series
})

const chartOptions = computed(() => {
  const values = chartData.value.map(d => d.weight)
  const min = Math.floor(Math.min(...values) - 0.3)
  const max = Math.ceil(Math.max(...values) + 0.3)
  const tickAmount = 3

  return {
    chart: {
      type: 'line',
      background: 'transparent',
      // disable toolbar and interactive zoom/selection
      toolbar: { show: false, tools: { zoom: false, selection: false, zoomin: false, zoomout: false } },
      zoom: { enabled: false },
      animations: { enabled: true, easing: 'easeinout', speed: 600 }
    },
    theme: { mode: 'dark' },
    // primary series white, goal (if present) subtle orange
    colors: ['#ffffff', 'rgba(255, 167, 38, 0.8)'],
    stroke: { width: [3, 2], curve: 'smooth', dashArray: [0, 5] },
    markers: { size: [5, 0], colors: ['#ffffff'], strokeColors: '#2b2b34', strokeWidth: 2, hover: { size: 7 } },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 1,
        gradientToColors: ['rgba(255,255,255,0)'],
        opacityFrom: 0.22,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: 'rgba(255,255,255,0.75)', fontSize: '12px' }, datetimeFormatter: { day: 'dd.MM' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min,
      max,
      tickAmount,
      labels: { style: { colors: 'rgba(255,255,255,0.75)', fontSize: '12px' }, formatter: (v: number) => `${v.toFixed(1)}` }
    },
    grid: { borderColor: 'rgba(255,255,255,0.08)', strokeDashArray: 4 },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' },
      x: { format: 'dd.MM.yyyy' },
      y: { formatter: (val: number) => `${val} kg` }
    },
    legend: { show: false }
  }
})
</script>

<style scoped>
.weight-chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-top: 20px;
}
</style>
