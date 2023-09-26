import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

import Loading from "../../../Loading/Loading";
import useHttp from '../../../Hooks/use-http';

export default function BookedRidersData(props) {
    const [ridersData, setRidersData] = useState([]);
    const [riderBookingCancel, setRiderBookingCancel] = useState(false);
    const [isRefereshRiderDetails, setIsRefereshRiderDetails] = useState();
    const [isCancelBookingResponse, setIsCancelBookingResponse] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const { isLoading, sendRequest } = useHttp();

    const bookedRidersData = (data) => {
        setRidersData(data.BookedRouteList);
        setIsRefereshRiderDetails(false);
    }

    const riderCancelBookingResponse = (data) => {
        if (data.Message.toLowerCase() === "success") {
            setIsRefereshRiderDetails(true);
            setIsCancelBookingResponse({ status: "success", message: "Booking Cancelled Successfully" });
        }
        else setIsCancelBookingResponse({ status: "error", message: data.SystemMessage });
        setRiderBookingCancel(false);
        setIsDataLoading(false);
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    React.useEffect(() => {
        if (riderBookingCancel)
            sendRequest(
                {
                    url: "/api/v1/ShuttleBooking/CancelledRouteBooking",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        emailID: sessionStorage.getItem("user"),
                        cancelledbookings: JSON.stringify([{ RouteID: "", LineID: "" }]),
                        riderTripID: riderBookingCancel,
                    },
                },
                riderCancelBookingResponse
            );
    }, [sendRequest, riderBookingCancel]);

    React.useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/ShuttleBooking/GetBookedRiderDetails",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    lineID: props.lineId,
                    routeID: props.routeId
                },
            },
            bookedRidersData
        );
    }, [sendRequest, isRefereshRiderDetails]);

    return (
        <React.Fragment>
            {isDataLoading &&
                <Backdrop
                    sx={{ color: 'rgba(34, 137, 203, 255)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isDataLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            {isCancelBookingResponse &&
                <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setIsCancelBookingResponse(false)} >
                    <Alert onClose={() => setIsCancelBookingResponse(false)} severity={isCancelBookingResponse.status} sx={{ width: '100%' }}>
                        {isCancelBookingResponse.message}
                    </Alert>
                </Snackbar>
            }
            {isLoading ?
                <div style={{ marginTop: "-8px" }} >
                    <Loading datatable="true" />
                </div> :
                <TableContainer component={Paper} sx={{ fontSize: "10px", maxHeight: 250 }} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader >
                        <TableHead >
                            <TableRow>
                                <TableCell padding='none' align='left' sx={{ fontSize: "12px", width: "12%", paddingLeft: "10px", backgroundColor: "rgba(224, 224, 224, 0.9)" }} >Rider Name</TableCell>
                                <TableCell padding='none' align='left' sx={{ fontSize: "12px", width: "20%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Pickup Stop</TableCell>
                                <TableCell padding='none' align='left' sx={{ fontSize: "12px", width: "20%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Drop Stop</TableCell>
                                <TableCell padding='none' align='left' sx={{ fontSize: "12px", width: "10%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Pickup Stop Number</TableCell>
                                <TableCell padding='none' align='left' sx={{ fontSize: "12px", width: "10%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Drop Stop Number</TableCell>
                                <TableCell padding='none' align='left' sx={{ fontSize: "12px", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ridersData?.map((rider) => (
                                <TableRow
                                    key={rider.RiderTripID}
                                    sx={{ padding: "4px" }}
                                >
                                    <TableCell align="left" padding='none' sx={{ fontSize: "12px", paddingLeft: "10px" }} >{rider.RiderName}</TableCell>
                                    <TableCell align='left' padding='none' sx={{ fontSize: "12px" }}  >{rider.PickupAddress}</TableCell>
                                    <TableCell align="left" padding='none' sx={{ fontSize: "12px" }} >{rider.DropOffAddress}</TableCell>
                                    <TableCell align="left" padding='none' sx={{ fontSize: "12px" }} >{rider.PickupStopNumber + 1}</TableCell>
                                    <TableCell align="left" padding='none' sx={{ fontSize: "12px" }} >{rider.DropOffStopNumber + 1}</TableCell>
                                    <TableCell align="left" padding='none' sx={{ fontSize: "12px" }} >
                                        {rider.tripStatus === "1" ?
                                            <span>Cancelled</span> :
                                            <Button disabled={props.tripStatusId < 4 ? false : true} variant="outlined" onClick={() => {
                                                setRiderBookingCancel(rider.RiderTripID);
                                                setIsDataLoading(true);
                                            }} color="error" sx={{ fontSize: "12px", padding: "5px" }} >
                                                Cancel Booking
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </React.Fragment>
    );
}