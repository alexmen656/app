<template>
  <div class="chart-container">
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="chartSeries"
      height="240"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { default as ApexCharts } from 'vue3-apexcharts'

// Register the component locally
const apexchart = ApexCharts

interface ChartProps {
  data: Array<{ label: string; calories: number; goal?: number }>
  period: 'week' | 'month' | 'year'
  goal?: number
}

const props = withDefaults(defineProps<ChartProps>(), {
  goal: 2500
})

const chartData = computed(() => {
  if (props.data?.length) {
    return props.data
  }
  // Fallback mock data
  return [
    { label: 'Mo', calories: 2200 },
    { label: 'Di', calories: 2400 },
    { label: 'Mi', calories: 2100 },
    { label: 'Do', calories: 2600 },
    { label: 'Fr', calories: 2300 },
    { label: 'Sa', calories: 2800 },
    { label: 'So', calories: 2150 }
  ]
})

const chartSeries = computed(() => [
  {
    name: 'Kalorien',
    data: chartData.value.map(item => item.calories)
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  theme: { mode: 'dark' },
  colors: ['#ffd6d6'],
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
      distributed: false,
      dataLabels: { position: 'top' },
      borderRadiusApplication: 'end'
    }
  },
  stroke: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (value: number) => `${value}`,
    // small offset so labels sit just above the bar
  offsetY: -28,
    style: { colors: ['#ffffff'], fontSize: '14px', fontWeight: '700' },
    background: { enabled: false }
  },
  legend: { show: false },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.4,
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        { offset: 0, color: '#ffd6d6', opacity: 1 }, // top (light)
        { offset: 100, color: '#ff6b6b', opacity: 1 } // bottom (dark)
      ]
    }
  },
  xaxis: {
    categories: chartData.value.map(item => item.label),
    labels: { style: { colors: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { show: false }
  },
  grid: { borderColor: 'rgba(255, 255, 255, 0.1)', strokeDashArray: 3 },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px' },
    y: {
      formatter: (value: number) => {
        const diff = value - props.goal
        const diffText = diff > 0 ? `+${diff}` : `${diff}`
        return `${value} kcal<br/>Ziel: ${props.goal} kcal<br/>Differenz: ${diffText} kcal`
      }
    }
  },
  annotations: {
    yaxis: props.goal ? [{
      y: props.goal,
      borderColor: 'rgba(255, 167, 38, 0.8)',
      strokeDashArray: 5,
      label: { text: `Ziel: ${props.goal} kcal`, style: { color: '#ffffff', background: 'rgba(255, 167, 38, 0.8)' } }
    }] : [],
    points: []
  }
}))
</script>

<style scoped>
.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  /*padding: 20px;*/
  backdrop-filter: blur(10px);
}

apexchart {
    height: 100%;
}
</style>
