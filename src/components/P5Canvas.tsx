'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { put } from '@vercel/blob'
import type p5Types from 'p5'

const ReactP5Wrapper = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function P5Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [lastSaveTime, setLastSaveTime] = useState(Date.now())
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...')

  const sketch = (p5: p5Types) => {
    p5.setup = () => {
      const canvas = p5.createCanvas(400, 400)
      canvasRef.current = canvas.elt as HTMLCanvasElement
      p5.background(255)
      p5.strokeWeight(4)
      p5.stroke(0)
      p5.noFill()

      canvas.touchStarted(() => false)
      canvas.touchMoved(() => false)
      canvas.touchEnded(() => false)

      setDebugInfo('Canvas created')
    }

    p5.draw = () => {
      if (Date.now() - lastSaveTime > 10000) {
        saveCanvasToStorage()
        setLastSaveTime(Date.now())
      }

      if (p5.mouseIsPressed || (p5.touches && p5.touches.length > 0)) {
        let x: number, y: number

        if (p5.touches && p5.touches.length > 0) {
          const touch = p5.touches[0] as p5Types.Vector
          x = touch.x
          y = touch.y
        } else {
          x = p5.mouseX
          y = p5.mouseY
        }

        p5.line(p5.pmouseX, p5.pmouseY, x, y)
        setDebugInfo(`Drawing at (${x}, ${y})`)
      }
    }
  }

  const saveCanvasToStorage = async () => {
    if (canvasRef.current) {
      try {
        const blob = await new Promise<Blob>((resolve) => canvasRef.current!.toBlob(resolve as BlobCallback))
        const filename = `canvas_${Date.now()}.png`
        const { url } = await put(filename, blob, { access: 'public' })
        console.log('Canvas saved to:', url)
        setDebugInfo(`Canvas saved to: ${url}`)
      } catch (error) {
        console.error('Error saving canvas:', error)
        setDebugInfo(`Error saving canvas: ${error}`)
      }
    }
  }

  useEffect(() => {
    return () => {
      saveCanvasToStorage()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Draw on Canvas</h2>
      <ReactP5Wrapper sketch={sketch} />
      <p className="mt-4 text-sm text-gray-600">
        Draw with your mouse or touch. The canvas is automatically saved every 10 seconds.
      </p>
      <p className="mt-2 text-xs text-gray-500">Debug: {debugInfo}</p>
    </div>
  )
}