import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FunnelState {
  guestImageResult: string | null
  guestPostId: string | null
  hasUsedFreePass: boolean
  setGuestImageResult: (result: string | null) => void
  setGuestPostId: (postId: string | null) => void
  setHasUsedFreePass: (used: boolean) => void
  clearGuestSession: () => void
}

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set) => ({
      guestImageResult: null,
      guestPostId: null,
      hasUsedFreePass: false,
      setGuestImageResult: (result) => set({ guestImageResult: result }),
      setGuestPostId: (postId) => set({ guestPostId: postId }),
      setHasUsedFreePass: (used) => set({ hasUsedFreePass: used }),
      clearGuestSession: () => set({ guestImageResult: null, guestPostId: null, hasUsedFreePass: false }),
    }),
    {
      name: 'funnel-storage',
    }
  )
)
