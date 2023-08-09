import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { ApiRequest } from '../../common/ApiRequest';
import EmployeeListForm from './EmployeeListForm';
import { useHistory } from 'react-router-dom';
import Loading from "../../common/Loading";
import Confirmation from "../../common/Confirmation";
import SuccessError from "../../common/SuccessError";

const EmployeeListIndex = () => {
  const [success, setSuccess] = useState([]); // for success message
  const [error, setError] = useState([]); // for error message
  const [loading, setLoading] = useState(false); // for loading condition
  const [employeeList, setEmployeeList] = useState([]); // for user list table data
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [content, setContent] = useState("");
  const [deleteIDs, setDeleteIDs] = useState("");
  const [confirmType, setConfirmType] = useState("");
  const [currentPage, setCurrentPage] = useState(); // for user list table current page
  const [lastPage, setLastPage] = useState(""); // for user list table last page
  const [genderData, setGenderData] = useState([
    { id: "0", name: "Male" },
    { id: "1", name: "Female" },
    { id: "2", name: "Other" },
  ]);
  const [selectGender, setSelectGender] = useState("");
  const [userName, setUserName] = useState("");
  const [total, setTotal] = useState(""); // total rows
  let history = useHistory();


  useEffect(() => {

    let flag = localStorage.getItem(`LoginProcess`)
    if (flag == "true") {
      console.log("Login process success")
    } else {
      history.push(`/Login`);
    }

    (async () => {
      setLoading(true);
      await search();
      setLoading(false);
    })();

  }, []);



  const search = async (page = 1) => {

    let search = {
      method: "get",
      url: `employee/search?page=${page}`,
      params: {
        name: userName,
        gender: selectGender,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setEmployeeList([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") {
        setEmployeeList(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);

      } else {
        setError([response.data.message]);
        setEmployeeList([]);
      }
    }

  }



  const tempSearch = async (page = 1) => {

    let search = {
      method: "get",
      url: `employee/search?page=${page}`,
      params: {
        name: userName,
        gender: selectGender,
      },
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setEmployeeList([]);
    } else {
      if (response.data.status === "OK") {
        setEmployeeList(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);

      } else {
        setEmployeeList([]);
      }
    }

  }

  const searchClick = () => {
    search();
  }




  // pagination function
  const pagination = (i) => {
    setCurrentPage(i);
    tempSearch(i);
  }

  const editClick = (id) => {
    history.push('/employee-management/employee-register');
    localStorage.setItem("Update", id);
  }

  const delClick = async (i) => {
    setDeleteIDs(i);
    setConfirmationModal(true);
    setContent("Are you sure want Delete?");
    setConfirmType("delete");
  }
  
  const deleteOK = async () => {

    setLoading(true);
    let obj = {
      method: "delete",
      url: `employee/delete/${deleteIDs}`,
    };
    let response = await ApiRequest(obj);
    setLoading(false);
    if (response.flag === false) {
      setSuccess([]);
      setError(response.message);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status === "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        let page = currentPage;
        setSuccess([response.data.message]);
        if (employeeList.length - 1 == 0) {
          page = currentPage - 1;
        }
        tempSearch(page);
        setError([]);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setError([response.data.message]);
        setSuccess([]);
      }
    }
    setConfirmationModal(false);
  }



  const confirmOK = () => {
    setError([]);
    setConfirmationModal(false);
  }

  const userNameChange = (e) => {
    setUserName(e.target.value);
  }
  const selectGenderChange = (e) => {
    setSelectGender(e.target.value);
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Employee List</h4>
            </CCardHeader>
            <CCardBody>
              <SuccessError success={success} error={error} />
              <EmployeeListForm
                employeeList={employeeList}
                total={total}
                currentPage={currentPage}
                lastPage={lastPage}
                userName={userName}
                userNameChange={userNameChange}
                genderData={genderData}
                selectGenderChange={selectGenderChange}
                selectGender={selectGender}
                pagination={pagination}
                searchClick={searchClick}
                editClick={editClick}
                delClick={delClick}

              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Loading start={loading} />
      <Confirmation
        show={confirmationModal}
        content={content}
        type={confirmType}
        // saveOK={saveOK}
        deleteOK={deleteOK}
        confirmOK={confirmOK}
        
        cancel={() => setConfirmationModal(false)}
        cancelButton="Cancel"
        okButton="Yes"
      />
    </>
  )
}

export default EmployeeListIndex