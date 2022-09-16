import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationStatus } from "../../redux/slices/notificationSlice";
import { RootState } from "../../redux/store";

const Notification = () => {

    const notification = useSelector((state: RootState) => state.notification)
    const dispatch = useDispatch()

    return (
        <Snackbar 
              open={notification.status} 
              autoHideDuration={4000} 
              onClose={() => dispatch(setNotificationStatus(false))}
          >
            <Alert 
                onClose={() => dispatch(setNotificationStatus(false))} 
                severity={notification.type as AlertColor}
                sx={{ width: '100%' }}
            >
                {notification.message}
            </Alert>
        </Snackbar>
    );
}

export default Notification;