'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { formatEther } from 'viem'
import { ARBIPREDICT_ABI, CONTRACT_ADDRESS } from '@/lib/contracts'
import { Copy, Wallet, LogOut, Award, Gift } from 'lucide-react'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function ProfilePage() {
    const { address, isConnected } = useAccount()
    const { open } = useWeb3Modal()

    const { data: claimableRewards } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ARBIPREDICT_ABI,
        functionName: 'claimableRewards',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    })

    const { data: points } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ARBIPREDICT_ABI,
        functionName: 'points',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    })

    const { writeContract: claimRewards } = useWriteContract()

    const handleClaim = () => {
        claimRewards({
            address: CONTRACT_ADDRESS,
            abi: ARBIPREDICT_ABI,
            functionName: 'claimRewards'
        })
    }

    const referralLink = `https://arbipredict.xyz?refer=${address}`

  const copyRef = () => {
      navigator.clipboard.writeText(referralLink)
      alert("Referral link copied!")
  }

  if (!isConnected) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
            <p className="text-gray-400 mb-8">Connect your wallet to view your tickets, rewards, and stats.</p>
            <button onClick={() => open()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
                Connect Wallet
            </button>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
            
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Wallet className="w-10 h-10 text-white" />
                </div>
                <div>
                     <h2 className="text-2xl font-bold font-mono tracking-tight">{address}</h2>
                     <button onClick={() => open({ view: 'Account' })} className="text-blue-400 hover:text-blue-300 text-sm mt-2 flex items-center gap-1 font-medium">
                         <LogOut className="w-4 h-4" /> Disconnect
                     </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Gift className="w-32 h-32 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-300 mb-2">Claimable Rewards</h3>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-mono mb-6">
                    {claimableRewards ? formatEther(claimableRewards as bigint) : '0.00'} ETH
                </div>
                <button 
                  onClick={handleClaim}
                  disabled={!claimableRewards || (claimableRewards as bigint) === 0n}
                  className="w-full py-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold rounded-xl border border-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Claim Winnings
                </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-600/5 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Award className="w-32 h-32 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-300 mb-2">Total Points</h3>
                <div className="text-4xl font-extrabold text-blue-400 font-mono mb-6">
                    {points ? formatEther(points as bigint) : '0'} Pts
                </div>
                
                <div className="mt-auto">
                   <p className="text-sm text-gray-400 mb-2">Refer friends to earn 10% of their points</p>
                   <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
                       <input 
                         type="text" 
                         readOnly 
                         value={referralLink} 
                         className="flex-1 bg-transparent px-3 text-sm text-gray-300 font-mono outline-none" 
                       />
                       <button onClick={copyRef} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                           <Copy className="w-4 h-4 text-white" />
                       </button>
                   </div>
                </div>
            </div>
        </div>
    </div>
  )
}
