import { type RankingInfo } from '@tanstack/match-sorter-utils'
import { type FilterFn } from '@tanstack/react-table'

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy?: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank?: RankingInfo
    }
}
