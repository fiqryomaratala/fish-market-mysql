export interface StaffDashboardActivity {
  id: number | string
  user: string
  action: string
  module: string
  time: string
}

export interface StaffUpcomingHarvest {
  id: number | string
  batch_code: string
  fish_type: string
  pond: string
  harvest_date: string
  days_remaining?: number
}

export interface StaffInventoryAlert {
  id: number | string
  feed_name: string
  current_stock: number
  minimum_stock: number
  status: 'Low Stock' | 'Out Of Stock' | string
}

export interface StaffHarvestSchedulePoint {
  week: string
  total: number
}

export interface StaffFeedUsagePoint {
  date: string
  amount: number
}

export interface StaffFishBatchStatusPoint {
  name: 'Stocking' | 'Growing' | 'Ready To Harvest' | 'Harvested' | string
  value: number
}

export interface StaffTask {
  id: string
  title: string
  description: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Attention'
  deadline: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
}

export interface StaffDashboard {
  total_ponds: number
  active_ponds: number
  total_batches: number
  growing_batches: number
  ready_to_harvest: number
  today_feedings: number
  today_harvests: number
  low_stock_feeds: number
  recent_activities: StaffDashboardActivity[]
  upcoming_harvests: StaffUpcomingHarvest[]
  inventory_alerts: StaffInventoryAlert[]
  harvest_schedule: StaffHarvestSchedulePoint[]
  feed_usage_trend: StaffFeedUsagePoint[]
  fish_batch_status: StaffFishBatchStatusPoint[]
  today_tasks: StaffTask[]
}
