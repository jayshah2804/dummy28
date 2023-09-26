import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useState } from 'react';

import Loading from "../../Loading/Loading";
import useHttp from '../../Hooks/use-http';
import TripInfoMap from './TripInfoMap';

let driverPath = [];
export default function BookedRidersData(props) {
    const [ridersData, setRidersData] = useState([]);

    const { isLoading, sendRequest } = useHttp();

    const ridersDataResponse = (data) => {
        setRidersData(data.TripdetailList);
        driverPath = data.Triplatlong;
    }

    React.useEffect(() => {
        sendRequest(
            {
                url: "/api/v1/Trips/AllTripsDetails",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    emailID: sessionStorage.getItem("user"),
                    journeyID: props.journeyId,
                    tripType: props.tripType
                },
            },
            ridersDataResponse
        );
    }, [sendRequest]);

    return (
        <React.Fragment>
            {isLoading ?
                <div style={{ marginTop: "-8px" }} >
                    <Loading datatable="true" />
                </div> :
                <React.Fragment>
                    <TripInfoMap RIDER_DATA={ridersData} driverPath={driverPath} />
                    <br />
                    <TableContainer component={Paper} sx={{ fontSize: "10px", maxHeight: 250 }} >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader >
                            <TableHead >
                                <TableRow>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "12%", paddingLeft: "10px", backgroundColor: "rgba(224, 224, 224, 0.9)" }} >Rider Name</TableCell>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "18%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Pickup Location</TableCell>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "18%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Actual Pickup Location</TableCell>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "8%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Pickup Time</TableCell>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "18%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Drop Location</TableCell>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "18%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Actual Drop Location</TableCell>
                                    <TableCell padding='none' align='center' sx={{ fontSize: "12px", width: "8%", backgroundColor: "rgba(224, 224, 224, 0.8)" }} >Drop Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ridersData?.map((rider, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ padding: "4px" }}
                                    >
                                        <TableCell align="center" padding='none' sx={{ fontSize: "12px", paddingLeft: "10px" }} >{rider.RiderName}</TableCell>
                                        <TableCell align='center' padding='none' sx={{ fontSize: "12px" }}  >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "black" }} >
                                                <span>{rider.PickupAddress}</span>
                                                <span style={{ color: "gray", fontSize: "10px" }} >{rider.pickupLatLng ? "( " + rider.pickupLatLng + " )" : ""}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell align='center' padding='none' sx={{ fontSize: "12px" }} >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "black" }} >
                                                <span>{rider.actualPickupAddress ?? "-"}</span>
                                                <span style={{ color: "gray", fontSize: "10px" }} >{rider.actualPickupLatLng ? "( " + rider.actualPickupLatLng + " )" : ""}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" padding='none' sx={{ fontSize: "12px" }} >{props.tripType.toLowerCase() === "shuttle" ? (rider.BoardedOn ?? "-") : (rider.StartedOn ?? "-")}</TableCell>
                                        <TableCell align="center" padding='none' sx={{ fontSize: "12px" }} >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "black" }} >
                                                <span>{rider.DropOffAddress}</span>
                                                <span style={{ color: "gray", fontSize: "10px" }} >{rider.dropoffLatLng ? "( " + rider.dropoffLatLng + " )" : ""}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" padding='none' sx={{ fontSize: "12px" }} >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "black" }} >
                                                <span>{rider.actualDropoffAddress ?? "-"}</span>
                                                <span style={{ color: "gray", fontSize: "10px" }} >{rider.actualDropoffLatLng ? "( " + rider.actualDropoffLatLng + " )" : ""}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="center" padding='none' sx={{ fontSize: "12px" }} >{props.tripType.toLowerCase() === "shuttle" ? (rider.AlightedOn ?? "-") : (rider.EndedOn ?? "-")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </React.Fragment>
            }
        </React.Fragment>
    );
}