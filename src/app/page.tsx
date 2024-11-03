import P5Canvas from '../components/P5Canvas'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to P5.js Canvas App</h1>
      <P5Canvas />
    </main>
  )
}