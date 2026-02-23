'use client'
import { usePuterStore } from '@/lib/puter'
import React, { useEffect } from 'react'

const ParentWrapper = ({children }: {children: React.ReactNode}) => {
    const {init} = usePuterStore()

    useEffect(() => {
        init()
    }, [init])

  return (
    <div>
      {children}
    </div>
  )
}

export default ParentWrapper
