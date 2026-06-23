import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import type { UserCreateInput } from '@/types/user'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserCreateInput) => userService.createUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
