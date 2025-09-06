import { useCallback, useMemo, useState } from 'react';

const dialogKeys = [
  'newAppointment',
  'newSurgery',
  'newPostOp',
  'newPatient',
  'newContact',
  'patientJourney',
  'sendExternalMessage',
  'sendDocument',
  'requestExam',
  'shareLink',
];

const makeInitialState = () =>
  dialogKeys.reduce((acc, key) => {
    acc[key] = { open: false, defaults: null };
    return acc;
  }, {});

export function useDialogManager() {
  const [dialogs, setDialogs] = useState(makeInitialState);

  const openDialog = useCallback((name, defaults = null) => {
    setDialogs((prev) => ({
      ...prev,
      [name]: { open: true, defaults },
    }));
  }, []);

  const closeDialog = useCallback((name) => {
    setDialogs((prev) => ({
      ...prev,
      [name]: { open: false, defaults: null },
    }));
  }, []);

  return useMemo(() => ({ dialogs, openDialog, closeDialog }), [dialogs, openDialog, closeDialog]);
}

