<template>
  <div class="weight-chart-container">
    <apexchart
      type="line"
      height="300"
      :options="chartOptions"
      :series="chartSeries"
    />
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

  if (props.goalWeight) {
    series.push({
      name: 'Zielgewicht',
      data: chartData.value.map(item => ({
        x: new Date(item.date).getTime(),
        y: props.goalWeight!
      }))
    })
  }

  return series
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    background: 'transparent',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  theme: {
    mode: 'dark'
  },
  colors: ['#00a86b', 'rgba(255, 167, 38, 0.8)'],
  stroke: {
    width: [3, 2],
    curve: 'smooth',
    dashArray: [0, 5]
  },
  markers: {
    size: [6, 0],
    colors: ['#00a86b'],
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: {
      size: 8
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['rgba(0, 168, 107, 0.1)'],
      shadeIntensity: 1,
      type: 'vertical',
      opacityFrom: 0.3,
      opacityTo: 0,
      stops: [0, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px'
      },
      datetimeFormatter: {
        day: 'dd.MM'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px'
      },
      formatter: (value: number) => `${value} kg`
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    strokeDashArray: 3
  },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '12px'
    },
    x: {
      format: 'dd.MM.yyyy'
    },
    y: {
      formatter: (value: number, { seriesIndex }: any) => {
        if (seriesIndex === 0) {
          let result = `${value} kg`
          if (props.goalWeight) {
            const diff = value - props.goalWeight
            const diffText = diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`
            result += `<br/>Differenz: ${diffText} kg`
          }
          return result
        } else {
          return `Ziel: ${value} kg`
        }
      }
    }
  },
  legend: {
    show: false
  }
}))
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
