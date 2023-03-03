import jsPDF from "jspdf";
import "jspdf-autotable";
import littleImage from "../Assets/Little_logo.jpg"
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
const generatePDF = (data, heading, riderName, driverName) => {
    // initialize jsPDF
    const opt = { orientation: "portrait" }
    const doc = new jsPDF(opt);

    // define the columns we want and their titles
    const tableColumn = heading;
    // define an empty array of rows
    const tableRows = [];

    // for each ticket pass all its data into an array
    let i = 0;
    data.forEach(ticket => {
        const ticketData = [
            ++i,
            ticket.DriverName,
            ticket.TripDate,
            ticket.StartTime,
            ticket.EndTime,
            ticket.RiderName,
            ticket.PickupAddress,
            ticket.PickupAddress,
            // ticket.DropOffAddress,
            ticket.TripDistance,

            // called date-fns to format the date on the ticket
            //   format(new Date(ticket.updated_at), "yyyy-MM-dd")
        ];
        // push each tickcet's info into a row
        tableRows.push(ticketData);
    });


    // startY is basically margin-top
    doc.autoTable(tableColumn, tableRows, { startY: 25 });
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    // ticket title. and margin-top + margin-left
    var img = new Image();
    img.src = littleImage;
    doc.addImage(img, 'jpg', 250, 5, 30, 15);
    doc.text("Trips Data " + (riderName ? `of Rider ${riderName}` : "") + (driverName ? ` from Driver ${driverName}` : ""), 14, 15);
    // we define the name of our PDF file.
    // doc.save(`report_${dateStr}.pdf`);
    doc.save(`report_${sessionStorage.getItem("cpName")}.pdf`);
};

export default generatePDF;