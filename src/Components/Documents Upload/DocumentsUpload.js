import React, { useRef } from "react";
import "./DocumentsUpload.css";
import { FiUploadCloud } from "react-icons/fi";
import { useState } from "react";
import useHttp from "../../Hooks/use-http";
import { useEffect } from "react";
import loadingGif from "../../Assets/loading-gif.gif";
import Message from "../../Modal/Message";

let gstCertificate = "";
let incorporationCertificate = "";
let panCard = "";
const filesName = {
  gst: "",
  incorp: "",
  panCard: "",
};
let gstCertificateBase64 = "";
let incorpCertificateBase64 = "";
let panCardBase64 = "";
let gstCertificateURL = "";
let incorpCertificateURL = "";
let panCardURL = "";
let flag = true;
let status = false;
let type = "";
let erros = {
  gstNumber: "",
  gststartDate: "",
  gstFile: "",
  incorpNumber: "",
  incorpStartDate: "",
  incorpFile: "",
  panNumber: "",
  panStartDate: "",
  panFile: ""
}
let formIsValid = false;

const DocumentUpload = () => {
  const [isFileChange, setIsFileChange] = useState(filesName);
  const [isUpload, setIsUpload] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [isInputError, setIsInputError] = useState(erros);
  const gstCertificateNumberInpuetRef = useRef();
  const gstCertificateStartDateInputRef = useRef();
  const incorpCertificateNumberInputRef = useRef();
  const incorpCertificateStartDateInputRef = useRef();
  const panCardNumberInpuetRef = useRef();
  const panCardStartDateInpuetRef = useRef();

  const authenticateUser = (data) => {
    if (type === "submit") {
      type = "";
      if (data?.Message.toLowerCase() === "success") sessionStorage.setItem("document", 1);
      setIsUpload(false);
      setIsResponse(data.Message ? data.Message : data);
    } else if (sessionStorage.getItem("document")) {
      gstCertificateNumberInpuetRef.current.value = data.DocumentList[0].DocumentNumber;
      gstCertificateStartDateInputRef.current.value = formatToMMDDYYYYfromYYYYMMDD(data.DocumentList[0].CertificateStartDate);
      gstCertificateBase64 = data.DocumentList[0].Sdocument;

      incorpCertificateNumberInputRef.current.value = data.DocumentList[1].DocumentNumber;
      incorpCertificateStartDateInputRef.current.value = formatToMMDDYYYYfromYYYYMMDD(data.DocumentList[1].CertificateStartDate);
      incorpCertificateBase64 = data.DocumentList[1].Sdocument;

      panCardNumberInpuetRef.current.value = data.DocumentList[2].DocumentNumber;
      panCardStartDateInpuetRef.current.value = formatToMMDDYYYYfromYYYYMMDD(data.DocumentList[2].CertificateStartDate);
      panCardBase64 = data.DocumentList[2].Sdocument;

      let IDs = ["gstStatus", "incorpStatus", "panCardStatus"];
      setTimeout(() => {

        document.getElementById("gstStatus").innerText = data.DocumentList[0].Action;
        document.getElementById("incorpStatus").innerText = data.DocumentList[1].Action;
        document.getElementById("panCardStatus").innerText = data.DocumentList[2].Action;
        for (let i = 0; i < 3; i++) {
          document.getElementById(IDs[i]).innerText = data.DocumentList[i].Action;
          if (data.DocumentList[i].Action.toLowerCase() === "pending")
            document.getElementById(IDs[i]).classList.add("pending");
          else if (data.DocumentList[i].Action.toLowerCase() === "rejected")
            document.getElementById(IDs[i]).classList.add("rejected");
          else if (data.DocumentList[i].Action.toLowerCase() === "approved")
            document.getElementById(IDs[i]).classList.add("approved");
        }

      }, 1000)
      if (data.DocumentList) status = true;
      setIsFileChange((prev) => ({ ...prev, gst: "Click here to View", incorp: "Click here to View", panCard: "Click here to View" }))
    }
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (!isUpload && flag) {
      sendRequest(
        {
          url: "/api/v1/Document/GetCorporateDocument",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            corporateID: sessionStorage.getItem("corpId"),
            emailID: sessionStorage.getItem("user"),
          },
        },
        authenticateUser
      );
    }

    // alert("here");
    if (isUpload) {
      let documentList = JSON.stringify([
        {
          DocumentID: "CGC",
          DocumentNumber: gstCertificateNumberInpuetRef.current.value,
          StartDate: gstCertificateStartDateInputRef.current.value,
          SDocument: gstCertificateBase64,
          Documentlink: gstCertificateURL
        },
        {
          DocumentID: "CIINDIA",
          DocumentNumber: incorpCertificateNumberInputRef.current.value,
          StartDate: incorpCertificateStartDateInputRef.current.value,
          SDocument: incorpCertificateBase64,
          Documentlink: incorpCertificateURL
        },
        {
          DocumentID: "CPC",
          DocumentNumber: panCardNumberInpuetRef.current.value,
          StartDate: panCardStartDateInpuetRef.current.value,
          SDocument: panCardBase64,
          Documentlink: panCardURL
        }
      ]);

      sendRequest(
        {
          url: "/api/v1/Document/AddCorporateDocument",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            corporateID: sessionStorage.getItem("corpId"),
            emailID: sessionStorage.getItem("user"),
            documentsList: documentList,
          },
        },
        authenticateUser
      );
    }
  }, [sendRequest, isUpload]);

  const uploadDocumentsClickHandler = () => {
    if (!gstCertificateNumberInpuetRef.current.value) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, gstNumber: "Gst Number is Invalid" }));
    }
    if (!gstCertificateStartDateInputRef.current.value) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, gststartDate: "Gst number start date is invalid" }));
    }
    if (!gstCertificateBase64) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, gstFile: "Gst certificate file is invalid" }));
    }
    if (!incorpCertificateNumberInputRef.current.value) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, incorpNumber: "Incorporation number is invalid" }));
    }
    if (!incorpCertificateStartDateInputRef.current.value) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, incorpStartDate: "Incorporation number start date is invalid" }));
    }
    if (!incorpCertificateBase64) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, incorpFile: "Incorporation certificate file is invalid" }));
    }
    if (!panCardNumberInpuetRef.current.value) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, panNumber: "Pan number is invalid" }));
    }
    if (!panCardStartDateInpuetRef.current.value) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, panStartDate: "Pan number start date is invalid" }));
    }
    if (!panCardBase64) {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, panFile: "Pan card file is invalid" }));
    }
    if (formIsValid) {
      type = "submit";
      setIsUpload(true);
    }
  };

  function formatToMMDDYYYYfromYYYYMMDD(inputDate) {
    var date = new Date(inputDate);
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  }

  const GSTCentificateChangeHandler = (e) => {
    console.log(e.target.files[0].name.includes("jpg"));
    if (e.target.files[0].size > 500000) {
      setIsInputError(prev => ({ ...prev, gstFile: "File size should be less than 5 mb" }))
    } else if (!(e.target.files[0].name.includes("jpg") || e.target.files[0].name.includes("jpeg") || e.target.files[0].name.includes("png") || e.target.files[0].name.includes("pdf"))) {
      setIsInputError(prev => ({ ...prev, gstFile: "File format must be jpg, jpeg, png or pdf" }));
    } else {
      formIsValid = true;
      gstCertificate = e.target.files[0];
      gstCertificateURL = URL.createObjectURL(gstCertificate);
      getBase64(e.target.files[0]).then((data) => (gstCertificateBase64 = data));
      setIsFileChange((prev) => ({ ...prev, gst: e.target.files[0].name }));
      setIsInputError(prev => ({ ...prev, gstFile: "" }));
    }
  };
  const incorporationCertificateChangeHandler = (e) => {
    if (e.target.files[0].size > 500000) {
      setIsInputError(prev => ({ ...prev, incorpFile: "File size must be less than 5 mb" }))
    } else if (!(e.target.files[0].name.includes("jpg") || e.target.files[0].name.includes("jpeg") || e.target.files[0].name.includes("png") || e.target.files[0].name.includes("pdf"))) {
      setIsInputError(prev => ({ ...prev, incorpFile: "File format must be jpg, jpeg, png or pdf" }));
    } else {
      formIsValid = true;
      incorporationCertificate = e.target.files[0];
      incorpCertificateURL = URL.createObjectURL(incorporationCertificate);
      getBase64(e.target.files[0]).then(
        (data) => (incorpCertificateBase64 = data)
      );
      setIsFileChange((prev) => ({ ...prev, incorp: e.target.files[0].name }));
      setIsInputError(prev => ({ ...prev, incorpFile: "" }));
    }
  };
  const panCardChangeHandler = (e) => {
    if (e.target.files[0].size > 500000) {
      setIsInputError(prev => ({ ...prev, panFile: "File size should be less than 5 mb" }))
    } else if (!(e.target.files[0].name.includes("jpg") || e.target.files[0].name.includes("jpeg") || e.target.files[0].name.includes("png") || e.target.files[0].name.includes("pdf"))) {
      setIsInputError(prev => ({ ...prev, panFile: "File format must be jpg, jpeg, png or pdf" }));
    } else {
      formIsValid = true;
      panCard = e.target.files[0];
      panCardURL = URL.createObjectURL(panCard);
      getBase64(e.target.files[0]).then((data) => (panCardBase64 = data));
      setIsFileChange((prev) => ({ ...prev, panCard: e.target.files[0].name }));
      setIsInputError(prev => ({ ...prev, panFile: "" }));
    }
  };
  const gstFileViewHandler = () => {
    viewDocument(gstCertificateBase64);
  };
  const incorpFileViewHandler = () => {
    viewDocument(incorpCertificateBase64);
  };
  const panCardFileViewHandler = () => {
    viewDocument(panCardBase64);
  };
  const viewDocument = (file) => {
    let pdfWindow = window.open("");
    pdfWindow.document.write("<html<head><title>" + "document" + "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
    file.split(",")[0].includes("pdf") ?
      pdfWindow.document.write("<body><embed width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(file.split(",")[1]) + "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>")
      :
      pdfWindow?.document.write(
        `<head><title>Document preview</title></head><body><img src="${file}" width="100%" height="100%" ></body></html >`);
  };
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const gstNumnerChangeHandler = () => {
    if (gstCertificateNumberInpuetRef.current.value) {
      formIsValid = true;
      setIsInputError(prev => ({ ...prev, gstNumber: "" }));
    } else {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, gstNumber: "Gst number is invalid" }));
    }
  }

  const gstStartDateChangeHandler = () => {
    if (gstCertificateStartDateInputRef.current.value) {
      formIsValid = true;
      setIsInputError(prev => ({ ...prev, gststartDate: "" }));
    } else {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, gststartDate: "Gst number start date is invalid" }));
    }
  }
  const incorpNumberChnageHandler = () => {
    if (incorpCertificateNumberInputRef.current.value) {
      formIsValid = true;
      setIsInputError(prev => ({ ...prev, incorpNumber: "" }));
    } else {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, incorpNumber: "Incorporation number is invalid" }));
    }
  }
  const incorpStartDateChangeHandler = () => {
    if (incorpCertificateStartDateInputRef.current.value) {
      // debugger;
      // let x = formatToMMDDYYYYfromYYYYMMDD(incorpCertificateStartDateInputRef.current.value);
      // incorpCertificateStartDateInputRef.current.value = x;
      formIsValid = true;
      setIsInputError(prev => ({ ...prev, incorpStartDate: "" }));
    } else {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, incorpStartDate: "Incorporation number start date is invalid" }));
    }
  }
  const panNumberChangeHandler = () => {
    if (panCardNumberInpuetRef.current.value) {
      formIsValid = true;
      setIsInputError(prev => ({ ...prev, panNumber: "" }));
    } else {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, panNumber: "Pan number is invalid" }));
    }
  }
  const panStartDateChangeHandler = () => {
    if (panCardStartDateInpuetRef.current.value) {
      formIsValid = true;
      setIsInputError(prev => ({ ...prev, panStartDate: "" }));
    } else {
      formIsValid = false;
      setIsInputError(prev => ({ ...prev, panStartDate: "Pan number start date is invalid" }));
    }
  }

  return (
    <div className="documents-upload-container" id="documents-upload">
      <h3>{sessionStorage.getItem("type").toUpperCase() + " DOCUMENTS DETAILS"}</h3>
      <div className="documents-upload">
        <header className={!status ? "fill" : "success"}>
          {!status
            ? "Dear " + sessionStorage.getItem("adminName") + " , Kindly upload the below documents."
            : "Dear " + sessionStorage.getItem("adminName") + ", Kindly check your uploaded documents."}
        </header>
        <main>
          <div>
            <h4>Document Upload</h4>
            <div className="border"></div>
            <div className="sub-container">
              <div className="text">
                <p>Upload Guidelines.</p>
                <p>Enter the document number (if aplicable).</p>
                <p>Enter the start date.</p>
                <p>
                  Attach your document (Kindly ensure that your document size
                  should not be more than 5MB).
                </p>
              </div>
              <button
                onClick={uploadDocumentsClickHandler}
                className="upload-button"
              >
                Upload All Documents
              </button>
            </div>
          </div>
          <div className="document-details-container">
            <header>
              <h4>{sessionStorage.getItem("type") + " GST Certificate"}</h4>
              {status &&
                <p className="approval-status">
                  <span>Approval status</span> <span id="gstStatus" ></span>
                </p>
              }
            </header>
            <div className="document-inputs">
              <div className="for-input-error-container">
                <input
                  type="text"
                  placeholder={sessionStorage.getItem("type") + " GST Certificate Number"}
                  ref={gstCertificateNumberInpuetRef}
                  onChange={gstNumnerChangeHandler}
                />
                {isInputError.gstNumber && <span className="error">{isInputError.gstNumber}</span>}
              </div>
              <div className="for-input-error-container">
                <input
                  type="text"
                  placeholder={sessionStorage.getItem("type") + " GST Certificate Start Date"}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    e.target.type = "text";
                    if (gstCertificateStartDateInputRef.current.value)
                      gstCertificateStartDateInputRef.current.value = formatToMMDDYYYYfromYYYYMMDD(gstCertificateStartDateInputRef.current.value);
                  }}
                  ref={gstCertificateStartDateInputRef}
                  onChange={gstStartDateChangeHandler}
                />
                {isInputError.gststartDate && <span className="error">{isInputError.gststartDate}</span>}
              </div>
              <div className="for-input-error-container">
                <div
                  className="file-upload-container"
                >
                  <p
                    className="upload-document"
                    onClick={() =>
                      document.getElementsByTagName("input")[2].click()
                    }
                  >
                    <input
                      type="file"
                      onChange={GSTCentificateChangeHandler}
                    />
                    <FiUploadCloud className="fileUpload-icon" />
                    <span>Tap/Click to attach Documents here.</span>
                  </p>
                  {isFileChange.gst && (
                    <p className="filename" onClick={gstFileViewHandler}>
                      {isFileChange.gst}
                    </p>
                  )}
                </div>
                {isInputError.gstFile && <span className="error">{isInputError.gstFile}</span>}
              </div>
            </div>
          </div>
          <div className="document-details-container">
            <header>
              <h4>Incorporation Certificate</h4>
              {status &&
                <p className="approval-status">
                  <span>Approval status</span> <span id="incorpStatus"></span>
                </p>
              }
            </header>
            <div className="document-inputs">
              <div className="for-input-error-container">
                <input
                  type="text"
                  placeholder="Incorporation Certificate Number "
                  ref={incorpCertificateNumberInputRef}
                  onChange={incorpNumberChnageHandler}
                />
                {isInputError.incorpNumber && <span className="error">{isInputError.incorpNumber}</span>}
              </div>
              <div className="for-input-error-container">
                <input
                  type="text"
                  placeholder="Incorporation Certificate Start Date "
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    e.target.type = "text";
                    if (incorpCertificateStartDateInputRef.current.value)
                      incorpCertificateStartDateInputRef.current.value = formatToMMDDYYYYfromYYYYMMDD(incorpCertificateStartDateInputRef.current.value);
                  }}
                  ref={incorpCertificateStartDateInputRef}
                  onChange={incorpStartDateChangeHandler}
                />
                {isInputError.incorpStartDate && <span className="error">{isInputError.incorpStartDate}</span>}
              </div>
              <div className="for-input-error-container">
                <div
                  className="file-upload-container"
                >
                  <p
                    className="upload-document"
                    onClick={() =>
                      document.getElementsByTagName("input")[5].click()
                    }
                  >
                    <input
                      type="file"
                      onChange={incorporationCertificateChangeHandler}
                    />
                    <FiUploadCloud className="fileUpload-icon" />
                    <span>Tap/Click to attach Documents here.</span>
                  </p>
                  {isFileChange.incorp && (
                    <p className="filename" onClick={incorpFileViewHandler}>
                      {isFileChange.incorp}
                    </p>
                  )}
                </div>
                {isInputError.incorpFile && <span className="error">{isInputError.incorpFile}</span>}
              </div>
            </div>
          </div>
          <div className="document-details-container" >
            <header>
              <h4>{sessionStorage.getItem("type") + " Pan Card"}</h4>
              {status &&
                <p style={{ marginLeft: "35px" }} className="approval-status">
                  <span>Approval status</span> <span id="panCardStatus"></span>
                </p>
              }
            </header>
            <div className="document-inputs">
              <div className="for-input-error-container">
                <input type="text" placeholder={sessionStorage.getItem("type") + " Pan Card Number"} ref={panCardNumberInpuetRef} onChange={panNumberChangeHandler} />
                {isInputError.panNumber && <span className="error">{isInputError.panNumber}</span>}
              </div>
              <div className="for-input-error-container">
                <input
                  type="text"
                  placeholder={sessionStorage.getItem("type") + " Pan Card Start Date"}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    e.target.type = "text";
                    if (panCardStartDateInpuetRef.current.value)
                      panCardStartDateInpuetRef.current.value = formatToMMDDYYYYfromYYYYMMDD(panCardStartDateInpuetRef.current.value);
                  }}
                  ref={panCardStartDateInpuetRef}
                  onChange={panStartDateChangeHandler}
                />
                {isInputError.panStartDate && <span className="error">{isInputError.panStartDate}</span>}
              </div>
              <div className="for-input-error-container">
                <div
                  className="file-upload-container"
                >
                  <p
                    className="upload-document"
                    onClick={() =>
                      document.getElementsByTagName("input")[8].click()
                    }
                  >
                    <input
                      type="file"
                      onChange={panCardChangeHandler}
                    />
                    <FiUploadCloud className="fileUpload-icon" />
                    <span>Tap/Click to attach Documents here.</span>
                  </p>
                  {isFileChange.panCard && (
                    <p className="filename" onClick={panCardFileViewHandler}>
                      {isFileChange.panCard}
                    </p>
                  )}
                </div>
                {isInputError.panFile && <span className="error">{isInputError.panFile}</span>}
              </div>
            </div>
          </div>
        </main>
      </div>
      {(isLoading && sessionStorage.getItem("document") == "1") && <img src={loadingGif} className="loading-gif" />}
      {isResponse &&
        <Message flag={1} type={isResponse} message={"Documents has been successfully added."} />
      }
    </div>
  );
};

export default DocumentUpload;