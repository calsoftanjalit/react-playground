import { Box } from "@mantine/core"
import {Search, Category} from "@/components/product"

export const FilterBar = () => {
  return(
    <Box pb="md" className="w-full flex justify-between">
      <Search />
      <Category />
    </Box>
  )
}
