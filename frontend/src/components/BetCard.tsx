'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { ARBIPREDICT_ABI, CONTRACT_ADDRESS } from '@/lib/contracts'
import { TrendingUp, TrendingDown, Clock, Share2, Info } from 'lucide-react'

// Basic UI Components inline for speed or you can use standard shadcn
// We will use standard tailwind classes
export function BetCard() {
  const { isConnected } = useAccount()
  const [ticketAmount, setTicketAmount] = useState('1')

  const { data: currentEpochId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARBIPREDICT_ABI,
    functionName: 'currentEpochId',
  })

  // getEpochData
  const { data: epochData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARBIPREDICT_ABI,
    functionName: 'getEpochData',
    args: currentEpochId ? [currentEpochId] : undefined,
    query: {
      enabled: !!currentEpochId,
    }
  }) as { data: any }

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleBet = (isHigh: boolean) => {
    if (!ticketAmount || Number(ticketAmount) <= 0) return
    const valueStr = (Number(ticketAmount) * 0.0005).toString()

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ARBIPREDICT_ABI,
      functionName: isHigh ? 'buyHighTickets' : 'buyLowTickets',
      args: [BigInt(ticketAmount)],
      value: parseEther(valueStr),
    })
  }

  const shareText = `I just predicted the ETH price for the next 24h on ArbiPredict! 🔮🚀
  Join me and earn rewards on Arbitrum:`

  const farcasterShareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent('https://arbipredict.xyz')}`

  const formatPrice = (priceRaw: bigint) => {
    if (!priceRaw) return '0.00'
    // Chainlink ETH/USD is usually 8 decimals
    return (Number(priceRaw) / 10 ** 8).toFixed(2)
  }

  const bettingCloseTime = epochData ? new Date(Number(epochData.startTimestamp) * 1000 + 12 * 60 * 60 * 1000) : null
  const epochEndTime = epochData ? new Date(Number(epochData.startTimestamp) * 1000 + 24 * 60 * 60 * 1000) : null

  return (
    <div className="w-full max-w-xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="p-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight">Epoch #{currentEpochId ? String(currentEpochId) : '...'}</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
            <Clock className="w-4 h-4" />
            {bettingCloseTime ? bettingCloseTime.toLocaleTimeString() : '...'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 mb-8 flex justify-between items-center text-center">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Start Price</p>
            <div className="text-2xl font-bold font-mono">
              ${epochData ? formatPrice(epochData.bettingPrice) : '...'}
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 mx-4" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Prize Pool</p>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-mono">
              {epochData ? formatEther(epochData.totalHighAmount + epochData.totalLowAmount) : '0.00'} ETH
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm text-gray-400 px-2 font-medium">
            <span>Choose Your Prediction</span>
            <span>0.0005 ETH / Ticket</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleBet(true)}
              disabled={isPending || isConfirming || !isConnected}
              className="flex-1 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 p-4 transition-all hover:bg-green-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <TrendingUp className="w-8 h-8 text-green-400 group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold text-green-400 uppercase tracking-wider">High</span>
                <span className="text-xs text-green-400/60 font-medium">{'>'}{epochData ? formatPrice(epochData.bettingPrice) : '...'}</span>
              </div>
            </button>

            <button
              onClick={() => handleBet(false)}
              disabled={isPending || isConfirming || !isConnected}
              className="flex-1 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-600/10 border border-red-500/30 p-4 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <TrendingDown className="w-8 h-8 text-red-500 group-hover:translate-y-1 transition-transform" />
                <span className="font-bold text-red-500 uppercase tracking-wider">Low</span>
                <span className="text-xs text-red-500/60 font-medium">{'<'}{epochData ? formatPrice(epochData.bettingPrice) : '...'}</span>
              </div>
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
              <button onClick={() => setTicketAmount(String(Math.max(1, Number(ticketAmount) - 1)))} className="px-3 py-1 hover:bg-white/10 rounded-lg">-</button>
              <input
                type="number"
                value={ticketAmount}
                onChange={(e) => setTicketAmount(e.target.value)}
                className="w-16 bg-transparent text-center font-bold text-lg outline-none"
                min="1"
              />
              <button onClick={() => setTicketAmount(String(Number(ticketAmount) + 1))} className="px-3 py-1 hover:bg-white/10 rounded-lg">+</button>
            </div>
          </div>
        </div>

        {isConfirmed && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center font-medium">
            Bet placed successfully!
          </div>
        )}

        <div className="flex justify-center">
          <a
            href={farcasterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-[#8a63d2] hover:text-[#9c78e6] px-4 py-2 rounded-full border border-[#8a63d2]/30 hover:border-[#8a63d2]/60 hover:bg-[#8a63d2]/10 transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share on Farcaster
          </a>
        </div>
      </div>
    </div>
  )
}
