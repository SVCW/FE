import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetProfileByIdAction,
  UpdateProfileById,
} from '../../redux/actions/ProfileAction';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage_bucket } from '../../firebase';
import { http } from '../../utils/reponse';

const PersonalDetail = ({ setReloadPage, reloadPage }) => {
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [reloadData, setReloadData] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const { getUserId } = useSelector((root) => root.ProfileReducer);
  // useEffect(() => {
  //   const action = GetProfileByIdAction(localStorage.getItem('userID'));
  //   dispatch(action);
  // }, []);
  // const [userDetails, setUserDetails] = useState(
  //   JSON.parse(localStorage.getItem('getuserid'))
  // );
  const notify = () =>
    toast('Cập nhật thông tin thành công', {
      theme: 'dark',
    });
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({});

  useEffect(() => {
    http
      .get(`/User/get-user-by-id?UserId=${localStorage.getItem('userID')}`)
      .then((response) => {
        setInfo({
          userId: response.data.data.user.userId,
          username: response.data.data.user.username,
          fullName: response.data.data.user.fullName,
          phone: response.data.data.user.phone,
          email: response.data.data.user.email,
          gender: response.data.data.user.gender,
          image: response.data.data.user.image,
          coverImage: response.data.data.user.coverImage,
          dateOfBirth: response.data.data.user.dateOfBirth,
          status: response.data.data.user.status,
          roleId: response.data.data.user.roleId,
          numberActivityJoin: response.data.data.user.numberActivityJoin,
          numberActivitySuccess: response.data.data.user.numberActivitySuccess,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      info.fullName === '' ||
      info.fullName === null ||
      info.fullName?.trim() === ''
    ) {
      setFullNameError('Vui lòng không để trống họ và tên');
      return;
    } else {
      setFullNameError('');
    }

    if (phoneError) {
      return;
    }

    if (info.phone === '' || info.phone === null || info.phone?.trim() === '') {
      setPhoneError('Vui lòng không để trống số điện thoại');
      return;
    } else {
      setPhoneError('');
    }

    const payload = info;

    if (avatarImage) {
      try {
        const fileRef = ref(storage_bucket, avatarImage.name);
        const uploadTask = uploadBytesResumable(fileRef, avatarImage);

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === 'success') {
          const downloadURL = await getDownloadURL(snapshot.ref);
          payload.image = downloadURL;
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (coverImage) {
      try {
        const fileRef = ref(storage_bucket, coverImage.name);
        const uploadTask = uploadBytesResumable(fileRef, coverImage);

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === 'success') {
          const downloadURL = await getDownloadURL(snapshot.ref);
          payload.coverImage = downloadURL;
        }
      } catch (error) {
        console.log(error);
      }
    }

    // console.log(info);

    // const action1 = UpdateProfileById(info);
    const action1 = UpdateProfileById(payload);
    notify();
    await dispatch(action1);
    // const action2 = GetProfileByIdAction(userDetails?.userId);
    // const action2 = GetProfileByIdAction(localStorage.getItem('userID'));
    // await dispatch(action2);

    // setUserDetails(JSON.parse(localStorage.getItem('getuserid')));
    setIsEditing(false);
    setReloadData(!reloadData);
    setReloadPage(!reloadPage);
  };

  // if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="main-wraper">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h5 className="main-title">
          {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}
        </h5>
        <div style={{ width: '15%', alignSelf: 'baseline' }}>
          {!isEditing && (
            <a className="ask-qst" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </a>
          )}
        </div>
      </div>
      <div className="info-block-list">
        {!isEditing ? (
          <form class="row g-3">
            <div class="col-md-6">
              <label for="validationDefault01" class="form-label">
                Tài khoản
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault01"
                value={info?.username}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.fullName}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Giới tính
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.gender ? 'Nam' : 'Nữ'}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Email
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.email}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Số điện thoại
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.phone}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Ngày tham gia
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value="0"
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Sự kiện đã tham gia
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.numberActivityJoin}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Sự kiện hoàn thành
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.numberActivitySuccess}
                readOnly
              />
            </div>
          </form>
        ) : (
          <form class="row g-3" onSubmit={handleSubmit}>
            <div class="col-md-6">
              <label for="validationDefault01" class="form-label">
                Tài khoản
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault01"
                value={info?.username}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                class="form-control"
                id="validationDefault02"
                value={info?.fullName}
                required
                onChange={(e) => {
                  setInfo({
                    ...info,
                    fullName: e.target.value,
                  });
                }}
              />
              {fullNameError && (
                <div style={{ color: 'red' }}>{fullNameError}</div>
              )}
            </div>
            <div class="col-md-6">
              <label for="validationDefault03" class="form-label">
                Giới tính
              </label>
              <select
                class="form-select"
                aria-label="Default select example"
                value={info?.gender ? 'Nam' : 'Nu'}
                onChange={(e) => {
                  setInfo({
                    ...info,
                    gender: e.target.value,
                  });
                }}
              >
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="validationDefault04" class="form-label">
                Email
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault04"
                value={info?.email}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault05" class="form-label">
                Số điện thoại
              </label>
              <input
                type="text"
                class="form-control"
                id="validationDefault05"
                value={info?.phone}
                onChange={(e) => {
                  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

                  const phone = e.target.value;
                  // eslint-disable-next-line no-unused-expressions
                  phone.match(regexPhoneNumber)
                    ? setPhoneError('')
                    : setPhoneError('Số điện thoại không đúng định dạng');
                  setInfo({ ...info, phone });
                }}
                required
              />
              {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}
            </div>
            <div class="col-md-6">
              <label for="validationDefault06" class="form-label">
                Ngày tham gia
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault06"
                value="0"
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault07" class="form-label">
                Sự kiện đã tham gia
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault07"
                value={info?.numberActivityJoin}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault08" class="form-label">
                Sự kiện hoàn thành
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault08"
                value={info?.numberActivitySuccess}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="formFile1" class="form-label">
                Ảnh đại diện
              </label>
              <input
                class="form-control"
                type="file"
                id="formFile1"
                onChange={(e) => {
                  setAvatarImage(e.target.files[0]);
                }}
              />
            </div>
            <div class="col-md-6">
              <label for="formFile2" class="form-label">
                Ảnh bìa
              </label>
              <input
                class="form-control"
                type="file"
                id="formFile2"
                onChange={(e) => {
                  setCoverImage(e.target.files[0]);
                }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
              <button
                style={{ marginLeft: 10 }}
                className="ask-qst btn btn-danger"
                onClick={() => setIsEditing(false)}
              >
                Huỷ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalDetail;
