'use client'

import { useState } from 'react'
import InviteMembersModal from './InviteMembersModal'

interface PoolDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  poolData: {
    mode: string
    totalPool: string
    contributionAmount: string
    contributionInterval: string
    memberCount: number
  }
}

export default function PoolDetailsModal({ isOpen, onClose, poolData }: PoolDetailsModalProps) {
  const [details, setDetails] = useState({
    poolName: '',
    description: '',
    startDate: '',
    payoutDate: '',
    inviteCode: ''
  })
  const [showInviteModal, setShowInviteModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Pool details:', { ...poolData, ...details })
    setShowInviteModal(true)
  }

  const handleClose = () => {
    setShowInviteModal(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Pool Details</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">What best describes your pool</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pool Name
            </label>
            <input
              type="text"
              placeholder="E.g Savers Rotate"
              value={details.poolName}
              onChange={(e) => setDetails({ ...details, poolName: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pool Description
            </label>
            <textarea
              placeholder="Save now, chop later"
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
              className="input-field h-20 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pool Image
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-primary flex items-center gap-2"
              >
                Choose File
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <span className="text-sm text-gray-500">No file chosen</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Pool Summary</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                This pool has <strong>{poolData.memberCount} Participants</strong>. Each month one member receives <strong>{poolData.contributionAmount}USDC</strong> while every participant contributes <strong>{poolData.contributionAmount} USDC</strong>
              </p>
              <p>
                The cycle continues until all members have received their payout once.
              </p>
              <p>
                By joining, you contribute monthly and become eligible to be selected for a payout.
              </p>
              <div className="mt-3">
                <div className="font-medium text-gray-900 mb-1">Description</div>
                <div className="text-sm text-gray-600">{details.poolName || 'Savers Rotate'}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Create Pool
            </button>
          </div>
        </form>
      </div>
      
      {/* Invite Members Modal */}
      <InviteMembersModal
        isOpen={showInviteModal}
        onClose={handleClose}
        poolName={details.poolName || 'Savers Rotate'}
      />
    </div>
  )
}
