import { useRecoilValue } from "recoil";
import { InvitationStatus, invitationState } from "../../atoms/invitationAtoms";
import pb from "../../lib/pocketbase";
import useInvitations from "../../hooks/useInvitations";

type ModalInviteUserProps = {
    //
};

const ModalMyInvitations: React.FC<ModalInviteUserProps> = () => {
    // const { userId, isLogin } = useRecoilValue(userState);
    const { invitations } = useRecoilValue(invitationState);

    const waitingInvitations = useInvitations("waiting");

    const handleStatusInvitation = async (
        listId: string,
        status: InvitationStatus
    ) => {
        const invitation = invitations.filter(
            (invitation) => invitation.list === listId
        )[0];

        await pb.collection("invitations").update(invitation.id, {
            status: status,
        });
    };

    return (
        <>
            {/* Put this part before </body> tag */}
            <input
                type="checkbox"
                id="myInvitationModal"
                className="modal-toggle"
            />
            <div className="modal">
                <div className="modal-box relative">
                    <label
                        htmlFor="myInvitationModal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                    >
                        ✕
                    </label>
                    <h3 className="text-lg font-bold">Mes invitations</h3>
                    <div className="py-4">
                        <div className="overflow-y-auto max-h-96">
                            {waitingInvitations.length > 0 &&
                                waitingInvitations.map((invitation, index) => (
                                    <div
                                        key={invitation.id}
                                        className="flex flex-col mb-2"
                                    >
                                        {index > 0 && (
                                            <div className="divider"></div>
                                        )}

                                        <div className="flex flex-row justify-between text-left">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">
                                                    {
                                                        invitation.expand.list
                                                            ?.name
                                                    }
                                                </span>
                                                <span className="text-xs">
                                                    {"Envoyé par: " +
                                                        invitation.expand.by
                                                            ?.email}
                                                </span>
                                            </div>
                                            <div className="btn-group btn-group-horizontal">
                                                <button
                                                    className="btn btn-square"
                                                    onClick={() =>
                                                        handleStatusInvitation(
                                                            invitation.list,
                                                            "accept"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="32"
                                                            d="M416 128L192 384l-96-96"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn btn-square btn-ghost"
                                                    onClick={() =>
                                                        handleStatusInvitation(
                                                            invitation.list,
                                                            "reject"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 512 512"
                                                    >
                                                        <path
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="32"
                                                            d="M368 368L144 144"
                                                        ></path>
                                                        <path
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="32"
                                                            d="M368 144L144 368"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {!waitingInvitations.length && (
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-sm">
                                        Vous n'avez pas d'invitation
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalMyInvitations;
