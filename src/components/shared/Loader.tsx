import { RefreshCw } from 'lucide-react'
import React from 'react'


const Loader = () => {
  return (
    <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
  )
}

export default Loader