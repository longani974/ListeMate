import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import { Lists } from "../../types/dbPocketbasetypes";
import { useInvitateUser } from "../../hooks/useInvitateUser";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../atoms/userAtoms";
import { listToShow } from "../../atoms/listToShow";
import useInvitations from "../../hooks/useInvitations";

type ModalMyNewListProps = {
    //
};

const ModalMyNewList: React.FC<ModalMyNewListProps> = () => {
    const [listName, setListName] = useState<string>("");
    const [idList, setIdList] = useState<string>("");
    const { userId } = useRecoilValue(userState);

    const setIndexListToShow = useSetRecoilState(listToShow);

    const inviteUser = useInvitateUser();

    const acceptInvitations = useInvitations("accept");

    useEffect(() => {
        const index = acceptInvitations.findIndex(
            (invitation) => invitation.list === idList
        );
        if (index > -1) {
            setIndexListToShow({
                indexListToShow: index,
            });
        }
    }, [acceptInvitations, idList, setIndexListToShow]);

    const createList = async () => {
        // example create data
        const data = {
            name: listName,
            createBy: userId,
        };

        const recordList = await pb.collection("lists").create(data);
        return recordList as Lists;
    };

    const handleAddNewList = async () => {
        // TODO: use react-query
        const list = await createList();
        inviteUser
            .mutateAsync({
                id: list.id,
                email: pb.authStore?.model?.email,
                status: "accept",
            })
            .then(() => {
                setIdList(list.id);
            });
    };

    return (
        <>
            {/* Put this part before </body> tag */}
            <input
                type="checkbox"
                id="myNewListModal"
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="myNewListModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Ma nouvelle liste</h3>
                    <div className="py-4">
                        <form className="flex flex-col">
                            <label className="label">
                                <span className="label-text">
                                    Nom de la liste
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Liste"
                                className="input input-bordered w-100%"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                            />
                        </form>
                        <label
                            htmlFor="myNewListModal"
                            className="btn btn-primary mt-4 w-full"
                            onClick={handleAddNewList}
                        >
                            Ajouter
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalMyNewList;
