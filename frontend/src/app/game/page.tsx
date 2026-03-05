import { BetCard } from '@/components/BetCard'

export default function GamePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Live Markets</h1>
                <p className="text-gray-400 text-lg">Predict ETH price movements and share the prize pool.</p>
            </div>

            <BetCard />
        </div>
    )
}
