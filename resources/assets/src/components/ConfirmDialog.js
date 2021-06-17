import React, {
  useContext,
  useState,
  useMemo,
  Fragment,
  useCallback
} from 'react';
import DialogMui from './DialogMui';
import { useAPI } from '../api/api';
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";

const ConfirmDialogContext = React.createContext();
export const useConfirmDialog = () => useContext(ConfirmDialogContext);

export const Provider = ({ children }) => {
  const api = useAPI();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState();
  const [action, setAction] = useState(() => () => null);

  const _delete = useCallback(({ text, endpoint, id, onSuccess, action }) => {
    setOpen(true);
    setText(text);
    const newAction = async () => {
      const res = await api.fetcher('delete', `${endpoint}/${id}`, {
        action
      });
      if (res) {
        onSuccess();
        setOpen(false);

      }
    };
    setAction(() => newAction);
  }, []);

  const bulk = useCallback(({ text, endpoint, ids, onSuccess, action }) => {
    setOpen(true);
    setText(text);
    const newAction = async () => {
      const res = await api.fetcher('post', endpoint, {
        action,
        ids
      });
      if (res) {
        onSuccess();
        setOpen(false);

      }
    };
    setAction(() => newAction);
  }, []);

  const softDelete = args => _delete({ ...args, action: 'delete' });
  const forceDelete = args => _delete({ ...args, action: 'force' });
  const restore = args => _delete({ ...args, action: 'restore' });

  const bulkSoftDelete = args => bulk({ ...args, action: 'delete' });
  const bulkForceDelete = args => bulk({ ...args, action: 'force' });
  const bulkRestore = args => bulk({ ...args, action: 'restore' });

  const value = useMemo(
    () => ({
      softDelete,
      forceDelete,
      restore,
      bulkSoftDelete,
      bulkForceDelete,
      bulkRestore
    }),
    []
  );

  return (
    <Fragment>
      <ConfirmDialogContext.Provider value={value}>
        {children}
      </ConfirmDialogContext.Provider>
      <DialogMui
        open={open}
        onClose={() => setOpen(false)}
        title={text}
        content={
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginBottom: 16
              }}
            >

              <Button
                color="secondary"
                style={{ marginLeft: 10 }}
                onClick={action}
              >
                Đồng ý
              </Button>
              <Button
                color="default"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        }
      />
    </Fragment>
  );
};
