import { createConfig, http } from 'wagmi'
import * as supportedChains from './chains'

const chainsArray = Object.values(supportedChains)

export const config = createConfig({
	chains: chainsArray as [any, ...any[]], // Wagmi type need tuple
	transports: Object.fromEntries(chainsArray.map(chain => [chain.id, http()])),
})

declare module 'wagmi' {
	interface Register {
		config: typeof config
	}
}
