import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCharacter_a } from "services/axios/character.axios";

export const useChar_h = () => {
  const useCharacterA = useCharacter_a();
  const queryClient = useQueryClient();

  const useUpdateChar = () => {
    return useMutation((characterName: string) => useCharacterA.setCharacter(characterName),
      {
        onSuccess: async (res) => {
          if (res.status && res.status === 201) queryClient.invalidateQueries(['char']);
          else throw new Error("Internal Server error");
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  const useDeleteChar = () => {
    return useMutation((characterName: string) => useCharacterA.delCharacter(characterName),
      {
        onSuccess: async (res) => {
          if (res.status && res.status === 201) queryClient.invalidateQueries(['char']);
          else throw new Error("Internal Server error");
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  return { useUpdateChar, useDeleteChar };
};
