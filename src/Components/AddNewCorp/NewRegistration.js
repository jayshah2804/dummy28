import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import useHttp from '../../Hooks/use-http';
import "./NewRegistration.css";
import { BiUpload } from "react-icons/bi";

import loadingGif from "../../Assets/loading-gif.gif";

let corporateLogo = "";
let adminPhoto = "";

const DATA_ERRORS = {
    countryError: "",
    industryError: "",
    corporateTypeError: "",
    corporateNameError: "",
    corporateDomainError: "",
    corporateLogoError: "",
    adminNameError: "",
    adminEmailError: "",
    adminPhotoError: "",
    adminContactError: "",
    invoiceContactNameError: "",
    invoiceContactEmailError: "",
    accountManagerError: "",
    salesExecutiveError: "",
    latLngError: "",
    creditPeriodError: "",
    contractStartDateError: "",
    contractEndDateError: ""
}

let isFormValid = false;
let apiFlag = 0;
const NewRegistration = () => {
    const [formError, setFormError] = useState(DATA_ERRORS);
    const [isValid, setIsValid] = useState(false);
    const countrySelectRef = useRef();
    const industrySelectRef = useRef();
    const typeSelectRef = useRef();
    const corporateNameInputRef = useRef();
    const corporateDomainInputRef = useRef();
    const corporateLogoInputRef = useRef();
    const adminNameInputRef = useRef();
    const adminEmailInputRef = useRef();
    const adminMobileInputRef = useRef();
    const adminPhotoInputRef = useRef();
    const invoiceContactNameInputRef = useRef();
    const invoiceContactEmailInputRef = useRef();
    const accountManagerSelectRef = useRef();
    const salesExecutiveSelectRef = useRef();
    const latLngInputRef = useRef();
    const CreditPeriodInputRef = useRef();
    const contractStartDateInputRef = useRef();
    const contractEndDateInputRef = useRef();
    const history = useHistory();


    const authenticateUser = (data) => {
        console.log(data);
        if (data.Message === "Success")
            history.push("/dashboard");
        else alert("some error occured. Please try again later!")
    };

    const { isLoading, sendRequest } = useHttp();

    useEffect(() => {
        console.log({
            countryID: countrySelectRef.current.value,
            industry: industrySelectRef.current.value,
            corporateType: typeSelectRef.current.value,
            corporatename: corporateNameInputRef.current.value,
            corporatedomain: corporateDomainInputRef.current.value,
            corporateLogo: corporateLogo,
            adminName: adminNameInputRef.current.value,
            adminEmail: adminEmailInputRef.current.value,
            adminImage: adminPhoto,
            adminContactNo: adminMobileInputRef.current.value,
            invoiceContactName: invoiceContactNameInputRef.current.value,
            invoiceContactEmail: invoiceContactEmailInputRef.current.value,
            accountManagerID: "nihal@little.global",
            salesExecutives: "nihal@little.global",
            corporateLatlong: latLngInputRef.current.value,
            creditPeriod: CreditPeriodInputRef.current.value,
            contractstartdate: contractStartDateInputRef.current.value,
            contractEnddate: contractEndDateInputRef.current.value,
            password: ""
        });
        if (isValid)
            sendRequest({
                url: "/api/v1/Corporate/CorporateRegistration",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    countryID: countrySelectRef.current.value,
                    industry: industrySelectRef.current.value,
                    corporateType: typeSelectRef.current.value,
                    corporatename: corporateNameInputRef.current.value,
                    corporatedomain: corporateDomainInputRef.current.value,
                    corporateLogo: corporateLogo,
                    adminName: adminNameInputRef.current.value,
                    adminEmail: adminEmailInputRef.current.value,
                    adminImage: adminPhoto,
                    adminContactNo: adminMobileInputRef.current.value,
                    invoiceContactName: invoiceContactNameInputRef.current.value,
                    invoiceContactEmail: invoiceContactEmailInputRef.current.value,
                    accountManagerID: "nihal@little.global",
                    salesExecutives: "nihal@little.global",
                    corporateLatlong: latLngInputRef.current.value,
                    creditPeriod: CreditPeriodInputRef.current.value,
                    contractstartdate: contractStartDateInputRef.current.value,
                    contractEnddate: contractEndDateInputRef.current.value,
                    password: ""
                }
            }, authenticateUser);
        apiFlag++;
    }, [sendRequest, isValid])



    const countryChangeHandler = () => {
        if (countrySelectRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, countryError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, countryError: "country name is invalid" }));
        }
    }
    const industryChangeHandler = () => {
        if (industrySelectRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, industryError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, industryError: "Industry name is invalid" }));
        }
    }
    const corporateTypeChangeHandler = () => {
        if (typeSelectRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, corporateTypeError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateTypeError: "Corporate type is invalid" }));
        }
    }
    const corprateNameChangeHandler = () => {
        if (corporateNameInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, corporateNameError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateNameError: "Corporate name is Invalid" }));
        }
    }
    const corprateDomainChangeHandler = () => {
        if (corporateDomainInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, corporateDomainError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateDomainError: "Corporate domain is Invalid" }));
        }
    }
    const adminNameChangeHandler = () => {
        if (adminNameInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, adminNameError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminNameError: "admin name is Invalid" }));
        }
    }
    const adminEmailChangeHandler = () => {
        if (adminEmailInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, adminEmailError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminEmailError: "admin email is Invalid" }));
        }
    }
    const adminContactChangeHandler = () => {
        if (adminMobileInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, adminContactError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminContactError: "admin contact is Invalid" }));
        }
    }
    const invoiceContactNameChangeHandler = () => {
        if (invoiceContactNameInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, invoiceContactNameError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, invoiceContactNameError: "invoice contact name is Invalid" }));
        }
    }
    const invoiceContactEmailChangeHandler = () => {
        if (invoiceContactEmailInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, invoiceContactEmailError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, invoiceContactEmailError: "invoice contact email is Invalid" }));
        }
    }
    const accountManagerChangeHandler = () => {
        if (accountManagerSelectRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, accountManagerError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, accountManagerError: "account manager is Invalid" }));
        }
    }
    const salesExecutiveChangeHandler = () => {
        if (salesExecutiveSelectRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, salesExecutiveError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, salesExecutiveError: "sales executive is Invalid" }));
        }
    }
    const latLngChangeHandler = () => {
        if (latLngInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, latLngError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, latLngError: "Lat, lng is Invalid" }));
        }
    }
    const creditPeriodChangeHandler = () => {
        if (CreditPeriodInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, creditPeriodError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, creditPeriodError: "credit period is Invalid" }));
        }
    }

    function formatToMMDDYYYYfromYYYYMMDD(inputDate) {
        var date = new Date(inputDate);
        return (
            date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
        );
    }

    const contractStartDateChangeHandler = () => {
        if (contractStartDateInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, contractStartDateError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, contractStartDateError: "contarct start date is Invalid" }));
        }
    }
    const contractEndDateChangeHandler = () => {
        if (contractEndDateInputRef.current.value) {
            isFormValid = true;
            setFormError(prev => ({ ...prev, contractEndDateError: "" }));
        }
        else {
            isFormValid = false;
            setFormError(prev => ({ ...prev, contractEndDateError: "contarct end date is Invalid" }));
        }
    }
    const corporateLogoChangeHandler = (e) => {
        if (corporateLogoInputRef.current.value) {
            let a = corporateLogoInputRef.current.value.split("/");
            e.target.parentElement.children[0].innerText = a[0].split("\\")[2];
            if (corporateLogoInputRef.current.value) {
                getBase64(e.target.files[0]).then(
                    data => corporateLogo = data
                );
                isFormValid = true;
                setFormError(prev => ({ ...prev, corporateLogoError: "" }));
            }
            else {
                isFormValid = false;
                setFormError(prev => ({ ...prev, corporateLogoError: "corporate logo  is Invalid" }));
            }
        }
    }
    const adminPhotoChangeHandler = (e) => {
        if (adminPhotoInputRef.current.value) {
            let a = adminPhotoInputRef.current.value.split("/");
            e.target.parentElement.children[0].innerText = a[0].split("\\")[2];
            if (adminPhotoInputRef.current.value) {
                getBase64(e.target.files[0]).then(
                    data => adminPhoto = data
                );
                isFormValid = true;
                setFormError(prev => ({ ...prev, adminPhotoError: "" }));
            }
            else {
                isFormValid = false;
                setFormError(prev => ({ ...prev, adminPhotoError: "admin photo  is Invalid" }));
            }
        }
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const saveCorporateClickHandler = () => {
        if (countrySelectRef.current.value === "Country") {
            isFormValid = false;
            setFormError(prev => ({ ...prev, countryError: "Country name is Invalid" }));
        }
        if (industrySelectRef.current.value === "Industry") {
            isFormValid = false;
            setFormError(prev => ({ ...prev, industryError: "Industry name is Invalid" }));
        }
        if (typeSelectRef.current.value === "Type") {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateTypeError: "Corporate type is Invalid" }));
        }
        if (!corporateNameInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateNameError: "Corporate name is Invalid" }));
        }
        if (!corporateDomainInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateDomainError: "Corporate domain is Invalid" }));
        }
        if (!corporateLogoInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, corporateLogoError: "Corporate logo is Invalid" }));
        }
        if (!adminNameInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminNameError: "Admin name is Invalid" }));
        }
        if (!adminEmailInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminEmailError: "Admin photo is Invalid" }));
        }
        if (!adminPhotoInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminPhotoError: "Admin photo is Invalid" }));
        }
        if (!adminMobileInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, adminContactError: "Admin mobile is Invalid" }));
        }
        if (!invoiceContactNameInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({
                ...prev, invoiceContactNameError: "Invoice contact name is Invalid"
            }));
        }
        if (!invoiceContactEmailInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({
                ...prev, invoiceContactEmailError: "Invoice contact email is Invalid"
            }));
        }
        if (accountManagerSelectRef.current.value === "Account Manager") {
            isFormValid = false;
            setFormError(prev => ({ ...prev, accountManagerError: "Account manager is Invalid" }));
        }
        if (salesExecutiveSelectRef.current.value === "Sales Executive") {
            isFormValid = false;
            setFormError(prev => ({ ...prev, salesExecutiveError: "Sales executive is Invalid" }));
        }
        if (!latLngInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, latLngError: "Lat, lng is Invalid" }));
        }
        if (!CreditPeriodInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({ ...prev, creditPeriodError: "Credit Period is Invalid" }));
        }
        if (!contractStartDateInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({
                ...prev, contractStartDateError: "Contract start date is Invalid"
            }));
        };
        if (!contractEndDateInputRef.current.value) {
            isFormValid = false;
            setFormError(prev => ({
                ...prev, contractEndDateError: "Contract end date is Invalid"
            }));
        }
        if (isFormValid)
            setIsValid(prev => !prev);
    }

    return (
        <div className='new-corp-conatiner' id='new-reg' >
            <header>New Corporate Registration</header>
            <div className='new-corp-subcontainer'>
                <div className='mini-container'>
                    <div className='inputErrorBox'>
                        <select ref={countrySelectRef} onChange={countryChangeHandler} >
                            <option selected disabled>Country</option>
                            <option>India</option>
                            <option>Kenya</option>
                            <option>Ghana</option>
                            <option>Slomalia</option>
                        </select>
                        <span className='errorMsg'>{formError.countryError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <select ref={industrySelectRef} onChange={industryChangeHandler} >
                            <option selected disabled>Industry</option>
                            <option>Hospital</option>
                            <option>Recruitment Agency</option>
                            <option>EdTech</option>
                            <option>FinTech</option>
                            <option>Logistics</option>
                            <option>Consultancy Firm</option>
                            <option>Transporation</option>
                            <option>Other</option>
                        </select>
                        <span className='errorMsg'>{formError.industryError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <select ref={typeSelectRef} onChange={corporateTypeChangeHandler} >
                            <option selected disabled>Type</option>
                            <option>School</option>
                            <option>Corporate</option>
                        </select>
                        <span className='errorMsg'>{formError.corporateTypeError}</span>
                    </div>
                </div>
                <div className='mini-container'>
                    <div className='inputErrorBox'>
                        <input type="text" placeholder='Corporate Name' ref={corporateNameInputRef} onChange={corprateNameChangeHandler} />
                        <span className='errorMsg'>{formError.corporateNameError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="text" placeholder='Corporate Domain' ref={corporateDomainInputRef} onChange={corprateDomainChangeHandler} />
                        <span className='errorMsg'>{formError.corporateDomainError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <div className='corp-logo'>
                            <label>Corporate Logo</label>
                            <input type="file" placeholder='Corporate Logo' onChange={corporateLogoChangeHandler} ref={corporateLogoInputRef} />
                            <BiUpload className='upload-icon' />
                        </div>
                        <span className='errorMsg'>{formError.corporateLogoError}</span>
                    </div>
                </div>
                <div className='mini-container'>
                    <div className='inputErrorBox'>
                        <input type="text" placeholder='Admin Name' ref={adminNameInputRef} onChange={adminNameChangeHandler} />
                        <span className='errorMsg'>{formError.adminNameError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="email" placeholder='Admin Email' ref={adminEmailInputRef} onChange={adminEmailChangeHandler} />
                        <span className='errorMsg'>{formError.adminEmailError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <div className='admin-photo'>
                            <label>Admin Photo</label>
                            <input type="file" placeholder='Admin Photo' onChange={adminPhotoChangeHandler} ref={adminPhotoInputRef} />
                            <BiUpload className='upload-icon' />
                        </div>
                        <span className='errorMsg'>{formError.adminPhotoError}</span>
                    </div>
                </div>
                <div className='mini-container'>
                    <div className='inputErrorBox'>
                        <input type="number" placeholder='Admin Contact Number' ref={adminMobileInputRef} onChange={adminContactChangeHandler} />
                        <span className='errorMsg'>{formError.adminContactError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="text" placeholder='Invoice Contact Name' ref={invoiceContactNameInputRef} onChange={invoiceContactNameChangeHandler} />
                        <span className='errorMsg'>{formError.invoiceContactNameError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="email" placeholder='Invoice Contact Email' ref={invoiceContactEmailInputRef} onChange={invoiceContactEmailChangeHandler} />
                        <span className='errorMsg'>{formError.invoiceContactEmailError}</span>
                    </div>
                </div>
                <div className='mini-container'>
                    <div className='inputErrorBox'>
                        <select ref={accountManagerSelectRef} onChange={accountManagerChangeHandler} >
                            <option selected disabled>Account Manager</option>
                            <option>Shabbir Ahmed</option>
                            <option>Nihal Chaudhary</option>
                        </select>
                        <span className='errorMsg'>{formError.accountManagerError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <select ref={salesExecutiveSelectRef} onChange={salesExecutiveChangeHandler} >
                            <option disabled selected>Sales Executive</option>
                            <option>Jay Shah</option>
                        </select>
                        <span className='errorMsg'>{formError.salesExecutiveError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="text" ref={latLngInputRef} onChange={latLngChangeHandler} placeholder='Latitude and Longitude' />
                        <span className='errorMsg'>{formError.latLngError}</span>
                    </div>
                </div>
                <div className='mini-container'>
                    <div className='inputErrorBox'>
                        <input type="number" placeholder='Credit Period' ref={CreditPeriodInputRef} onChange={creditPeriodChangeHandler} />
                        <span className='errorMsg'>{formError.creditPeriodError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="text" placeholder='Contract Start Date' onChange={contractStartDateChangeHandler} ref={contractStartDateInputRef} onFocus={(e) => e.target.type = "date"} onBlur={(e) => {
                            e.target.type = "text";
                            if (contractStartDateInputRef.current.value)
                                contractStartDateInputRef.current.value = formatToMMDDYYYYfromYYYYMMDD(contractStartDateInputRef.current.value);
                        }} />
                        <span className='errorMsg'>{formError.contractStartDateError}</span>
                    </div>
                    <div className='inputErrorBox'>
                        <input type="text" placeholder='Contract End Date' onChange={contractEndDateChangeHandler} ref={contractEndDateInputRef} onFocus={(e) => e.target.type = "date"} onBlur={(e) => {
                            e.target.type = "text";
                            if (contractEndDateInputRef.current.value)
                                contractEndDateInputRef.current.value = formatToMMDDYYYYfromYYYYMMDD(contractEndDateInputRef.current.value);
                        }} />
                        <span className='errorMsg'>{formError.contractEndDateError}</span>
                    </div>
                </div>
                <div style={{ alignSelf: "flex-end" }}>
                    <button>Back</button>
                    <button onClick={saveCorporateClickHandler}>Save</button>
                </div>
            </div>
            {isLoading &&
                <img src={loadingGif} style={{ position: "absolute", top: "40%", left: "40%" }} />
            }
        </div>
    )
}

export default NewRegistration