'use client'

import { useRouter } from 'next/navigation'

export default function PoolsGrid() {
  const router = useRouter()
  
  const pools = [
    {
      id: 'growth-circle',
      name: 'Growth Circle',
      participants: '5/8',
      progress: '5/8',
      payoutDate: '12-07-2025',
      isClosed: false
    },
    {
      id: 'unity-funds',
      name: 'Unity Funds',
      participants: '5/15 (Closed)',
      progress: '5/15',
      payoutDate: '24-07-2025',
      isClosed: true
    }
  ]

  return (
    <div className="mx-5">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Your Pools</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {pools.map((pool, index) => (
          <div
            key={index}
            onClick={() => router.push(`/pool/${pool.id}`)}
            className="rounded-2xl p-4 hover:opacity-80 transition-opacity flex-shrink-0 w-72 cursor-pointer"
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #d9e3f6'
            }}
          >
            {/* Header with pool name and circular progress */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold mb-3" style={{ fontSize: '16px', color: '#141b34' }}>{pool.name}</h3>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-amber-400 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">+5</span>
                  </div>
                </div>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(5/8) * 100}, 100`}
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{pool.progress}</span>
                </div>
              </div>
            </div>
            
            {/* Pool details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ fontSize: '8px', color: '#7fd1b9' }}>Contribute</span>
                <span className="font-semibold" style={{ fontSize: '8px', color: '#7fd1b9' }}>500/month</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ fontSize: '8px', color: '#eac382' }}>Payout Date</span>
                <span className="font-semibold" style={{ fontSize: '8px', color: '#eac382' }}>{pool.payoutDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
