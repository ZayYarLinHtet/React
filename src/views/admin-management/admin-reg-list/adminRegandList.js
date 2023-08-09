import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CImg,
  CInput,
  CRow,
  CSelect
} from '@coreui/react'
import { useHistory } from 'react-router'
import { nullChk, emailChk, validateName } from "../../common/CommonValidation";
import Confirmation from "../../common/Confirmation";
import Loading from "../../common/Loading";
import SuccessError from "../../common/SuccessError"; 
import { ApiRequest } from "../../common/ApiRequest";
import NPagination from '../../common/pagination/NPagination';

const AdminRegAndListIndex = () => {
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [admin,setAdmin]=useState([]);
  const [totalRow, setTotalRow] = useState(""); // for user list table rows
  const [currentPage, setCurrentPage] = useState(); // for user list table current page
  const [lastPage, setLastPage] = useState(""); // for user list table last page
  const [updateID, setUpdateID] = useState(localStorage.getItem(`Update`));
  const [loading, setLoading] = useState(false); // For Loading
  const [updateStatus, setUpdateStatus] = useState(false); //for update status
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [content, setContent] = useState("");
  const [confirmType, setConfirmType] = useState("");
  const [deleteIDs, setDeleteIDs] = useState("");
  const [error, setError] = useState([]); // for error message
  const [success, setSuccess] = useState([]); // for success message
  const [total, setTotal] = useState(""); // total rows


  useEffect(()=> {
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


  },[])
 

  const search = async (page = 1)=> {
    
    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setAdmin([]);
      setError(response.message);
    } else {
      if (response.data.status === "OK") {
          setAdmin(response.data.data.data);
          setCurrentPage(response.data.data.current_page);
          setLastPage(response.data.data.last_page);
          setTotal(response.data.data.total);
        
      } else {
        setError([response.data.message]);
        setAdmin([]);
      }
    }
  }

  const tempSearch = async (page = 1) => {

    let search = {
      method: "get",
      url: `admin/get?page=${page}`,
    };
    let response = await ApiRequest(search);
    if (response.flag === false) {
      setAdmin([]);
    } else {
      if (response.data.status === "OK") {
        setAdmin(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
        setTotal(response.data.data.total);

      } else {
        setAdmin([]);
      }
    }

  }

  const pagination = (i) => {
    setCurrentPage(i);
    tempSearch(i);
  }


  const userNameChange = (e) => {
    setUserName(e.target.value);
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
  }

  const reset = () => {
    setUserName("");
    setPassword("");
  }

  const saveClick = async() => {

    let errMsg = []
    if (!nullChk(userName)) {
      errMsg.push("Please fill Username");
    } else if (!validateName(userName)) {
      errMsg.push("Please fill Character Only in Username");
    }

    if (!nullChk(password)) {
      errMsg.push("Please fill Password");
    } 
    
    if (errMsg.length <= 0) {
      setConfirmationModal(true);
      setContent("Are you sure want to save?");
      setConfirmType("save");
    } else {
      setError(errMsg)
    }

    setLoading(false);
  }

  const saveOK = async() => {
    setLoading(true);
    setUpdateStatus(false);
    let saveData = {
    
      method: "post",
      url: `admin/save`,
      params: {
       name : userName,
      password: password,
      },
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setSuccess([response.data.message]);
        reset();
        search();
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }

    let errMsg = []
    if (!nullChk(userName)) {
      errMsg.push("Please fill Username");
    } else if (!validateName(userName)) {
      errMsg.push("Please fill Character Only in Username");
    }

    if (!nullChk(password)) {
      errMsg.push("Please fill Password");
    } 
    
    if (errMsg.length <= 0) {
      setConfirmationModal(true);
      setContent("Are you sure want to save?");
      setConfirmType("save");
    } else {
      setError(errMsg)
    }

    setLoading(false);
    setError([])
    setSuccess(["Data Saved Successfully"])
    setConfirmationModal(false);
    setLoading(false);
  
  }

  const confirmOK = () => {
    setError([]);
    setUserName("");
    setPassword("");
    setConfirmationModal(false);

  }



  const editClick = async(id) => {
    setLoading(true);
    setUpdateStatus(true);
    setUpdateID(id);
    let saveData = {
      method: "get",
      url: `admin/edit/${id}`,
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setUserName(response.data.data.name);
        setPassword(response.data.data.password);
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);

  }

  const delClick = async (i) => {
    setDeleteIDs(i);
    setConfirmationModal(true);
    setContent("Are you sure want Delete?");
    setConfirmType("delete");
  }

  const deleteOK = async() => {
    setLoading(true);
    let obj = {
      method: "delete",
      url: `admin/delete/${deleteIDs}`,
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
        if (admin.length - 1 == 0) {
          page = currentPage - 1;
        }
        search(page);
        setError([]);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setError([response.data.message]);
        setSuccess([]);
      }
    }
    setConfirmationModal(false);
  }


  const updateClick = async() => {

    let errMsg = []
    if (!nullChk(userName)) {
      errMsg.push("Please fill Username");
    } else if (!validateName(userName)) {
      errMsg.push("Please fill Character Only in Username");
    }

    if (!nullChk(password)) {
      errMsg.push("Please fill Password");
    } 
    
    if (errMsg.length <= 0) {
      setConfirmationModal(true);
      setContent("Are you sure want to update?");
      setConfirmType("update");
    } else {
      setError(errMsg)
    }

  }


  const updateOK = async () => {
    setLoading(true);
    setUpdateStatus(false);
    let saveData = {
    
      method: "post",
      url: `admin/update/${updateID}`,
      params: {
       name : userName,
      password: password,
      },
    };
    let response = await ApiRequest(saveData);
    if (response.flag === false) {
      setError(response.message);
      setSuccess([]);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      if (response.data.status == "OK") {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setSuccess([response.data.message]);
        reset();
        search();
        setError([]);
      } else {
        setError([response.data.message]);
        setSuccess([]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
    setLoading(false);
    setError([])
    setSuccess(["Data Updated Successfully"])
    setConfirmationModal(false);
    setLoading(false);
  }

  return (
    <>
      <CRow>
        <CCol xs="12">
        <SuccessError success={success} error={error} />
          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Admin Registeration</h4>
            </CCardHeader>
            <CCardBody>
              
              <CRow style={{ marginTop: "10px" }}>
                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2'>UserName</p>
                    </CCol>
                    <CCol lg="7">
                      <CInput type="text" value={userName} onChange={userNameChange} />
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
               

                </CCol>


                <CCol lg="6">
                  <CRow>
                    <CCol lg="1"></CCol>
                    <CCol lg="3">
                      <p className='mt-2'>Password</p>
                    </CCol>
                    <CCol lg="7">
                      <CInput type="password" value={password} onChange={passwordChange} />
                    </CCol>
                    <CCol lg="1"></CCol>
                  </CRow>
                 
                </CCol>

              </CRow>
              <CRow style={{ justifyContent: "center" }} className="mt-4">
              { updateStatus == false && (
    <CButton className="form-btn" onClick={saveClick}>
      Save
    </CButton>
  )}
{
  updateStatus == true && (
    <CButton className="form-btn" onClick={updateClick}>
      Update
    </CButton>
  )}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      <CRow className="mt-3">
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <h4 className='m-0'>Admin List</h4>
            </CCardHeader>
            <CCardBody>
            <CRow>
        <CCol>
        {admin.length > 0 && (
          <>
          <p className='mb-0 font-weight-bold'>Total : {total} row(s)</p>
          <div className='overflow'>
            <table className='emp-list-table'>
              <thead>
                <tr>
                  <th className="text-center" width={50} >No</th>
                  <th className='text-center' width={120}>UserName</th>
                  <th className='text-center' width={120}>UserCode</th>
                  <th className='text-center' width={120}>Password</th>
                  <th className='text-center' width={200} colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {admin.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td width={50} className="text-center">{index + 1}</td>
                      <td className="text-center" width={120}>{data.name}</td>
                      <td className="text-center" width={120}>{data.user_code}</td>
                      <td className="text-center" width={120}> {data.password}</td>
                      <td width={200} className='text-center'>
                              <div className="user-before">
                                <CImg
                                  src="/image/Edit-Component-inactive.svg"
                                  onClick={() => {
                                    editClick(data.id);
                                  }}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    cursor: "pointer",
                                  }}
                                ></CImg>
                                <CImg
                                  className="user-after"
                                  src="/image/Edit-Component-active.svg"
                                  onClick={() => {
                                    editClick(data.id);
                                  }}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    cursor: "pointer",
                                  }}
                                ></CImg>
                              </div>
                            </td>
                            <td width={200} className='text-center'>
                              <div className="user-before">
                                <CImg
                                  src="/image/Delete-Component-inactive.svg"
                                  onClick={() => delClick(data.id)}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    cursor: "pointer",
                                  }}
                                ></CImg>
                                <CImg
                                  className="user-after"
                                  src="/image/Delete-Component-active.svg"
                                  onClick={() => delClick(data.id)}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    cursor: "pointer",
                                  }}
                                ></CImg>
                              </div>
                            </td>
                      
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
        </CCol>
      </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <Confirmation
        show={confirmationModal}
        content={content}
        type={confirmType}
        saveOK={saveOK}
        confirmOK={confirmOK}
        updateOK={updateOK}
        deleteOK={deleteOK}
        cancel={() => setConfirmationModal(false)}
        cancelButton="Cancel"
        okButton="Yes"
      />
      <br></br>
      {total > 10 &&
        <NPagination
          activePage={currentPage}
          pages={lastPage}
          currentPage={currentPage}
          totalPage={lastPage}
          pagination={pagination}
        />
      }

    </>
  )
}

export default AdminRegAndListIndex