import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user.service'

export function useUser(id: number | null) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id!),
    enabled: id !== null,
  })
}
