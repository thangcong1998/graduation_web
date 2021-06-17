import React, { useState } from "react";
import { useFetch } from "../../api/api";
import DataTableChoose from "./DataTableChoose";
import Filter from "../../components/table/Filter";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import Pagination from "../../components/table/Pagination";

const useStyle = makeStyles((theme) => ({
    container: {},
}));

export default function ChooseItem(props) {
    const { items, setItems, endpoint, columns, filterInputs } = props;
    const { t } = useTranslation();
    const classes = useStyle();
    const initialParams = {
        per_page: 50,
        page: 1,
    };
    const [params, setParams] = useState(initialParams);
    const { data: data, revalidate: refetch, loading: loading } = useFetch(
        endpoint && ["get", endpoint, params]
    );

    function onCheck(check) {
        setItems(check);
    }
    return (
        <React.Fragment>
            <div style={{ textAlign: "right" }}>
                <Filter
                    handleChangeParams={setParams}
                    inputs={filterInputs}
                    loading={loading}
                />
            </div>
            <DataTableChoose
                data={data?.data}
                columns={columns}
                checked={items}
                onSort={setParams}
                onCheck={onCheck}
                loading={loading}
            />
            <Pagination
                setParams={setParams}
                count={data?.last_page}
                page={params.page}
                perPage={params.per_page}
                fromTo={[data?.from, data?.to]}
                total={data?.total}
            />
        </React.Fragment>
    );
}
