import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import Autocomplete from '@mui/material/Autocomplete';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { visuallyHidden } from '@mui/utils';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import useHttp from '../../../Hooks/use-http';
import BookedRidersData from './BookedRidersData';

let selectedDriverEmailId = "";
let changedDateTime = {
  date: "",
  time: ""
}
let dateTimeChangeFlag = 0;
let routeId = "";
let lineId = "";
let opeationType = "";
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'RouteID',
    numeric: false,
    disablePadding: true,
    label: 'Route Id',
    width: '12%'
  },
  {
    id: 'RouteName',
    numeric: true,
    disablePadding: false,
    label: 'Route Name',
    width: '17%'
  },
  {
    id: 'RouteType',
    numeric: true,
    disablePadding: false,
    label: 'Route Type',
    width: '10%'
  },
  {
    id: 'ShuttleStartTime',
    numeric: true,
    disablePadding: false,
    label: 'Date & Time',
    width: '18%'
  },
  {
    id: 'DriverEMailID',
    numeric: true,
    disablePadding: false,
    label: 'Assigned Driver',
    width: '16%'
  },
  {
    id: 'TripStatus',
    numeric: true,
    disablePadding: false,
    label: 'Trip Status',
    width: '10%'
  },
  // {
  //   id: 'DriverEMailID',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Occupied | Total Seats',
  // },
  // {
  //   id: 'FirstStopName',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Route Location',
  //   width: '23%'
  // },
  // {
  //   id: 'DriverEMailID',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'End Location',
  // },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="none" style={{ width: "5%" }} >
        </TableCell>
        {headCells.map((headCell, i) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold", width: headCell.width, padding: "5px 0" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead >
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { selected } = props;

  return (
    <Toolbar
      sx={{
        // pl: { sm: 2 },
        // pr: { xs: 1, sm: 1 },
        // ...(selected.length > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        // }),
        minHeight: "50px"
      }}
      variant='dense'
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
        </Typography>
      )}

      {selected.length > 0 ? (
        <React.Fragment>
          <Tooltip title="Edit">
            <IconButton>
              <EditIcon onClick={() => props.setIsEditIconClicked(true)} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton>
              <CancelIcon onClick={() => props.setIsCancelBookingDialogOpen(true)} />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ) :
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: "flex", gap: "30px" }} >
            <DatePicker
              label="Start Date"
              value={props.startDateValue}
              slotProps={{ textField: { variant: "standard", readOnly: true, inputProps: { sx: { padding: "2px", fontSize: "14px" } } } }}
              onChange={(newValue) => {
                props.setIsRefreshBookingList(true);
                props.setStartDateValue(newValue)
              }}
            />
            <DatePicker
              label="End Date"
              value={props.endDateValue}
              slotProps={{ textField: { variant: "standard", readOnly: true, inputProps: { sx: { padding: "2px", fontSize: "14px" } } } }}
              onChange={(newValue) => {
                props.setIsRefreshBookingList(true);
                props.setEndDateValue(newValue)
              }}
            />
          </div>
        </LocalizationProvider>
      }
      {/* : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon onClick={() => props.setIsFilterIconClicked(prev => !prev)} />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar >
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EditDriver({ privateDrivers, selectedCorporateDetails, dataLoading, setIsRefreshBookingList, driversList, setStartDateValue, setEndDateValue, startDateValue, endDateValue }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('DriverName');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isCancelBookingDialogOpen, setIsCancelBookingDialogOpen] = useState(false);
  const [isEditRouteBookingClicked, setIsEditRouteBookingClicked] = useState(false);
  const [isEditRouteBookingResponse, setIsEditRouteBookingResponse] = useState(false);
  const [isAddDriverClicked, setIsAddDriverClicked] = useState(false);
  const [allDriversList, setAllDriversList] = useState([]);
  const [isFillterIconClicked, setIsFilterIconClicked] = useState(false);
  const [isEditIconClicked, setIsEditIconClicked] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState("");
  const [isTimeEdited, setIsTimeEdited] = useState(false);
  const [isConfirmCancelBookingClicked, setIsConfirmCancelBookingClicked] = useState(false);
  const [isCancelBookingResponse, setIsCancelBookingResponse] = useState(false);

  const { isLoading, sendRequest } = useHttp();

  // const driverSelectHandler = (e, driverData) => {
  //   selectedDriversEmailId = driverData.reduce((acc, curr) => {
  //     acc.push(curr.DriverEmailID);
  //     return acc;
  //   }, []);
  // }

  const editRouteBookingResponse = (data) => {
    if (data.Message.toLowerCase() === "success") {
      setIsRefreshBookingList(true);
      setIsEditRouteBookingResponse({ status: "success", message: "Booking Edited Successfully" });
      selectedDriverEmailId = "";
      setSelected([]);
    }
    else setIsEditRouteBookingResponse({ status: "error", message: data.SystemMessage });
    setIsEditRouteBookingClicked(false);
    debugger;
  }

  const driverListDetails = (data) => {
    if (data?.DriverList) {
      setAllDriversList(data.DriverList
        //   data.DriverList.map(driver => {
        //   return {
        //     details: driver.DriverName + " - " + driver.Model + "(" + driver.Number + ")",
        //     emailId: driver.DriverEmailID
        //   }
        // }
        // )
      );
    }
  }

  const bookingCancelBookingResponse = (data) => {
    if (data.Message.toLowerCase() === "success") {
      setIsRefreshBookingList(true);
      setIsCancelBookingResponse({ status: "success", message: "Booking Cancelled Successfully" });
      selectedDriverEmailId = "";
      setSelected([]);
    }
    else setIsCancelBookingResponse({ status: "error", message: data.SystemMessage });
    setIsConfirmCancelBookingClicked(false);
  }

  const bookingTimeChangeHandler = (val, currentRouteId, currentlineId) => {
    dateTimeChangeFlag = 2;
    console.log(dateTimeChangeFlag, "accept");
    selectedDriverEmailId = "";
    changedDateTime = {};
    changedDateTime.date = `${val.$d.getFullYear()}/${val.$d.getMonth() + 1}/${val.$d.getDate()}`;
    changedDateTime.time = `${val.$d.getHours()}:${val.$d.getMinutes()}:${val.$d.getSeconds()}`;
    routeId = currentRouteId;
    lineId = currentlineId;
    setIsTimeEdited(true);
    // setIsEditRouteBookingClicked(true);
  }
  // console.log(allDriversList);
  React.useEffect(() => {
    let editbookings = "";
    if (selectedDriverEmailId) {
      if (selected.length > 0)
        editbookings = selected?.reduce((acc, cur) => {
          acc.push({
            RouteID: cur.split(" ")[0],
            LineID: cur.split(" ")[1],
            DriverEmailID: selectedDriverEmailId,
            ShuttleTime: ""
          });
          return acc;
        }, []);
      else {
        editbookings = [{
          RouteID: routeId,
          LineID: lineId,
          DriverEmailID: selectedDriverEmailId,
          ShuttleTime: ""
        }];
      }
    } else {
      editbookings = [{
        RouteID: routeId,
        LineID: lineId,
        DriverEmailID: "",
        ShuttleTime: changedDateTime.date + " " + changedDateTime.time
      }];
    }
    if (isEditRouteBookingClicked) {
      sendRequest(
        {
          url: "/api/v1/ShuttleBooking/EditRouteBooking",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            editbookings: JSON.stringify(editbookings)
          },
        },
        editRouteBookingResponse
      );
    }
  }, [sendRequest, isEditRouteBookingClicked]);

  React.useEffect(() => {
    if (isConfirmCancelBookingClicked) {
      let cancelledbookings = selected.reduce((acc, cur) => {
        acc.push({
          RouteID: cur.split(" ")[0],
          LineID: cur.split(" ")[1]
        });
        return acc;
      }, []);
      sendRequest(
        {
          url: "/api/v1/ShuttleBooking/CancelledRouteBooking",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            cancelledbookings: JSON.stringify(cancelledbookings),
            riderTripID: "",
          },
        },
        bookingCancelBookingResponse
      );
    }
  }, [sendRequest, isConfirmCancelBookingClicked]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = privateDrivers.map((n) => n.DriverEmailID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClick = (event, name) => {
    // debugger;
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - privateDrivers.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(privateDrivers, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, privateDrivers]
  );

  return (
    // backgroundColor: "rgba(42, 149, 69, 255)"
    <React.Fragment>
      {(isEditRouteBookingResponse || isCancelBookingResponse) &&
        <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => isEditRouteBookingResponse ? setIsEditRouteBookingResponse(false) : setIsCancelBookingResponse(false)} >
          <Alert onClose={() => isEditRouteBookingResponse ? setIsEditRouteBookingResponse(false) : setIsCancelBookingResponse(false)} severity={isEditRouteBookingResponse ? isEditRouteBookingResponse.status : isCancelBookingResponse.status} sx={{ width: '100%' }}>
            {isEditRouteBookingResponse?.status ? isEditRouteBookingResponse.message : isCancelBookingResponse.message}
          </Alert>
        </Snackbar>
      }
      {isLoading &&
        <Backdrop
          sx={{ color: 'rgba(34, 137, 203, 255)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <Dialog
        open={isEditIconClicked}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Alert
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select a driver that you want to add for booking
          </DialogContentText>
          <Autocomplete
            id="tags-standard"
            options={driversList}
            getOptionLabel={(driver) => driver.driverName + " (" + driver.driverCarModel + ")"}
            onChange={(e, newValue) => selectedDriverEmailId = newValue.driverEmailId}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Driver Name"
                placeholder="Search Driver"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditIconClicked(false)}>Cancel</Button>
          <Button onClick={() => {
            changedDateTime = "";
            setIsEditIconClicked(false);
            setIsEditRouteBookingClicked(true);
          }} autoFocus>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isTimeEdited}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the timing?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            dateTimeChangeFlag = 0;
            setIsTimeEdited(false);
          }
          }>Cancel</Button>
          <Button onClick={() => {
            setIsTimeEdited(false);
            dateTimeChangeFlag = 0;
            setIsEditRouteBookingClicked(true);
          }}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isCancelBookingDialogOpen}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the bookings for the selected dates?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsCancelBookingDialogOpen(false);
          }
          }>Cancel</Button>
          <Button onClick={() => {
            setIsConfirmCancelBookingClicked(true);
            setIsCancelBookingDialogOpen(false);
          }}>Yes</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '97%', margin: "1.5%", borderRadius: "10px" }}>
        <Paper sx={{ width: '100%', mb: 2, borderRadius: "10px" }}>
          <EnhancedTableToolbar setIsRefreshBookingList={setIsRefreshBookingList} setStartDateValue={setStartDateValue} setEndDateValue={setEndDateValue} startDateValue={startDateValue} endDateValue={endDateValue} setIsEditIconClicked={setIsEditIconClicked} selected={selected} setIsFilterIconClicked={setIsFilterIconClicked} setIsAddDriverClicked={setIsAddDriverClicked} setIsCancelBookingDialogOpen={setIsCancelBookingDialogOpen} selectedCorporateDetails={selectedCorporateDetails} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750, fontFamily: "Montserrat" }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={privateDrivers.length}
                selectedCorporateDetails={selectedCorporateDetails}
              />
              {dataLoading ? (
                <TableBody>
                  <TableRow padding="none" >
                    <TableCell colSpan={8} align='center' padding='none' >
                      <CircularProgress size="2rem" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) :
                (
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.RouteID + " " + row.LineID);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <React.Fragment>
                          <TableRow
                            hover
                            // role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (!dateTimeChangeFlag) {
                                console.log(dateTimeChangeFlag, "rowClick");
                                setExpandedPanel(expandedPanel === (row.RouteID + " " + row.LineID) ? "" : (row.RouteID + " " + row.LineID))
                              }
                            }}
                          >
                            <TableCell padding="none" >
                              <div style={{ display: "flex" }} >
                                <div style={{ width: "50%" }} >
                                  {expandedPanel === (row.RouteID + " " + row.LineID) ?
                                    <ExpandLessIcon /> : <ExpandMoreIcon />
                                  }
                                </div>
                                <div style={{ width: "50%" }}>
                                  {row.tripStatusId < 4 &&
                                    <Checkbox
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleClick(event, row.RouteID + " " + row.LineID);
                                      }}
                                      color="primary"
                                      sx={{ padding: "0" }}
                                      checked={isItemSelected}
                                      inputProps={{
                                        'aria-labelledby': labelId,
                                      }}
                                    />
                                  }
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              // component="th"
                              sx={{ fontFamily: "Montserrat" }}
                              id={labelId}
                              scope="row"
                              padding="none"
                              align='left'
                            >
                              {row.RouteID}
                            </TableCell>
                            <TableCell align="left" padding="none" >{row.RouteName}</TableCell>
                            <TableCell align="left" padding="none" >{row.RouteType.toLowerCase() === "picking" ? "Pickup" : "Drop"}</TableCell>
                            <TableCell align="left" padding="none" >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  slots={{ openPickerIcon: EditIcon }}
                                  slotProps={{ textField: { variant: 'standard', readOnly: true, InputProps: { disableUnderline: true, sx: { fontSize: "0.875rem", button: { marginLeft: "-30px", display: +row.tripStatusId >= 4 && "none" }, svg: { color: "rgba(248, 94, 38,0.8)", fontSize: "22px", display: +row.tripStatusId >= 4 && "none" } } } } }}
                                  value={dayjs(row.ShuttleStartTime)}
                                  onOpen={() => dateTimeChangeFlag = 1}
                                  onClose={() => dateTimeChangeFlag = (dateTimeChangeFlag === 2 ? 1 : 0)}
                                  onAccept={(val) => bookingTimeChangeHandler(val, row.RouteID, row.LineID)}
                                />
                              </LocalizationProvider>
                            </TableCell>
                            {/* <TableCell sx={{ fontFamily: "Montserrat" }} align="left">{row.ShuttleStartTime.replace("T", " ")}</TableCell> */}
                            <TableCell padding="none" align="left">
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }} >
                                <span>{row.DriverName + " (" + row.Model + ")"}</span>
                                {+row.tripStatusId < 4 &&
                                  <EditIcon style={{ color: "rgba(248, 94, 38,0.8)", fontSize: "22px" }} onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditIconClicked(true);
                                    routeId = row.RouteID;
                                    lineId = row.LineID;
                                  }} />
                                }
                              </div>
                            </TableCell>
                            <TableCell padding='none' >{row.TripStatus ?? "-"}</TableCell>
                          </TableRow>
                          {expandedPanel === (row.RouteID + " " + row.LineID) &&
                            <TableRow>
                              <TableCell colSpan={7} align='center' >
                                <BookedRidersData routeId={row.RouteID} lineId={row.LineID} tripStatusId={row.tripStatusId} bookingCancelBookingResponse={bookingCancelBookingResponse} />
                              </TableCell>
                            </TableRow>
                          }
                        </React.Fragment>
                      );
                    })}
                    {visibleRows.length === 0 &&
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Montserrat" }} colSpan={7} align='center' >No Data Available</TableCell>
                      </TableRow>
                    }
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                )
              }
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={privateDrivers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </React.Fragment >
  );
}
