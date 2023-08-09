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
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import useHttp from '../../../Hooks/use-http';

let selectedDriversEmailId = [];
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
    id: 'DriverName',
    numeric: false,
    disablePadding: true,
    label: 'Driver Name',
  },
  {
    id: 'CarModel',
    numeric: true,
    disablePadding: false,
    label: 'Car Details',
  },
  {
    id: 'IsOnline',
    numeric: true,
    disablePadding: false,
    label: 'Online Status',
  },
  {
    id: 'Status',
    numeric: true,
    disablePadding: false,
    label: 'Active Status',
  },
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
        <TableCell padding="none" style={{ width: "2.5%" }} >
          {props.selectedCorporateDetails?.cpName &&
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          }
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold" }}
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
    </TableHead>
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
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
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
          Private Driver List
        </Typography>
      )}

      {selected.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon onClick={() => props.setIsDeleteDialogOpen(true)} />
          </IconButton>
        </Tooltip>
      ) : (
        <Button style={{ width: "150px", height: "35px" }} onClick={() => props.setIsAddDriverClicked(true)} variant="contained" disabled={props.selectedCorporateDetails.cpName ? false : true} >Add Driver</Button>
      )
      }
      {/* ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EditDriver({ privateDrivers, selectedCorporateDetails, dataLoading, setIsApiCall }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('DriverName');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDeletePrivateDrivesClicked, setIsAddDeletePrivateDriversClicked] = useState(false);
  const [isAddEditPrivateDriverOperationSuccess, setIsAddEditPrivateDriverOperationSuccess] = useState(false);
  const [isAddDriverClicked, setIsAddDriverClicked] = useState(false);
  const [allDriversList, setAllDriversList] = useState([]);

  const { isLoading, sendRequest } = useHttp();

  const addDeletePrivateDriverResponse = (data) => {
    // console.log(data);
    setIsAddEditPrivateDriverOperationSuccess(data.Message.toLowerCase() === "success" ? true : "Error");
    if (data.Message.toLowerCase() === "success") setIsApiCall(true);
    setIsAddDeletePrivateDriversClicked(false);
    setSelected([]);
    selectedDriversEmailId = "";
  }

  const driverSelectHandler = (e, driverData) => {
    selectedDriversEmailId = driverData.reduce((acc, curr) => {
      acc.push(curr.DriverEmailID);
      return acc;
    }, []);
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
  // console.log(allDriversList);
  React.useEffect(() => {
    if (isAddDriverClicked) {
      // setIsDeleteDialogOpen(false);
      sendRequest(
        {
          url: "/api/v1/DriverList/GetDriverList",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            roleID: sessionStorage.getItem("roleId"),
            corporateID: "",
          },
        },
        driverListDetails
      );
    }
  }, [sendRequest, isAddDriverClicked]);

  React.useEffect(() => {
    if (isAddDeletePrivateDrivesClicked) {
      opeationType = isDeleteDialogOpen ? "delete" : "add";
      setIsDeleteDialogOpen(false);
      setIsAddDriverClicked(false);
      sendRequest(
        {
          url: "/api/v1/ShuttleTrips/AddEditShuttleDriver",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            roleID: sessionStorage.getItem("roleId"),
            corporateID: selectedCorporateDetails.adminDptId,
            isAdd: isDeleteDialogOpen ? 0 : 1,
            driverEmailID: isDeleteDialogOpen ? selected.join(",") : selectedDriversEmailId.join(","),
          },
        },
        addDeletePrivateDriverResponse
      );
    }
  }, [sendRequest, isAddDeletePrivateDrivesClicked]);

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
    <React.Fragment>
      {isAddEditPrivateDriverOperationSuccess &&
        <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setIsAddEditPrivateDriverOperationSuccess(false)} >
          <Alert onClose={() => setIsAddEditPrivateDriverOperationSuccess(false)} severity={isAddEditPrivateDriverOperationSuccess === true ? "success" : "error"} sx={{ width: '100%', backgroundColor: "rgba(42, 149, 69, 255)" }}>
            {isAddEditPrivateDriverOperationSuccess === true ? `Drivers has been ${opeationType === "add" ? "added" : "removed"} successfully` : "Some Error occured"}
          </Alert>
        </Snackbar>
      }
      {isLoading &&
        <Backdrop
          sx={{ color: 'rgba(34, 137, 203, 255)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <Dialog
        open={isDeleteDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are going to remove the selected drivers from the {selectedCorporateDetails.cpName}. Are you sure you want to remove them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsAddDeletePrivateDriversClicked(true)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddDriverClicked && !isLoading}>
        <DialogTitle>Add Private Driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a driver that you want to add in {selectedCorporateDetails.cpName}
          </DialogContentText>
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          /> */}
          <Autocomplete
            multiple
            id="tags-standard"
            options={allDriversList}
            getOptionLabel={(driver) => driver.DriverName + " - " + driver.Model + "(" + driver.Number + ")"}
            onChange={(e, newValue) => driverSelectHandler(e, newValue)}
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
          <Button onClick={() => {
            selectedDriversEmailId = "";
            setIsAddDriverClicked(false);
          }
          }>Cancel</Button>
          <Button onClick={() => setIsAddDeletePrivateDriversClicked(true)}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar selected={selected} setIsAddDriverClicked={setIsAddDriverClicked} setIsDeleteDialogOpen={setIsDeleteDialogOpen} selectedCorporateDetails={selectedCorporateDetails} />
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
                  <TableRow>
                    <TableCell colSpan={6} align='center' >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
                // <TableBody sx={{ position: "relative", height: "60px" }} >
                //   <CircularProgress sx={{ position: "absolute", left: "50%", top: "10px" }} />
                // </TableBody>
              ) :
                (
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.DriverEmailID);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.DriverEmailID}
                          selected={isItemSelected}
                        // sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="none">
                            {selectedCorporateDetails.cpName &&
                              <Checkbox
                                onClick={(event) => handleClick(event, row.DriverEmailID)}
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            }
                          </TableCell>
                          <TableCell
                            // component="th"
                            sx={{ fontFamily: "Montserrat" }}
                            id={labelId}
                            scope="row"
                            padding="none"
                            align='left'
                          >
                            {row.DriverName}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "Montserrat" }} align="left">{row.Color + " " + row.CarModel + " (" + row.CarNumber + ")"}</TableCell>
                          <TableCell sx={{ fontFamily: "Montserrat" }} align="left">{row.IsOnline === true ? "Online" : "Offline"}</TableCell>
                          <TableCell sx={{ fontFamily: "Montserrat" }} align="left">{row.Status}</TableCell>
                        </TableRow>
                      );
                    })}
                    {visibleRows.length === 0 &&
                      <TableRow>
                        <TableCell sx={{ fontFamily: "Montserrat" }} colSpan={6} align='center' >No Data Available</TableCell>
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
