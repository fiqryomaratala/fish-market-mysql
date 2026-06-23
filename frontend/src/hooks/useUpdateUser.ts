import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import type { UserUpdateInput } from '@/types/user'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserUpdateInput }) =>
      userService.updateUser(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      void queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}
