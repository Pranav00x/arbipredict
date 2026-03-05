'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Search } from 'lucide-react'
import { INDEXER_URL } from '@/lib/contracts'

type LeaderboardRow = {
    user_address: string
    total_points: string
}

export default function LeaderboardPage() {
    const [data, setData] = useState<LeaderboardRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${INDEXER_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <div className="flex items-center gap-4 mb-8">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex flex-col items-center justify-center p-0.5 shadow-lg shadow-yellow-500/20">
               <div className="w-full h-full bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-sm">
                   <Trophy className="w-8 h-8 text-yellow-300" />
               </div>
           </div>
           <div>
               <h1 className="text-4xl font-extrabold tracking-tight">Leaderboard</h1>
               <p className="text-gray-400 text-lg">Top predictors & referrers by points.</p>
           </div>
       </div>

       <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
           <div className="p-6 border-b border-white/10 flex justify-between items-center">
               <h3 className="font-bold text-lg">Global Rankings</h3>
               <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="Search address..." className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
               </div>
           </div>
           
           <div className="overflow-x-auto">
               <table className="w-full text-left">
                   <thead className="text-xs uppercase bg-black/20 text-gray-400">
                       <tr>
                           <th className="px-6 py-4 font-semibold tracking-wider">Rank</th>
                           <th className="px-6 py-4 font-semibold tracking-wider">Address</th>
                           <th className="px-6 py-4 font-semibold tracking-wider text-right">Points</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                       {loading ? (
                         <tr><td colSpan={3} className="text-center py-8 text-gray-500 font-medium">Loading rankings...</td></tr>
                       ) : data.length === 0 ? (
                         <tr><td colSpan={3} className="text-center py-8 text-gray-500 font-medium">No top players yet. Be the first!</td></tr>
                       ) : (
                         data.map((row, i) => (
                           <tr key={row.user_address} className="hover:bg-white/[0.02] transition-colors">
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center">
                                       {i === 0 && <Medal className="w-6 h-6 text-yellow-400 mr-2" />}
                                       {i === 1 && <Medal className="w-6 h-6 text-gray-300 mr-2" />}
                                       {i === 2 && <Medal className="w-6 h-6 text-amber-700 mr-2" />}
                                       {i > 2 && <span className="text-gray-400 font-bold ml-2">#{i + 1}</span>}
                                   </div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-300">
                                   {row.user_address}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right">
                                   <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm border border-blue-500/20">
                                     {(Number(row.total_points) / 10**18).toFixed(4)} pts
                                   </span>
                               </td>
                           </tr>
                         ))
                       )}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  )
}
