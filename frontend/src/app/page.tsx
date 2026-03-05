import Link from 'next/link'
import { ArrowRight, Activity, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
          Predict the Future.<br />Earn the Rewards.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          The premier decentralized prediction game on Arbitrum. Forecast ETH price movements in 24-hour epochs to win directly from the prize pool.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/game"
            className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]"
          >
            Play Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="https://warpcast.com"
            target="_blank"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-lg border border-white/10 transition-all"
          >
            Farcaster Integrations
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
          <p className="text-gray-400">Powered by Arbitrum for near-instant transactions and incredibly low gas fees.</p>
        </div>
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Provably Fair</h3>
          <p className="text-gray-400">100% decentralized. Smart contracts handle the entire prize pool securely.</p>
        </div>
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Chainlink Oracle</h3>
          <p className="text-gray-400">Utilizing Chainlink Price Feeds to ensure accurate and tamper-proof ETH prices.</p>
        </div>
      </div>
    </div>
  )
}
