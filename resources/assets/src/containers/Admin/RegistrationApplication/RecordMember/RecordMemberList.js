import React, { useContext, useState } from "react";
import { useAPI, useFetch } from "../../../../api/api";
import DataTable from "../../../../components/table/DataTable";
import TableToolbar from "../../../../components/table/TableToolbar";
import { useTranslation } from "react-i18next";
import useCheckedColumns from "../../../../common/CheckedColumns";
import RecordMemberInput from "./RecordMemberInput";
import { useDialog } from "../../../../components/Dialog";
import RecordMemberForm from "./RecordMemberForm";
import PaperContainer from "../../../../components/PaperContainer";
import { AuthContext } from "../../../AuthProvider";
import { checkPerm } from "../../../../common/constants";

export default function RecordMemberList(props) {
    const [endpoint, setEndpoint] = useState("/admin/recordParticipant");
    const api = useAPI();
    const { dialog, handleClose } = useDialog();
    const { t } = useTranslation();
    const { perms } = useContext(AuthContext);
    const { competitor_id } = props;

    const initialParams = {
        competitor_id_equal: competitor_id,
    };

    const [params, setParams] = useState(initialParams);

    const { data: data, revalidate: refetch, loading: loading } = useFetch([
        "get",
        `/admin/recordParticipant?competitor_id_equal=${competitor_id}`,
        params,
    ]);

    const { columns, filterInputs } = RecordMemberInput();
    const columnCheck = useCheckedColumns({
        columns: columns,
        filterFields: filterInputs,
    });

    const addRecordParticipant = async (row) => {
        await dialog({
            title: t("record_participant_screen.record_participant_create"),
            content: (
                <RecordMemberForm
                    competitor_id={competitor_id}
                    row={row}
                    close={handleClose}
                    refetch={refetch}
                />
            ),
        });
    };
    const editRecordParticipant = async (row) => {
        await dialog({
            title: t("record_participant_screen.record_participant_info"),
            content: (
                <RecordMemberForm
                    row={row}
                    close={handleClose}
                    refetch={refetch}
                />
            ),
        });
    };
    const [checked, setChecked] = useState([]);

    return (
        <React.Fragment>
            <PaperContainer>
                <TableToolbar
                    addButton={{
                        text: t("record_participant_screen.record_participant"),
                        onClick: () => addRecordParticipant(),
                        display: true,
                    }}
                    columns={columnCheck}
                    endpoint={"/admin/exportRecordParticipant"}
                    endpointDelete={"/admin/deleteListRecordParticipant"}
                    refetch={refetch}
                    actionDelete={"force"}
                    nameFileExport={"RecordParticipant"}
                    checked={checked}
                    setChecked={setChecked}
                    filterInput={filterInputs}
                    handleChangeParams={setParams}
                    loading={loading}
                    showDelete={true}
                />
                <DataTable
                    data={data?.data}
                    columns={columnCheck.columnChecked}
                    actionColumn={{
                        onEdit: {
                            display: true,
                            callback: (row) => editRecordParticipant(row),
                        },
                        onDelete: {
                            display: true,
                            action: "force",
                        },
                        onRestore: true,
                        endpoint: endpoint,
                        trashed: params?.only_trashed,
                        refetch: refetch,
                    }}
                    onClickRow={(row) => editRecordParticipant(row)}
                    onSort={setParams}
                    checked={checked}
                    onCheck={setChecked}
                    loading={loading}
                />
            </PaperContainer>
        </React.Fragment>
    );
}
