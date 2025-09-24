export default function RecentActivities() {
  const activities = [
    {
      icon: '/recent activities.png',
      title: 'You received a payout from Growth Circle',
      date: 'Date: 12-07-2025',
      amount: '400 USDT',
      status: 'Successful',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: '/recent activities.png',
      title: 'Wallet Top Up',
      date: '',
      amount: '50 USDT',
      status: '',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ]

  return (
    <div className="mx-5">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Recent Activities</h2>
      {activities.map((activity, index) => (
        <div key={index}>
          <div className="flex items-center gap-3 py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <img 
                src={activity.icon} 
                alt="Activity" 
                className="w-12 h-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1" style={{ fontSize: '16px' }}>
                {activity.title}
              </div>
              {activity.date && (
                <div className="text-xs text-gray-600">{activity.date}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {activity.amount}
              </div>
              {activity.status && (
                <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded inline-block">
                  {activity.status}
                </div>
              )}
            </div>
          </div>
          {index < activities.length - 1 && (
            <hr className="border-gray-200" />
          )}
        </div>
      ))}
    </div>
  )
}
