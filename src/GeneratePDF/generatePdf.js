import jsPDF from "jspdf";
import "jspdf-autotable";
import littleImage from "../Assets/Little_logo.jpg"
// import openSans from "../Assets/OpenSans-Regular.ttf";
import openSans from "../Assets/OpenSans-Medium.ttf";
import "./generatePdf.css";
import frame1 from "../Assets/frame1.png";
import frame2 from "../Assets/frame2.png";
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
let pageCount = 0;
const tripHeading = [
    "Sn.",
    "Driver Name",
    "Trip Date",
    "Start Time",
    "End Time",
    "Riders",
    "Pickup Location",
    "Drop Location",
    "Trip km",
]

const shiftHeading = [
    "Sn.",
    "Driver Name",
    "Shift Start Time",
    "Shift End Time",
    "Shift Started On",
    "Shift Ended On"
]

const tripRows = ["DriverName", "TripDate", "StartTime", "EndTime", "RiderName", "ActualPickupName", "ActualDropOffName", "TripDistance"];
const shiftRows = ["DriverName", "StartTime", "EndTime", "ShiftStartedOn", "ShiftEndedOn"];

let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const generatePDF = (startDate, endDate, data, riderName, driverName, tripsCount, kmCount, cpLogo, cpAddress, addressWidth, isShift) => {

    const opt = { orientation: "portrait", unit: "px", compressPdf: true };
    const doc = new jsPDF(opt);
    let current_date_time = new Date().getMonth() + 1 + "/" + new Date().getDate() + "/" + new Date().getFullYear() + " | " + (new Date().getHours() > 12 ? new Date().getHours() - 12 + ":" + (new Date().getMinutes().toString().length === 1 ? "0" + new Date().getMinutes() : new Date().getMinutes()) + " pm" : new Date().getHours() + ":" + (new Date().getMinutes().toString().length === 1 ? "0" + new Date().getMinutes() : new Date().getMinutes()) + " am");
    pageCount = 0;
    let tableColumn = [];
    // if (riderName) {
    //     for (let i = 0; i < heading.length; i++) {
    //         if(heading[i] !== "Riders") tableColumn.push(heading[i]);
    //     }
    // }
    tableColumn = isShift == "1" ? shiftHeading : tripHeading;
    // define an empty array of rows
    const tableRows = [];

    // for each ticket pass all its data into an array
    let i = 0;
    data.forEach(ticket => {
        let ticketData = [];
        debugger;
        if (isShift == "1")
            ticketData = [
                ++i,
                ticket.DriverName,
                ticket.StartTime,
                ticket.EndTime,
                ticket.ShiftStartedOn,
                ticket.ShiftEndedOn
            ];
        else
            ticketData = [
                ++i,
                ticket.DriverName,
                ticket.TripDate,
                ticket.StartTime,
                ticket.EndTime,
                ticket.RiderName,
                ticket.ActualPickupName ? ticket.ActualPickupName : ticket.PickupAddress,
                ticket.ActualDropOffName ? ticket.ActualDropOffName : ticket.DropOffAddress,
                ticket.TripDistance,
            ];
        tableRows.push(ticketData);
    });

    doc.addFont(openSans, 'openSans', 'normal');

    // doc.setFont('poppins'); // set font
    doc.setFont('openSans'); // set font

    if (isShift != "1") {
        doc.setDrawColor(255, 255, 255);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(75, 58, 110, 40, 20, 20, "FD");
        doc.addImage(frame2, 'png', 80, 63, 30, 30);
        doc.setFontSize(15);

        doc.setTextColor(34, 137, 203);
        doc.text(`${tripsCount}`, 120, 75);
        doc.setFontSize(11);
        doc.setTextColor(54, 69, 79);
        doc.text("Trips", 120, 87);

        doc.setDrawColor(255, 255, 255);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(250, 58, 110, 40, 20, 20, "FD");
        doc.addImage(frame1, 'png', 255, 63, 30, 30);
        doc.setFontSize(15);
        doc.setTextColor(34, 137, 203);
        doc.text(`${kmCount}`, 295, 75);
        doc.setFontSize(11);
        doc.setTextColor(54, 69, 79);
        doc.text("Kilometers", 295, 87);
    }

    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.autoTable(tableColumn, tableRows, {
        didDrawPage:
            function (data) {
                doc.setFont('openSans'); // set font
                doc.setFontSize(8);
                doc.text(`${isShift ? "Shifts Statement" : "Trips Statement"}` + (riderName ? `of rider ${riderName}` : "") +
                    (driverName ? ` from driver ${driverName}` : "") +
                    (startDate ?
                        ` from ${startDate.split("-")[2] + " " + months[+startDate.split("-")[1] - 1] + " " + startDate.split("-")[0]} to ${endDate.split("-")[2] + " " + months[+endDate.split("-")[1] - 1] + " " + endDate.split("-")[0]}` :
                        ` till ${new Date().getDate() + " " + months[new Date().getMonth()] + " " + new Date().getFullYear()}`),
                    30, isShift != "1" ? (pageCount === 0 ? 115 : 65) : (75));
                doc.addImage(cpLogo, 'png', 190, 10, 70, 32);
                doc.setFontSize(6);
                doc.setTextColor(54, 69, 79);
                doc.text(cpAddress, (450 - ((doc.getFontSize() * addressWidth) / 12)) / 2, 50);
                doc.addImage(littleImage, 'png', 10, 575, 45, 20);
                doc.text("Printed by " + sessionStorage.getItem("adminName"), 450 - ((doc.getFontSize() * (("Printed by " + sessionStorage.getItem("adminName")).length)) / 2), 588);
                doc.text(current_date_time, 448 - ((doc.getFontSize() * (current_date_time.length)) / 2), 595);
                doc.setLineWidth(1);
                doc.setDrawColor(42, 149, 69);
                doc.line(10, 598, 117.5, 598);
                doc.setDrawColor(34, 137, 203);
                doc.line(117.5, 598, 225, 598);
                doc.setDrawColor(226, 44, 29);
                doc.line(225, 598, 332.5, 598);
                doc.setDrawColor(245, 174, 48);
                doc.line(332.5, 598, 440, 598);
                doc.setFontSize(8);
                doc.text("Page No. " + ++pageCount, 403, 608);
            }, margin: { top: 70, bottom: 80 }, styles: { fontSize: 7, font: "openSans" }, columnStyles: { 6: { columnWidth: 85 }, 7: { columnWidth: 85 } }, startY: isShift == "1" ? 80 : 120, bodyStyles: { fontSize: 6 }, headStyles: { fillColor: [34, 137, 203] }
    });
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    var offsetY = 4.797777777777778; //var offsetY is for spacing
    var lineHeight = 6.49111111111111
    // var img = new Image(); //this mount a variable to img
    // img.src = sign //asign the src to the img variable
    // doc.setFontSize(10);
    // doc.addImage(img, 'jpg', 170, doc.autoTable.previous.finalY + lineHeight * 1.5 + offsetY, 50, 20)// use the method doc.autoTable.previous.finalY + lineHeight * 1.5 + offsetY to be able to position the image of the signature below the table at a safe distance from it 
    // doc.text(180, doc.autoTable.previous.finalY + lineHeight * 5 + offsetY, "Nihal Chaudhary") // later add the text below the signature
    // // doc.text(165, doc.autoTable.previous.finalY + lineHeight * 6 + offsetY, "Country Manager, Little India") //more text
    // doc.fromHTML(renderToString(document.getElementById("jay")), function() {
    //     doc.save("Text.pdf");
    // });
    doc.save(`report_${sessionStorage.getItem("cpName")}.pdf`);
};

export default generatePDF;