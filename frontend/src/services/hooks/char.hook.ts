import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCharacter_a } from "services/axios/character.axios";

// character 관련 hook
export const useChar_h = () => {
  const useCharacterA = useCharacter_a();
  const queryClient = useQueryClient();

  const useUpdateChar = () => {
    return useMutation((characterName: string) => useCharacterA.setCharacter(characterName),
      {
        onSuccess: async (res) => {
          if (res.status === 201) queryClient.setQueryData(['char'], await useCharacterA.getCharacter());
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  return { useUpdateChar };
};
