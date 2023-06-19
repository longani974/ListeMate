import { useMutation } from "@tanstack/react-query";
import pb from "../lib/pocketbase";
import { userState } from "../atoms/userAtoms";
import { useRecoilValue } from "recoil";
// import { useListChangedSignaler } from "./useListChangedSignaler";
// import { Article } from "../types/dbPocketbasetypes";

// type ArticleModifier = {
//     article: Article | null;
//     listId: string;
// };
interface List {
    id: string;
    invited: string[];
    participants: string[];
    email: string;
}

export const useInvitateUser = (list: List) => {
    const { userId } = useRecoilValue(userState);

    const updateList = async () => {
        const record = await pb.collection('users').getList(1, 20, {
            filter: `email = "${list.email}"`
        })

        if (record.items.length === 0) {
            return console.log("Pas d'utilisateur avec cette email")
        }

        if (list.invited.includes(record.items[0].id)) {
            return console.log("Utilisateur déjà invité")
        }

        if (record.items[0].id === userId) {
            return console.log("Vous ne pouvez pas vous inviter vous même")
        }

        if (list.participants.includes(record.items[0].id)) {
            return console.log("Utilisateur déjà dans la liste")
        }
            
        return await pb.collection("lists").update(list.id, {
            ...list, invited: [...list.invited, record.items[0].id]
        });
    };

    // const signalListChanged = useListChangedSignaler(listId);

    const mutateList = useMutation(updateList, {
        onSuccess: () => {
            console.log("updateList");
            // signalListChanged();
        },
        onError: (e) => {
            console.log("error");
            console.log(e);
        },
        onSettled: () => {
            console.log("onSettled");
        },
    });

    return mutateList;
};