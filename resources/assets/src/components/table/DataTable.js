import React, { useEffect, useMemo, useState } from "react";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Paper,
    IconButton,
    Checkbox,
    TableFooter,
    Collapse,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import HeightIcon from "@material-ui/icons/Height";
import { makeStyles } from "@material-ui/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import ActionColumn from "./ActionColumn";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useTranslation } from "react-i18next";

const DataTable = React.memo((props) => {
    const classes = useStyle();
    const { t, i18n } = useTranslation();
    const {
        //data
        data,
        //columns
        columns,
        // callback,
        onCheck,
        onSort,
        onClickRow,
        //checkList
        checked,
        disabledCheck,
        //sort
        // sort,
        //empty
        empty,
        //ActionCell
        actionColumn,
        //loading
        loading,
        //style
        style,
        //collapse
        collapse,
        ...others
    } = props;
    const history = useHistory();
    const [sort, setSort] = useState(null);
    const _onSort = (column) => {
        if (sort?.field == column.field) {
            if (sort.type === "desc") {
                setSort(null);
                onSort((pre) => ({
                    ...pre,
                    page: 1,
                    per_page: pre.per_page,
                    sort: undefined,
                }));
            } else {
                setSort((pre) => ({
                    ...pre,
                    type: "desc",
                }));
                onSort((pre) => ({
                    ...pre,
                    page: 1,
                    per_page: pre.per_page,
                    sort: column.field + "|" + "desc",
                }));
            }
        } else {
            setSort({ field: column.field, type: "asc" });
            onSort((pre) => ({
                ...pre,
                page: 1,
                per_page: pre.per_page,
                sort: column.field + "|" + "asc",
            }));
        }
    };
    const [checkIndeterminate, setCheckIndeterminate] = useState(false);
    const [checkedAll, setCheckedAll] = useState(false);
    const ids = data
        ?.filter((e) => (disabledCheck ? !disabledCheck(e) : true))
        ?.map((e) => e.id);
    useEffect(() => {
        const checkindeterminate = () => {
            if (
                data &&
                !(checked?.length === data?.length) &&
                checked?.length > 0
            ) {
                for (let x of data) {
                    if (checked.includes(x.id)) {
                        return true;
                    }
                }
            }
            return false;
        };
        const checkedAllItem = () => {
            if (data && checked?.length > 0) {
                for (let x of data) {
                    if (!checked.includes(x.id)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };
        setCheckedAll(checkedAllItem);
        setCheckIndeterminate(checkindeterminate);
    }, [checked, data]);

    const checkAll = () => {
        return (
            <Checkbox
                className={classes.checkbox}
                checked={checkedAll}
                color="primary"
                onChange={() => {
                    if (data) {
                        if (checkedAll) {
                            onCheck((pre) =>
                                pre.filter((e) => !ids.includes(e))
                            );
                        } else {
                            onCheck((pre) => [
                                ...pre,
                                ...ids.filter((e) => !pre.includes(e)),
                            ]);
                        }
                    }
                }}
                indeterminate={checkIndeterminate}
            />
        );
    };
    const check = (id) =>
        Array.isArray(checked) ? checked.includes(id) : null;
    const checkColumn = (row) => {
        return (
            <Checkbox
                className={classes.checkbox}
                checked={check(row.id)}
                color="primary"
                onChange={() => {
                    if (check(row.id)) {
                        // onCheck(row, "row");
                        onCheck((pre) => pre.filter((e) => e != row?.id));
                    } else {
                        onCheck((pre) => [...pre, row.id]);
                    }
                }}
                disabled={disabledCheck ? disabledCheck(row) : false}
            />
        );
    };
    const TabHead = () => {
        return (
            <TableHead>
                <TableRow {...others.header}>
                    {collapse ? <TableCell></TableCell> : null}
                    {/* Check clolumn */}
                    {checked ? (
                        <TableCell
                            style={{
                                width: 45,
                                padding: 12,
                            }}
                        >
                            {checkAll()}
                        </TableCell>
                    ) : null}
                    {/* Columns */}
                    {columns.map((column) =>
                        column.display ? (
                            <TableCell
                                align="left"
                                {...column.header}
                                key={column.title}
                                className={classes.tableHead}
                                sortDirection={sort?.type ? sort.type : false}
                            >
                                {
                                    //sort
                                    column.sort == true ? (
                                        <TableSortLabel
                                            onClick={() => _onSort(column)}
                                            active={
                                                column.field === sort?.field
                                            }
                                            direction={sort?.type}
                                        >
                                            {typeof column.title === "function"
                                                ? column.title()
                                                : sort === null
                                                ? column.title + "↕"
                                                : column.title}
                                        </TableSortLabel>
                                    ) : typeof column.title === "function" ? (
                                        column.title()
                                    ) : (
                                        column.title
                                    )
                                }
                            </TableCell>
                        ) : null
                    )}
                    {/* Action column */}
                    {actionColumn?.hide ||
                    (!actionColumn?.onEdit &&
                        !actionColumn?.onDelete &&
                        !actionColumn?.render) ? null : (
                        <TableCell
                            style={{
                                textAlign: "right",
                                minWidth: 190,
                            }}
                            {...actionColumn?.props}
                        ></TableCell>
                    )}
                </TableRow>
            </TableHead>
        );
    };

    const _onClickRow = (row, index) => {
        if (onClickRow) {
            if (onClickRow.collapse) {
                toogleCollapse(index);
            } else {
                typeof onClickRow === "function"
                    ? onClickRow(row)
                    : history.push(onClickRow + "/" + row?.id);
            }
        }
    };

    const _empty = () => {
        if (empty) {
            return typeof empty === "function" ? empty() : empty;
        }
        return t("message.empty");
    };

    const [open, setOpen] = useState();
    const toogleCollapse = (index) => {
        if (open != index) {
            setOpen(index);
        } else {
            setOpen();
        }
    };
    const TabBody = () => {
        return (
            <TableBody {...others.body}>
                {data?.length > 0 && !loading ? (
                    data?.map((row, index) => (
                        <React.Fragment key={index}>
                            <TableRow
                                key={index}
                                className={`${classes.row} ${
                                    index % 2 == 0 ? classes.row2 : classes.row1
                                }`}
                            >
                                {/* collapse */}
                                {collapse ? (
                                    <TableCell style={{ width: "62px" }}>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() =>
                                                toogleCollapse(index)
                                            }
                                        >
                                            {open === index ? (
                                                <KeyboardArrowUpIcon />
                                            ) : (
                                                <KeyboardArrowDownIcon />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                ) : null}
                                {/* checked */}
                                {checked ? (
                                    <TableCell className={classes.cell}>
                                        {checkColumn(row)}
                                    </TableCell>
                                ) : null}
                                {/* columns */}
                                {columns.map((column, i) =>
                                    column.display ? (
                                        <TableCell
                                            className={classes.cell}
                                            align="left"
                                            {...column.props}
                                            component="td"
                                            scope="row"
                                            key={i}
                                            onClick={() =>
                                                column.props?.onClick
                                                    ? column.props?.onClick(
                                                          row,
                                                          index
                                                      )
                                                    : _onClickRow(row, index)
                                            }
                                        >
                                            {column.render
                                                ? column.render(row, index)
                                                : row[column.field]}
                                        </TableCell>
                                    ) : null
                                )}
                                {actionColumn?.hide ||
                                (!actionColumn?.onEdit &&
                                    !actionColumn?.onDelete &&
                                    !actionColumn?.render) ? null : (
                                    <ActionColumn
                                        row={row}
                                        actionColumn={actionColumn}
                                        onCheck={onCheck}
                                    />
                                )}
                            </TableRow>
                            {collapse && (
                                <TableRow>
                                    <TableCell
                                        className={classes.cell}
                                        style={{
                                            paddingBottom: 0,
                                            paddingTop: 0,
                                        }}
                                        colSpan={columns.length + 3}
                                    >
                                        <Collapse
                                            in={open === index}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            {collapse(row)}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            className={classes.empty}
                            colSpan={columns?.length + 2}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                    className={classes.loading}
                                />
                            ) : (
                                _empty()
                            )}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        );
    };

    const TabFooter = () => {
        return (
            <TableFooter {...others.footer}>
                <TableRow></TableRow>
            </TableFooter>
        );
    };

    const CoreTable = () => {
        return (
            <TableContainer
                style={{ borderRadius: 0 }}
                component={Paper}
                elevation={0}
                {...others}
            >
                <Table className={classes.table}>
                    <TabHead />
                    <TabBody />
                    <TabFooter />
                </Table>
            </TableContainer>
        );
    };

    return <CoreTable />;
});

export default DataTable;

const useStyle = makeStyles((theme) => ({
    checkbox: {
        padding: 0,
    },
    empty: {
        width: "100%",
        textAlign: "center",
        fontSize: "1rem",
    },
    row: {
        "&:hover": {
            background: "#f0f8ff",
        },
    },
    tableHead: {
        fontSize: "1rem",
        fontWeight: "bold",
        padding: 12,
    },
    cell: {
        fontSize: "1rem",
        padding: 12,
    },
    row1: {},
    row2: {
        background: "#f5f5f563",
    },
}));
