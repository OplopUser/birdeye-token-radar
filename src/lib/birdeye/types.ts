export type BirdeyeToken = {
  address: string
  symbol?: string
  name?: string
  logoURI?: string
  liquidity?: number
  volume24hUSD?: number
  priceChange24hPercent?: number
  createdAt?: string | number
}

export type TokenSecurity = {
  address: string
  isMintable?: boolean
  isFreezable?: boolean
  ownerAddress?: string | null
  top10HolderPercent?: number | null
  raw: unknown
}
