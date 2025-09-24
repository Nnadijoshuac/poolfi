'use client'

interface PageHeaderProps {
  title?: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center p-5" style={{ backgroundColor: '#eff6ff' }}>
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="PoolFi Logo"
          width={100}
          height={100}
          className="rounded-lg"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            e.currentTarget.style.display = 'none';
          }}
        />
        {title && (
          <h1 className="ml-4 text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      <button className="text-4xl text-gray-500">≡</button>
    </div>
  )
}
